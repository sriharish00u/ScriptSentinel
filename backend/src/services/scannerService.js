const mongoose = require('mongoose');
const RestrictedTerm = require('../models/RestrictedTerm');
const { restrictedTermsData } = require('../data/seedData');

/**
 * Escapes regex special characters
 */
function escapeRegex(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Scans input text against platform restricted terms database
 */
async function scanText({ text, platform = 'all' }) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return {
      wordCount: 0,
      charCount: 0,
      shadowbanRiskScore: 0,
      riskLevel: 'Clean',
      flaggedCount: 0,
      flaggedTerms: [],
      matches: [],
      severityBreakdown: { critical: 0, high: 0, moderate: 0, low: 0 },
      safeRewrittenText: '',
      platform,
    };
  }

  // Fetch active terms from DB with fallback to seed data
  let allTerms = restrictedTermsData;
  if (mongoose.connection.readyState === 1) {
    try {
      const dbTerms = await RestrictedTerm.find({}).maxTimeMS(3000);
      if (dbTerms && dbTerms.length > 0) {
        allTerms = dbTerms;
      }
    } catch (err) {
      allTerms = restrictedTermsData;
    }
  }

  // Filter terms by platform
  const activeTerms = allTerms.filter(t => {
    if (!platform || platform === 'all') return true;
    return t.platforms.includes('all') || t.platforms.includes(platform.toLowerCase());
  });

  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const charCount = text.length;

  const matches = [];
  const flaggedTermsMap = new Map();
  const severityBreakdown = { critical: 0, high: 0, moderate: 0, low: 0 };

  // Sort terms by length descending so longer multi-word phrases match before subsets
  const sortedTerms = [...activeTerms].sort((a, b) => b.term.length - a.term.length);

  // We scan using word boundary regex
  for (const termDoc of sortedTerms) {
    const rawTerm = termDoc.term.toLowerCase();
    const regexPattern = new RegExp(`\\b${escapeRegex(rawTerm)}\\b`, 'gi');

    let match;
    while ((match = regexPattern.exec(text)) !== null) {
      const matchText = match[0];
      const startIndex = match.index;
      const endIndex = startIndex + matchText.length;

      // Check if overlapping with existing matches
      const isOverlapping = matches.some(
        m => (startIndex >= m.startIndex && startIndex < m.endIndex) ||
             (endIndex > m.startIndex && endIndex <= m.endIndex)
      );

      if (!isOverlapping) {
        matches.push({
          term: rawTerm,
          matchedText: matchText,
          startIndex,
          endIndex,
          severity: termDoc.severity,
          category: termDoc.category,
          riskScore: termDoc.riskScore || 75,
          reason: termDoc.reason,
          safeAlternatives: termDoc.safeAlternatives || [],
          platforms: termDoc.platforms,
        });

        // Track aggregate statistics
        severityBreakdown[termDoc.severity] = (severityBreakdown[termDoc.severity] || 0) + 1;

        if (!flaggedTermsMap.has(rawTerm)) {
          flaggedTermsMap.set(rawTerm, {
            term: rawTerm,
            severity: termDoc.severity,
            category: termDoc.category,
            riskScore: termDoc.riskScore || 75,
            reason: termDoc.reason,
            consequences: termDoc.consequences || [],
            safeAlternatives: termDoc.safeAlternatives || [],
            occurrences: 1,
          });
        } else {
          const existing = flaggedTermsMap.get(rawTerm);
          existing.occurrences += 1;
        }
      }
    }
  }

  // Sort matches by startIndex for sequential highlight reconstruction
  matches.sort((a, b) => a.startIndex - b.startIndex);

  // Calculate Shadowban Risk Score (0 - 100)
  let rawScore = 0;
  rawScore += (severityBreakdown.critical || 0) * 35;
  rawScore += (severityBreakdown.high || 0) * 20;
  rawScore += (severityBreakdown.moderate || 0) * 10;
  rawScore += (severityBreakdown.low || 0) * 5;

  // Density multiplier relative to word count
  const density = wordCount > 0 ? (matches.length / wordCount) * 100 : 0;
  if (density > 5) {
    rawScore += 15;
  }

  const shadowbanRiskScore = Math.min(100, Math.max(0, Math.round(rawScore)));

  let riskLevel = 'Clean';
  if (shadowbanRiskScore >= 75) {
    riskLevel = 'Critical / Instant Ban Risk';
  } else if (shadowbanRiskScore >= 45) {
    riskLevel = 'High / Shadowban Likely';
  } else if (shadowbanRiskScore >= 15) {
    riskLevel = 'Moderate / Caution Required';
  }

  // Generate safe rewritten text by applying top recommended alternative
  let safeRewrittenText = text;
  // Apply from end to start to avoid index shifting
  const reverseMatches = [...matches].sort((a, b) => b.startIndex - a.startIndex);
  for (const m of reverseMatches) {
    const replacement = (m.safeAlternatives && m.safeAlternatives.length > 0)
      ? m.safeAlternatives[0]
      : `[algo-safe: ${m.term}]`;

    safeRewrittenText =
      safeRewrittenText.slice(0, m.startIndex) +
      replacement +
      safeRewrittenText.slice(m.endIndex);
  }

  return {
    wordCount,
    charCount,
    shadowbanRiskScore,
    riskLevel,
    flaggedCount: matches.length,
    flaggedTerms: Array.from(flaggedTermsMap.values()),
    matches,
    severityBreakdown,
    safeRewrittenText,
    platform,
  };
}

module.exports = {
  scanText,
};

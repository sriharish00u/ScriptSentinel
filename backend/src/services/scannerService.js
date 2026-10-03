const { analyzeScriptWithAI } = require('./aiService');
const RestrictedTerm = require('../models/RestrictedTerm');
const User = require('../models/User');

const buildOldFormatFromAiResponse = (aiRes, text, platform) => {
  // Try to match AI flagged segments to positions in text
  const matches = [];
  const flaggedTermsMap = new Map();
  const severityBreakdown = { critical: 0, high: 0, moderate: 0, low: 0 };
  let wordCount = text.trim().split(/\s+/).filter(Boolean).length;

  for (const seg of aiRes.flaggedSegments) {
    const rawTerm = seg.originalText.toLowerCase();
    const regexPattern = new RegExp(`\\b${rawTerm.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'gi');
    
    let m;
    while ((m = regexPattern.exec(text)) !== null) {
      if (!matches.some(existing => (m.index >= existing.startIndex && m.index < existing.endIndex))) {
        matches.push({
          term: rawTerm,
          matchedText: m[0],
          startIndex: m.index,
          endIndex: m.index + m[0].length,
          severity: seg.severity,
          category: seg.category,
          riskScore: seg.severity === 'critical' ? 95 : 75,
          reason: seg.reason,
          safeAlternatives: seg.suggestedReplacements || [],
          platforms: [platform],
        });

        severityBreakdown[seg.severity] = (severityBreakdown[seg.severity] || 0) + 1;

        if (!flaggedTermsMap.has(rawTerm)) {
          flaggedTermsMap.set(rawTerm, {
            term: rawTerm,
            severity: seg.severity,
            category: seg.category,
            reason: seg.reason,
            consequences: [seg.platformConsequence],
            safeAlternatives: seg.suggestedReplacements || [],
            occurrences: 1,
          });
        } else {
          flaggedTermsMap.get(rawTerm).occurrences += 1;
        }
      }
    }
  }

  matches.sort((a, b) => a.startIndex - b.startIndex);

  return {
    wordCount,
    charCount: text.length,
    shadowbanRiskScore: aiRes.shadowbanRiskScore,
    riskLevel: aiRes.riskLevel,
    executiveSummary: aiRes.executiveSummary,
    flaggedCount: matches.length,
    flaggedTerms: Array.from(flaggedTermsMap.values()),
    matches,
    severityBreakdown,
    first30SecAssessment: aiRes.first30SecAssessment,
    safeRewrittenText: aiRes.safeRewrittenScript,
    platformTips: aiRes.platformTips,
    platform,
  };
};

/**
 * Enhanced Scanner combining Custom User Rules + Generative AI Verification
 */
async function scanText({ text, platform = 'all', userId = null }) {
  let customRules = [];
  
  if (userId) {
    try {
      const user = await User.findById(userId);
      if (user && user.customTriggers) {
        customRules = user.customTriggers;
      }
    } catch (_) {}
  }

  const aiAnalysis = await analyzeScriptWithAI({ text, platform, customRules });
  return buildOldFormatFromAiResponse(aiAnalysis, text, platform);
}

module.exports = {
  scanText,
};

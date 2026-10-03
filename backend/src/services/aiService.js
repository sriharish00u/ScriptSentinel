const { GoogleGenerativeAI } = require('@google/generative-ai');

const GEMINI_API_KEY = process.env.GEMINI_API_KEY || 'AIzaSyBOsER6NC-MtUxHS3BjXR6kagGXVcjIN9w';

let genAI = null;
try {
  if (GEMINI_API_KEY) {
    genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
  }
} catch (err) {
  console.warn('[AI Service] Gemini initialization notice:', err.message);
}

/**
 * AI-powered Script and Compliance Analysis Engine
 */
async function analyzeScriptWithAI({ text, platform = 'all', customRules = [], videoTimestamps = [] }) {
  if (!text || typeof text !== 'string' || text.trim() === '') {
    return {
      shadowbanRiskScore: 0,
      riskLevel: 'Clean',
      executiveSummary: 'No script text provided.',
      flaggedSegments: [],
      first30SecAssessment: { hasViolations: false, riskLevel: 'Clean', warning: 'No violations in opening.' },
      safeRewrittenScript: '',
      platformTips: [],
    };
  }

  // Attempt Gemini API Analysis
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `
You are ScriptSentinel AI, the world's most advanced 2026 Algorithmic Compliance and Shadowban Detection Engine.
Analyze the following creator script / ad copy for strict platform compliance on: "${platform.toUpperCase()}".

Target Policies & Algorithms to enforce:
1. TikTok: 2026 Body Image & Weight Loss restrictions ("weight loss", "diet", "fat burner", "belly fat", before-and-after promises), speech safety filters ("kill" -> "unalive", "suicide" -> "self-departure"), fake engagement ("follow for follow", "DM for info").
2. YouTube: Opening 30-Second Demonetization (Yellow Dollar) rule on sensitive crime, violence, murder, tragic events, and profanity.
3. Meta (FB & IG Ads): Policy 4.6 Unrealistic Health Claims, Biz-Opp income guarantees ("make $10,000/mo", "passive income"), engagement bait ("giveaway", "tag 3 friends"), copyright/trademark infringement ("botox alternative").
4. Google Ads: Misleading claims, uncertified medical/supplement assertions, housing/employment discrimination.

Custom Brand Rules:
${JSON.stringify(customRules, null, 2)}

User Script to Analyze:
"""
${text}
"""

Return a strictly valid JSON object (no markdown quotes, no triple backticks, ONLY pure JSON) matching this exact schema:
{
  "shadowbanRiskScore": <number between 0 and 100>,
  "riskLevel": "<Clean | Caution Advised | High Shadowban Risk | Critical Ban Risk>",
  "executiveSummary": "<2 sentence summary of overall compliance risk and impact on distribution>",
  "flaggedSegments": [
    {
      "originalText": "<exact phrase matched in script>",
      "severity": "<critical | high | moderate | low>",
      "category": "<health_medical | financial_guarantees | sensitive_violence | engagement_bait | weapons_drugs | trademark | general_compliance>",
      "reason": "<clear explanation of why algorithm suppresses or penalizes this>",
      "platformConsequence": "<e.g. FYP reach throttled, Yellow Dollar demonetization, Ad account ban>",
      "suggestedReplacements": ["<algo-safe option 1>", "<algo-safe option 2>", "<algo-safe option 3>"]
    }
  ],
  "first30SecAssessment": {
    "hasViolations": <true or false>,
    "riskLevel": "<Clean | Caution | Critical>",
    "warning": "<guidance on whether opening hook triggers the YouTube 30-sec yellow dollar rule or TikTok drop>"
  },
  "safeRewrittenScript": "<complete sanitized version of script with all risky words swapped for algo-safe alternatives while maintaining 100% of creator tone, hook energy, and conversion punch>",
  "platformTips": ["<actionable optimization tip 1>", "<actionable optimization tip 2>"]
}
`;

      const response = await model.generateContent(prompt);
      const rawResponseText = response.response.text();

      // Clean markdown codeblocks if returned
      const cleanedJsonText = rawResponseText
        .replace(/^```json\s*/i, '')
        .replace(/^```\s*/i, '')
        .replace(/```\s*$/i, '')
        .trim();

      const parsed = JSON.parse(cleanedJsonText);
      return parsed;
    } catch (aiErr) {
      console.warn('[AI Service] Gemini API call fallback to heuristic engine:', aiErr.message);
    }
  }

  // Smart Heuristic AI Fallback Analyzer
  return fallbackAiAnalysis(text, platform, customRules);
}

function fallbackAiAnalysis(text, platform, customRules = []) {
  const dictionary = [
    { term: 'weight loss', alt: 'wellness journey', severity: 'critical', category: 'health_medical', reason: 'Triggers automated body image policies & ad disapprovals.' },
    { term: 'fat burner', alt: 'metabolic support formula', severity: 'critical', category: 'health_medical', reason: 'Classified as unproven supplement / dangerous dietary aid.' },
    { term: 'cure', alt: 'supports recovery', severity: 'critical', category: 'health_medical', reason: 'Strictly prohibited medical claim without certification.' },
    { term: 'diet', alt: 'nutrition routine', severity: 'high', category: 'health_medical', reason: 'TikTok throttles organic video reach containing diet.' },
    { term: 'giveaway', alt: 'community celebration', severity: 'high', category: 'engagement_bait', reason: 'Engagement bait policy trigger on Instagram.' },
    { term: 'crypto giveaway', alt: 'community rewards program', severity: 'critical', category: 'financial_guarantees', reason: 'Phishing spam and wallet draining detection keyword.' },
    { term: 'guaranteed income', alt: 'revenue framework', severity: 'critical', category: 'financial_guarantees', reason: 'Biz-opp and FTC compliance violation.' },
    { term: 'kill', alt: 'unalive', severity: 'critical', category: 'sensitive_violence', reason: 'Speech safety filter causing video suppression.' },
    { term: 'murder', alt: 'unlawful passing', severity: 'high', category: 'sensitive_violence', reason: 'YouTube demonetization trigger if spoken in opening 30 seconds.' },
    { term: 'suicide', alt: 'self-departure', severity: 'critical', category: 'sensitive_violence', reason: 'Crisis safety filter; locks distribution.' },
    { term: 'make $10,000/month', alt: 'scale high-value client revenue', severity: 'critical', category: 'financial_guarantees', reason: 'Unsubstantiated income claim policy.' },
    { term: 'botox alternative', alt: 'anti-aging peptide serum', severity: 'high', category: 'trademark', reason: 'Trademark violation plus unlicensed medical comparison.' },
    { term: 'dm me for info', alt: 'full details linked in bio', severity: 'moderate', category: 'engagement_bait', reason: 'Funnel circumvention detection off-platform.' },
  ];

  const allRules = [
    ...dictionary,
    ...customRules.map(r => ({
      term: r.term,
      alt: r.safeAlternative || 'algo-safe',
      severity: r.severity || 'high',
      category: 'custom_rule',
      reason: r.reason || 'Custom brand rule violation',
    })),
  ];

  const flaggedSegments = [];
  let rewritten = text;
  let score = 0;

  for (const item of allRules) {
    const regex = new RegExp(`\\b${item.term}\\b`, 'gi');
    let match;
    while ((match = regex.exec(text)) !== null) {
      flaggedSegments.push({
        originalText: match[0],
        severity: item.severity,
        category: item.category,
        reason: item.reason,
        platformConsequence: item.severity === 'critical' ? 'Ad disapproval / Forced reach lock' : 'Algorithmic reach throttle',
        suggestedReplacements: [item.alt],
      });
      score += item.severity === 'critical' ? 35 : 20;
      rewritten = rewritten.replace(match[0], item.alt);
    }
  }

  const finalScore = Math.min(100, score);
  const openingText = text.slice(0, 150).toLowerCase();
  const hasOpeningViolation = openingText.includes('kill') || openingText.includes('murder') || openingText.includes('suicide') || openingText.includes('cure');

  return {
    shadowbanRiskScore: finalScore,
    riskLevel: finalScore >= 75 ? 'Critical Ban Risk' : finalScore >= 45 ? 'High Shadowban Risk' : finalScore > 0 ? 'Caution Advised' : 'Clean',
    executiveSummary: finalScore > 0
      ? `Found ${flaggedSegments.length} platform compliance triggers. Algorithm will throttle reach unless sanitized.`
      : 'Excellent compliance score! Script is fully aligned with 2026 algorithmic standards.',
    flaggedSegments,
    first30SecAssessment: {
      hasViolations: hasOpeningViolation,
      riskLevel: hasOpeningViolation ? 'Critical' : 'Clean',
      warning: hasOpeningViolation
        ? 'Sensitive terms detected in opening 30 seconds. Replace before publishing to avoid YouTube yellow dollar demonetization.'
        : 'Opening hook is compliant with advertiser-friendly guidelines.',
    },
    safeRewrittenScript: rewritten,
    platformTips: [
      'Focus ad copy on user habits and daily vitality rather than guaranteed numerical transformations.',
      'Maintain hook pacing and keep critical keywords within safe algorithmic vocabularies.',
    ],
  };
}

module.exports = {
  analyzeScriptWithAI,
};

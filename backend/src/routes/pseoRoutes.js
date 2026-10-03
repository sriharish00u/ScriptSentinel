const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const PseoKeyword = require('../models/PseoKeyword');
const { pseoKeywordsData, restrictedTermsData } = require('../data/seedData');

/**
 * @route GET /api/v1/pseo/keywords
 * @desc Get all programmatic SEO landing page keyword routes
 */
router.get('/keywords', async (req, res) => {
  try {
    let keywords = [];
    if (mongoose.connection.readyState === 1) {
      keywords = await PseoKeyword.find({}).sort({ searchVolume: -1 });
    }

    if (!keywords || keywords.length === 0) {
      keywords = pseoKeywordsData;
    }

    return res.json({
      success: true,
      count: keywords.length,
      data: keywords,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/pseo/page/:slug
 * @desc Get full payload for dynamic pSEO page
 */
router.get('/page/:slug', async (req, res) => {
  try {
    const { slug } = req.params;

    let pageData = null;
    if (mongoose.connection.readyState === 1) {
      pageData = await PseoKeyword.findOne({ slug: slug.toLowerCase() });
    }

    if (!pageData) {
      pageData = pseoKeywordsData.find(p => p.slug === slug.toLowerCase());
    }

    // If still not matched, synthesize pSEO page dynamically from restricted terms dictionary
    if (!pageData) {
      const termMatch = restrictedTermsData.find(
        t => t.slug === slug.toLowerCase() || slug.toLowerCase().includes(t.slug)
      );
      if (termMatch) {
        pageData = {
          keyword: `is ${termMatch.term} banned on social media and ads`,
          slug: termMatch.slug,
          platform: termMatch.platforms[0] || 'all',
          targetTerm: termMatch.term,
          titleTag: `Is "${termMatch.term}" Banned or Shadowbanned? (2026 Algorithmic Rules)`,
          metaDescription: `Detailed 2026 compliance breakdown on why "${termMatch.term}" triggers algorithmic suppression and how to use algo-safe alternatives.`,
          h1: `Is "${termMatch.term}" Banned or Shadowbanned in 2026?`,
          verdict: termMatch.severity === 'critical' ? 'Banned / Restricted' : 'High Shadowban Risk',
          explanation: termMatch.explanation || termMatch.reason,
          safeAlternatives: termMatch.safeAlternatives,
          policyReference: `${termMatch.category.toUpperCase()} Compliance Standard (2026)`,
          faqItems: [
            {
              question: `Why is "${termMatch.term}" flagged by algorithms?`,
              answer: termMatch.reason,
            },
            {
              question: `What happens if I use "${termMatch.term}" in my script or ad?`,
              answer: termMatch.consequences.join(', '),
            },
            {
              question: `What is the safest alternative to "${termMatch.term}"?`,
              answer: `Try using "${termMatch.safeAlternatives.join('" or "')}" instead.`,
            },
          ],
          searchVolume: 2400,
        };
      }
    }

    if (!pageData) {
      return res.status(404).json({ success: false, error: 'Programmatic SEO page not found.' });
    }

    return res.json({
      success: true,
      data: pageData,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

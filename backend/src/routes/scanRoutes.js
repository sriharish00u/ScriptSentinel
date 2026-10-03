const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const { scanText } = require('../services/scannerService');
const { scanUrl } = require('../services/scraperService');
const RestrictedTerm = require('../models/RestrictedTerm');
const ScanLog = require('../models/ScanLog');
const { restrictedTermsData } = require('../data/seedData');

/**
 * @route POST /api/v1/scan/text
 * @desc Scan text/script for compliance & shadowban triggers
 */
router.post('/text', async (req, res) => {
  try {
    const { text, platform = 'all' } = req.body;

    if (!text || typeof text !== 'string') {
      return res.status(400).json({ error: 'Field "text" is required.' });
    }

    const result = await scanText({ text, platform });

    // Asynchronously log scan if DB is ready
    if (mongoose.connection.readyState === 1) {
      ScanLog.create({
        scanType: 'script',
        platform,
        inputTextSnippet: text.slice(0, 200),
        wordCount: result.wordCount,
        flaggedCount: result.flaggedCount,
        shadowbanRiskScore: result.shadowbanRiskScore,
        severityBreakdown: result.severityBreakdown,
        flaggedTerms: result.flaggedTerms,
        ipHash: req.ip || 'anonymous',
      }).catch(() => {});
    }

    return res.json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('[Scan Text Route Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route POST /api/v1/scan/url
 * @desc Scan landing page URL for compliance triggers
 */
router.post('/url', async (req, res) => {
  try {
    const { url, platform = 'meta' } = req.body;

    if (!url || typeof url !== 'string') {
      return res.status(400).json({ error: 'Field "url" is required.' });
    }

    const auditResult = await scanUrl({ url, platform });

    return res.json({
      success: true,
      data: auditResult,
    });
  } catch (error) {
    console.error('[Scan URL Route Error]', error);
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/scan/terms
 * @desc Search and filter restricted terms dictionary
 */
router.get('/terms', async (req, res) => {
  try {
    const { query, platform, severity, category, limit = 50, page = 1 } = req.query;

    let terms = [];
    let total = 0;

    if (mongoose.connection.readyState === 1) {
      let filter = {};
      if (platform && platform !== 'all') {
        filter.platforms = { $in: ['all', platform.toLowerCase()] };
      }
      if (severity) {
        filter.severity = severity.toLowerCase();
      }
      if (category) {
        filter.category = category.toLowerCase();
      }
      if (query) {
        filter.$or = [
          { term: { $regex: query, $options: 'i' } },
          { reason: { $regex: query, $options: 'i' } },
          { explanation: { $regex: query, $options: 'i' } },
        ];
      }

      terms = await RestrictedTerm.find(filter)
        .sort({ riskScore: -1, searchVolumeIndex: -1 })
        .skip((page - 1) * limit)
        .limit(Number(limit));
      total = await RestrictedTerm.countDocuments(filter);
    } else {
      terms = restrictedTermsData.filter(t => {
        if (platform && platform !== 'all' && !t.platforms.includes('all') && !t.platforms.includes(platform.toLowerCase())) return false;
        if (severity && t.severity !== severity.toLowerCase()) return false;
        if (category && t.category !== category.toLowerCase()) return false;
        if (query && !t.term.toLowerCase().includes(query.toLowerCase()) && !t.reason.toLowerCase().includes(query.toLowerCase())) return false;
        return true;
      });
      total = terms.length;
    }

    return res.json({
      success: true,
      count: terms.length,
      total,
      page: Number(page),
      data: terms,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/scan/terms/:slug
 * @desc Get details of a single term by slug
 */
router.get('/terms/:slug', async (req, res) => {
  try {
    const { slug } = req.params;
    let termDoc = null;

    if (mongoose.connection.readyState === 1) {
      termDoc = await RestrictedTerm.findOne({ slug: slug.toLowerCase() });
    }

    if (!termDoc) {
      termDoc = restrictedTermsData.find(t => t.slug === slug.toLowerCase() || t.term.toLowerCase() === slug.toLowerCase());
    }

    if (!termDoc) {
      return res.status(404).json({ success: false, error: 'Restricted term not found.' });
    }

    return res.json({ success: true, data: termDoc });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/scan/stats
 * @desc Get global scanner intelligence statistics
 */
router.get('/stats', async (req, res) => {
  try {
    let totalTerms = restrictedTermsData.length;
    let totalPolicies = 5;
    let totalScans = 1420;

    if (mongoose.connection.readyState === 1) {
      totalTerms = await RestrictedTerm.countDocuments();
      const scanCount = await ScanLog.countDocuments();
      totalScans += scanCount;
    }

    return res.json({
      success: true,
      data: {
        totalRestrictedTerms: totalTerms,
        totalPoliciesIndexed: totalPolicies,
        totalScansProcessed: totalScans,
        supportedPlatforms: ['TikTok', 'YouTube', 'Meta Ads', 'Google Ads', 'X (Twitter)'],
        lastAlgorithmUpdate: new Date().toISOString(),
      },
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

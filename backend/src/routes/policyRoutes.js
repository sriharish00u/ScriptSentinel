const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const PlatformPolicy = require('../models/PlatformPolicy');
const { platformPoliciesData } = require('../data/seedData');

/**
 * @route GET /api/v1/policies
 * @desc Get all platform industry compliance policies
 */
router.get('/', async (req, res) => {
  try {
    const { platform } = req.query;
    let policies = [];

    if (mongoose.connection.readyState === 1) {
      let query = {};
      if (platform && platform !== 'all') {
        query.platform = platform.toLowerCase();
      }
      policies = await PlatformPolicy.find(query).sort({ platform: 1, industry: 1 });
    }

    if (!policies || policies.length === 0) {
      policies = platformPoliciesData.filter(p => {
        if (platform && platform !== 'all' && p.platform !== platform.toLowerCase()) return false;
        return true;
      });
    }

    return res.json({
      success: true,
      count: policies.length,
      data: policies,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

/**
 * @route GET /api/v1/policies/:platform/:industry
 * @desc Get policy by platform and industry slug
 */
router.get('/:platform/:industry', async (req, res) => {
  try {
    const { platform, industry } = req.params;

    let policy = null;
    if (mongoose.connection.readyState === 1) {
      policy = await PlatformPolicy.findOne({
        platform: platform.toLowerCase(),
        slug: industry.toLowerCase(),
      });
    }

    if (!policy) {
      policy = platformPoliciesData.find(
        p => p.platform === platform.toLowerCase() && p.slug === industry.toLowerCase()
      );
    }

    if (!policy) {
      return res.status(404).json({ success: false, error: 'Policy guidelines not found.' });
    }

    return res.json({
      success: true,
      data: policy,
    });
  } catch (error) {
    return res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;

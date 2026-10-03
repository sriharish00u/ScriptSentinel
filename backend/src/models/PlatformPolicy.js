const mongoose = require('mongoose');

const PlatformPolicySchema = new mongoose.Schema({
  platform: {
    type: String,
    enum: ['tiktok', 'youtube', 'meta', 'google', 'x'],
    required: true,
    index: true,
  },
  industry: {
    type: String,
    required: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
  },
  summary: {
    type: String,
    required: true,
  },
  prohibitedPractices: {
    type: [String],
    default: [],
  },
  restrictedKeywords: {
    type: [String],
    default: [],
  },
  requiredDisclaimers: {
    type: [String],
    default: [],
  },
  algoSafeTips: {
    type: [String],
    default: [],
  },
  officialPolicyUrl: {
    type: String,
    default: '',
  },
  lastReviewedYear: {
    type: Number,
    default: 2026,
  },
}, {
  timestamps: true,
});

PlatformPolicySchema.index({ platform: 1, industry: 1 }, { unique: true });

module.exports = mongoose.models.PlatformPolicy || mongoose.model('PlatformPolicy', PlatformPolicySchema);

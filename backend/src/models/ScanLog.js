const mongoose = require('mongoose');

const ScanLogSchema = new mongoose.Schema({
  scanType: {
    type: String,
    enum: ['script', 'url', 'ad_copy'],
    default: 'script',
  },
  platform: {
    type: String,
    enum: ['all', 'tiktok', 'youtube', 'meta', 'google', 'x'],
    default: 'all',
  },
  inputTextSnippet: {
    type: String,
  },
  targetUrl: {
    type: String,
  },
  wordCount: {
    type: Number,
    default: 0,
  },
  flaggedCount: {
    type: Number,
    default: 0,
  },
  shadowbanRiskScore: {
    type: Number,
    min: 0,
    max: 100,
    default: 0,
  },
  severityBreakdown: {
    critical: { type: Number, default: 0 },
    high: { type: Number, default: 0 },
    moderate: { type: Number, default: 0 },
    low: { type: Number, default: 0 },
  },
  flaggedTerms: [{
    term: String,
    severity: String,
    category: String,
    reason: String,
    suggestedAlternatives: [String],
    occurrences: Number,
  }],
  ipHash: {
    type: String,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.ScanLog || mongoose.model('ScanLog', ScanLogSchema);

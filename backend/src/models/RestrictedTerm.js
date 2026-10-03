const mongoose = require('mongoose');

const RestrictedTermSchema = new mongoose.Schema({
  term: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    lowercase: true,
    index: true,
  },
  platforms: {
    type: [String],
    enum: ['all', 'tiktok', 'youtube', 'meta', 'google', 'x'],
    default: ['all'],
    index: true,
  },
  severity: {
    type: String,
    enum: ['critical', 'high', 'moderate', 'low'],
    required: true,
    default: 'high',
    index: true,
  },
  category: {
    type: String,
    enum: [
      'health_medical',
      'financial_guarantees',
      'sensitive_violence',
      'profanity_slang',
      'engagement_bait',
      'copyright_trademark',
      'weapons_drugs',
      'political_sensitive',
      'general_compliance',
    ],
    required: true,
    index: true,
  },
  riskScore: {
    type: Number,
    min: 1,
    max: 100,
    default: 75,
  },
  reason: {
    type: String,
    required: true,
  },
  consequences: {
    type: [String],
    default: ['Algorithmic suppression', 'Ad disapproval'],
  },
  safeAlternatives: {
    type: [String],
    default: [],
  },
  explanation: {
    type: String,
  },
  searchVolumeIndex: {
    type: Number,
    default: 80,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

RestrictedTermSchema.index({ term: 1, platforms: 1 });

module.exports = mongoose.models.RestrictedTerm || mongoose.model('RestrictedTerm', RestrictedTermSchema);

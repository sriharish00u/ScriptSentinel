const mongoose = require('mongoose');

const PseoKeywordSchema = new mongoose.Schema({
  keyword: {
    type: String,
    required: true,
    index: true,
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  platform: {
    type: String,
    required: true,
    index: true,
  },
  targetTerm: {
    type: String,
    required: true,
  },
  titleTag: {
    type: String,
    required: true,
  },
  metaDescription: {
    type: String,
    required: true,
  },
  h1: {
    type: String,
    required: true,
  },
  verdict: {
    type: String,
    enum: ['Banned / Restricted', 'High Shadowban Risk', 'Context-Dependent Warning', 'Allowed with Disclaimers'],
    default: 'High Shadowban Risk',
  },
  explanation: {
    type: String,
    required: true,
  },
  safeAlternatives: {
    type: [String],
    default: [],
  },
  policyReference: {
    type: String,
  },
  faqItems: [{
    question: String,
    answer: String,
  }],
  searchVolume: {
    type: Number,
    default: 1200,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.models.PseoKeyword || mongoose.model('PseoKeyword', PseoKeywordSchema);

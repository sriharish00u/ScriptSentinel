const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    index: true,
  },
  password: {
    type: String,
    required: true,
  },
  tier: {
    type: String,
    enum: ['free', 'creator', 'agency', 'enterprise'],
    default: 'free',
  },
  apiKey: {
    type: String,
    unique: true,
    sparse: true,
  },
  customTriggers: [{
    term: { type: String, required: true, lowercase: true, trim: true },
    safeAlternative: { type: String, required: true },
    severity: { type: String, enum: ['critical', 'high', 'moderate', 'low'], default: 'high' },
    reason: { type: String, default: 'Custom brand rule violation' },
  }],
}, {
  timestamps: true,
});

module.exports = mongoose.models.User || mongoose.model('User', UserSchema);

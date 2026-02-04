const mongoose = require('mongoose');

const sessionSchema = new mongoose.Schema(
  {
    jti: { type: String, required: true, unique: true, index: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    lastActivity: { type: Date, required: true },
    expiresAt: { type: Date, required: true, index: true },
    revoked: { type: Boolean, default: false, index: true }
  },
  { timestamps: true }
);

module.exports = mongoose.model('Session', sessionSchema);

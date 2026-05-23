const mongoose = require('mongoose');
const crypto = require('crypto');

const sessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    refreshTokenHash: {
      type: String,
      required: true,
      index: true,
    },
    device: {
      userAgent: String,
      ipAddress: String,
      fingerprint: String, // Generated from userAgent + ipAddress
    },
    isRevoked: {
      type: Boolean,
      default: false,
      index: true,
    },
    expiresAt: {
      type: Date,
      required: true,
      index: true,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
    lastUsedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Auto-delete expired sessions after expiresAt
sessionSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Hash refresh token for storage (never store plain token)
sessionSchema.statics.hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

// Verify refresh token against stored hash
sessionSchema.methods.verifyToken = function(token) {
  const hash = crypto.createHash('sha256').update(token).digest('hex');
  return this.refreshTokenHash === hash && !this.isRevoked && new Date() < this.expiresAt;
};

// Revoke session
sessionSchema.methods.revoke = async function() {
  this.isRevoked = true;
  this.revokedAt = new Date();
  return this.save();
};

// Clean old sessions for a user (keep last 5 active sessions)
sessionSchema.statics.cleanOldSessions = async function(userId, keepCount = 5) {
  const sessions = await this.find({ userId, isRevoked: false })
    .sort({ createdAt: -1 });
  
  if (sessions.length > keepCount) {
    const oldSessions = sessions.slice(keepCount);
    const oldIds = oldSessions.map(s => s._id);
    await this.updateMany({ _id: { $in: oldIds } }, { isRevoked: true, revokedAt: new Date() });
  }
};

module.exports = mongoose.model('Session', sessionSchema);

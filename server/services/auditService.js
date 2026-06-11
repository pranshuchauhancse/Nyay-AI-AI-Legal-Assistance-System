const AuditLog = require('../models/AuditLog');
const logger = require('../utils/logger');

const writeAuditLog = async ({
  actor,
  action,
  entityType,
  entityId,
  before,
  after,
  metadata,
  req,
}) => {
  try {
    return await AuditLog.create({
      actor,
      action,
      entityType,
      entityId,
      before,
      after,
      metadata,
      ipAddress: req?.ip,
      userAgent: req?.headers?.['user-agent'],
    });
  } catch (error) {
    logger.error({ error: error.message, action, entityType, entityId }, 'audit_log_failed');
    return null;
  }
};

module.exports = {
  writeAuditLog,
};

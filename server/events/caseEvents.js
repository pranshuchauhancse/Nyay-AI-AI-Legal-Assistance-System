const eventBus = require('./eventBus');
const { writeAuditLog } = require('../services/auditService');
const { delByPattern } = require('../services/cacheService');
const logger = require('../utils/logger');

eventBus.on('CASE_CREATED', async (payload) => {
  await writeAuditLog({
    actor: payload.actor,
    action: 'CASE_CREATED',
    entityType: 'Case',
    entityId: payload.caseId,
    after: payload.after,
    req: payload.req,
  });
  await delByPattern('cases:*');
  logger.info({ caseId: payload.caseId }, 'case_created');
});

eventBus.on('CASE_UPDATED', async (payload) => {
  await writeAuditLog({
    actor: payload.actor,
    action: 'CASE_UPDATED',
    entityType: 'Case',
    entityId: payload.caseId,
    before: payload.before,
    after: payload.after,
    req: payload.req,
  });
  await delByPattern('cases:*');
  logger.info({ caseId: payload.caseId }, 'case_updated');
});

eventBus.on('CASE_DELETED', async (payload) => {
  await writeAuditLog({
    actor: payload.actor,
    action: 'CASE_DELETED',
    entityType: 'Case',
    entityId: payload.caseId,
    before: payload.before,
    req: payload.req,
  });
  await delByPattern('cases:*');
  logger.info({ caseId: payload.caseId }, 'case_deleted');
});

module.exports = eventBus;

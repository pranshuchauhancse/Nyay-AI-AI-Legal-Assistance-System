const logger = require('../utils/logger');

const sendNotification = async ({ to, subject, message }) => {
  logger.info('Notification queued', { to, subject, message });
  return { success: true };
};

module.exports = {
  sendNotification,
};

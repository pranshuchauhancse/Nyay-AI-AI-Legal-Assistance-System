const CASE_STATUSES = [
  'Filed',
  'Under Investigation',
  'In Hearing',
  'Resolved',
  'Closed',
];

const TRANSITIONS = {
  Filed: ['Under Investigation', 'In Hearing', 'Closed'],
  'Under Investigation': ['In Hearing', 'Resolved', 'Closed'],
  'In Hearing': ['Resolved', 'Closed'],
  Resolved: ['Closed'],
  Closed: [],
};

const STATUS_CHANGE_ROLES = new Set(['admin', 'judge', 'lawyer', 'police']);

const normalizeId = (value) => (value ? value.toString() : '');

const isCaseParticipant = (user, legalCase) => {
  if (!user || !legalCase) return false;

  const userId = normalizeId(user._id);
  const participantFields = [
    'createdBy',
    'assignedTo',
    'assignedLawyer',
    'policeOfficer',
    'judge',
  ];

  return participantFields.some((field) => normalizeId(legalCase[field]) === userId);
};

const canUpdateCase = (user, legalCase) => {
  if (!user || !legalCase) return false;
  if (user.role === 'admin' || user.role === 'judge') return true;
  return isCaseParticipant(user, legalCase);
};

const canDeleteCase = (user, legalCase) => {
  if (!user || !legalCase) return false;
  return user.role === 'admin' || normalizeId(legalCase.createdBy) === normalizeId(user._id);
};

const isValidStatus = (status) => CASE_STATUSES.includes(status);

const canTransition = (fromStatus, toStatus) => {
  if (fromStatus === toStatus) return true;
  return Boolean(TRANSITIONS[fromStatus]?.includes(toStatus));
};

const validateCaseCreation = (user, payload = {}) => {
  if (!payload.title) {
    const error = new Error('Title is required');
    error.statusCode = 400;
    throw error;
  }

  const status = payload.status || 'Filed';
  if (!isValidStatus(status)) {
    const error = new Error(`Invalid case status: ${status}`);
    error.statusCode = 400;
    throw error;
  }

  if (user?.role === 'citizen' && status !== 'Filed') {
    const error = new Error('Citizens can only create cases in Filed status');
    error.statusCode = 403;
    throw error;
  }
};

const validateCaseUpdate = (user, legalCase, updates = {}) => {
  if (!canUpdateCase(user, legalCase)) {
    const error = new Error('Forbidden: cannot update this case');
    error.statusCode = 403;
    throw error;
  }

  if (!Object.prototype.hasOwnProperty.call(updates, 'status')) {
    return;
  }

  const nextStatus = updates.status;
  if (!isValidStatus(nextStatus)) {
    const error = new Error(`Invalid case status: ${nextStatus}`);
    error.statusCode = 400;
    throw error;
  }

  if (!STATUS_CHANGE_ROLES.has(user.role)) {
    const error = new Error('Forbidden: cannot change case status');
    error.statusCode = 403;
    throw error;
  }

  if (!canTransition(legalCase.status, nextStatus)) {
    const allowed = TRANSITIONS[legalCase.status] || [];
    const reason = allowed.length
      ? `Allowed next statuses: ${allowed.join(', ')}`
      : `${legalCase.status} is a terminal status`;
    const error = new Error(`Invalid case transition from ${legalCase.status} to ${nextStatus}. ${reason}`);
    error.statusCode = 400;
    throw error;
  }
};

module.exports = {
  CASE_STATUSES,
  TRANSITIONS,
  canDeleteCase,
  canTransition,
  canUpdateCase,
  validateCaseCreation,
  validateCaseUpdate,
};

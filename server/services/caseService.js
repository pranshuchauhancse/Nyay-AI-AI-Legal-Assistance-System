const caseRepository = require('../repositories/caseRepository');
const {
  canDeleteCase,
  validateCaseCreation,
  validateCaseUpdate,
} = require('../domain/caseWorkflow');

const buildVisibilityFilters = (user) => {
  const filters = {};

  if (user.role === 'citizen') {
    filters.$or = [{ createdBy: user._id }, { citizen: user._id }];
  }

  if (user.role === 'lawyer') {
    filters.$or = [{ assignedTo: user._id }, { assignedLawyer: user._id }];
  }

  if (user.role === 'police') {
    filters.$or = [{ policeOfficer: user._id }, { createdBy: user._id }];
  }

  if (user.role === 'judge') {
    filters.$or = [{ judge: user._id }, {}];
  }

  return filters;
};

const listCases = (user) => caseRepository.findVisibleToUser(buildVisibilityFilters(user));

const createCase = async (user, payload) => {
  validateCaseCreation(user, payload);

  const newCase = await caseRepository.create({
    title: payload.title,
    description: payload.description,
    status: payload.status || 'Filed',
    assignedTo: payload.assignedTo,
    hearingDate: payload.hearingDate,
    judgment: payload.judgment,
    policeStatus: payload.policeStatus,
    caseType: payload.caseType,
    priority: payload.priority,
    createdBy: user._id,
    citizen: user.role === 'citizen' ? user._id : undefined,
    assignedLawyer: user.role === 'lawyer' ? user._id : undefined,
    policeOfficer: user.role === 'police' ? user._id : undefined,
    judge: user.role === 'judge' ? user._id : undefined,
    nextHearingDate: payload.hearingDate,
  });

  return caseRepository.populateUsers(newCase);
};

const updateCase = async (user, caseId, updates) => {
  const legalCase = await caseRepository.findById(caseId);

  if (!legalCase) {
    const error = new Error('Case not found');
    error.statusCode = 404;
    throw error;
  }

  validateCaseUpdate(user, legalCase, updates);

  Object.assign(legalCase, updates);
  if (updates.hearingDate) {
    legalCase.nextHearingDate = updates.hearingDate;
  }

  const updated = await legalCase.save();
  return caseRepository.populateUsers(updated);
};

const deleteCase = async (user, caseId) => {
  const legalCase = await caseRepository.findById(caseId);

  if (!legalCase) {
    const error = new Error('Case not found');
    error.statusCode = 404;
    throw error;
  }

  if (!canDeleteCase(user, legalCase)) {
    const error = new Error('Forbidden: cannot delete this case');
    error.statusCode = 403;
    throw error;
  }

  await legalCase.deleteOne();
};

module.exports = {
  createCase,
  deleteCase,
  listCases,
  updateCase,
};

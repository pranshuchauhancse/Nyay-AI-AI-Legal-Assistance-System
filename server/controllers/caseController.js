const caseService = require('../services/caseService');
const { sendSuccess } = require('../utils/apiResponse');

const getCases = async (req, res) => {
  const cases = await caseService.listCases(req.user);
  sendSuccess(res, cases);
};

const createCase = async (req, res) => {
  const legalCase = await caseService.createCase(req.user, req.body);
  sendSuccess(res, legalCase, 201);
};

const updateCase = async (req, res) => {
  const legalCase = await caseService.updateCase(req.user, req.params.id, req.body);
  sendSuccess(res, legalCase);
};

const deleteCase = async (req, res) => {
  await caseService.deleteCase(req.user, req.params.id);
  sendSuccess(res, { message: 'Case deleted' });
};

module.exports = {
  getCases,
  createCase,
  updateCase,
  deleteCase,
};

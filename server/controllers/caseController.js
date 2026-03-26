const Case = require('../models/Case');

const getCases = async (req, res) => {
  const filters = {};

  if (req.user.role === 'citizen') {
    filters.$or = [{ createdBy: req.user._id }, { citizen: req.user._id }];
  }

  if (req.user.role === 'lawyer') {
    filters.$or = [{ assignedTo: req.user._id }, { assignedLawyer: req.user._id }];
  }

  if (req.user.role === 'police') {
    filters.$or = [{ policeOfficer: req.user._id }, { createdBy: req.user._id }];
  }

  if (req.user.role === 'judge') {
    filters.$or = [{ judge: req.user._id }, {}];
  }

  const cases = await Case.find(filters)
    .populate('createdBy assignedTo citizen policeOfficer judge', 'name email role')
    .sort({ createdAt: -1 });

  res.json(cases);
};

const createCase = async (req, res) => {
  const {
    title,
    description,
    status,
    assignedTo,
    hearingDate,
    judgment,
    policeStatus,
    caseType,
    priority,
  } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const newCase = await Case.create({
    title,
    description,
    status: status || 'Filed',
    assignedTo,
    hearingDate,
    judgment,
    policeStatus,
    caseType,
    priority,
    createdBy: req.user._id,
    citizen: req.user.role === 'citizen' ? req.user._id : undefined,
    assignedLawyer: req.user.role === 'lawyer' ? req.user._id : undefined,
    policeOfficer: req.user.role === 'police' ? req.user._id : undefined,
    judge: req.user.role === 'judge' ? req.user._id : undefined,
    nextHearingDate: hearingDate,
  });

  const populated = await newCase.populate(
    'createdBy assignedTo citizen policeOfficer judge',
    'name email role'
  );

  res.status(201).json(populated);
};

const updateCase = async (req, res) => {
  const legalCase = await Case.findById(req.params.id);

  if (!legalCase) {
    res.status(404);
    throw new Error('Case not found');
  }

  const canEdit =
    req.user.role === 'admin' ||
    req.user.role === 'judge' ||
    String(legalCase.createdBy) === String(req.user._id) ||
    String(legalCase.assignedTo) === String(req.user._id) ||
    String(legalCase.assignedLawyer) === String(req.user._id) ||
    String(legalCase.policeOfficer) === String(req.user._id);

  if (!canEdit) {
    res.status(403);
    throw new Error('Forbidden: cannot update this case');
  }

  Object.assign(legalCase, req.body);
  if (req.body.hearingDate) {
    legalCase.nextHearingDate = req.body.hearingDate;
  }

  const updated = await legalCase.save();
  const populated = await updated.populate(
    'createdBy assignedTo citizen policeOfficer judge',
    'name email role'
  );

  res.json(populated);
};

const deleteCase = async (req, res) => {
  const legalCase = await Case.findById(req.params.id);

  if (!legalCase) {
    res.status(404);
    throw new Error('Case not found');
  }

  const canDelete =
    req.user.role === 'admin' || String(legalCase.createdBy) === String(req.user._id);

  if (!canDelete) {
    res.status(403);
    throw new Error('Forbidden: cannot delete this case');
  }

  await legalCase.deleteOne();
  res.json({ message: 'Case deleted' });
};

module.exports = {
  getCases,
  createCase,
  updateCase,
  deleteCase,
};

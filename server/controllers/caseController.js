const Case = require('../models/Case');

const getCases = async (req, res) => {
  const cases = await Case.find({ assignedLawyer: req.user._id })
    .populate('client', 'name email phone')
    .sort({ createdAt: -1 });
  res.json(cases);
};

const createCase = async (req, res) => {
  const { title, description, status, priority, nextHearingDate, client } = req.body;

  if (!title || !client) {
    res.status(400);
    throw new Error('Title and client are required');
  }

  const newCase = await Case.create({
    title,
    description,
    status,
    priority,
    nextHearingDate,
    client,
    assignedLawyer: req.user._id,
  });

  const populated = await newCase.populate('client', 'name email phone');
  res.status(201).json(populated);
};

const updateCase = async (req, res) => {
  const legalCase = await Case.findOne({ _id: req.params.id, assignedLawyer: req.user._id });

  if (!legalCase) {
    res.status(404);
    throw new Error('Case not found');
  }

  Object.assign(legalCase, req.body);
  const updated = await legalCase.save();
  const populated = await updated.populate('client', 'name email phone');
  res.json(populated);
};

const deleteCase = async (req, res) => {
  const legalCase = await Case.findOne({ _id: req.params.id, assignedLawyer: req.user._id });

  if (!legalCase) {
    res.status(404);
    throw new Error('Case not found');
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

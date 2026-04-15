const Report = require('../models/Report');

const getReports = async (req, res) => {
  const filters = {};

  if (req.user.role === 'police') {
    filters.createdBy = req.user._id;
  }

  const reports = await Report.find(filters)
    .populate('createdBy caseRef', 'name email role title status')
    .sort({ createdAt: -1 });

  res.json(reports);
};

const createReport = async (req, res) => {
  const { title, description, type, status, caseRef } = req.body;

  if (!title) {
    res.status(400);
    throw new Error('Title is required');
  }

  const report = await Report.create({
    title,
    description,
    type,
    status,
    caseRef,
    createdBy: req.user._id,
  });

  const populated = await report.populate('createdBy caseRef', 'name email role title status');
  res.status(201).json(populated);
};

const updateReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const canEdit =
    req.user.role === 'admin' ||
    req.user.role === 'judge' ||
    String(report.createdBy) === String(req.user._id);

  if (!canEdit) {
    res.status(403);
    throw new Error('Forbidden: cannot update this report');
  }

  Object.assign(report, req.body);
  const updated = await report.save();
  const populated = await updated.populate('createdBy caseRef', 'name email role title status');
  res.json(populated);
};

const deleteReport = async (req, res) => {
  const report = await Report.findById(req.params.id);

  if (!report) {
    res.status(404);
    throw new Error('Report not found');
  }

  const canDelete =
    req.user.role === 'admin' ||
    String(report.createdBy) === String(req.user._id);

  if (!canDelete) {
    res.status(403);
    throw new Error('Forbidden: cannot delete this report');
  }

  await report.deleteOne();
  res.json({ message: 'Report deleted' });
};

module.exports = {
  getReports,
  createReport,
  updateReport,
  deleteReport,
};

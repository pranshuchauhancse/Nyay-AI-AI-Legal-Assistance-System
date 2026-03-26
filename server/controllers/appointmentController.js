const Appointment = require('../models/Appointment');

const getAppointments = async (req, res) => {
  const filters = {};

  if (req.user.role === 'citizen') {
    filters.$or = [{ citizen: req.user._id }, { createdBy: req.user._id }];
  }

  if (req.user.role === 'lawyer') {
    filters.$or = [{ lawyer: req.user._id }, { createdBy: req.user._id }];
  }

  const appointments = await Appointment.find(filters)
    .populate('citizen lawyer createdBy', 'name email role')
    .sort({ appointmentDate: 1 });

  res.json(appointments);
};

const createAppointment = async (req, res) => {
  const { title, notes, status, appointmentDate, citizen, lawyer } = req.body;

  if (!title || !appointmentDate) {
    res.status(400);
    throw new Error('Title and appointment date are required');
  }

  const appointment = await Appointment.create({
    title,
    notes,
    status,
    appointmentDate,
    citizen,
    lawyer,
    createdBy: req.user._id,
  });

  const populated = await appointment.populate('citizen lawyer createdBy', 'name email role');
  res.status(201).json(populated);
};

const updateAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const canEdit =
    req.user.role === 'admin' ||
    String(appointment.createdBy) === String(req.user._id) ||
    String(appointment.citizen) === String(req.user._id) ||
    String(appointment.lawyer) === String(req.user._id);

  if (!canEdit) {
    res.status(403);
    throw new Error('Forbidden: cannot update this appointment');
  }

  Object.assign(appointment, req.body);
  const updated = await appointment.save();
  const populated = await updated.populate('citizen lawyer createdBy', 'name email role');
  res.json(populated);
};

const deleteAppointment = async (req, res) => {
  const appointment = await Appointment.findById(req.params.id);

  if (!appointment) {
    res.status(404);
    throw new Error('Appointment not found');
  }

  const canDelete =
    req.user.role === 'admin' || String(appointment.createdBy) === String(req.user._id);

  if (!canDelete) {
    res.status(403);
    throw new Error('Forbidden: cannot delete this appointment');
  }

  await appointment.deleteOne();
  res.json({ message: 'Appointment deleted' });
};

module.exports = {
  getAppointments,
  createAppointment,
  updateAppointment,
  deleteAppointment,
};

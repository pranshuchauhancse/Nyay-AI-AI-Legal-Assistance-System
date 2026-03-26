const User = require('../models/User');
const Case = require('../models/Case');
const Appointment = require('../models/Appointment');
const Report = require('../models/Report');

const SUPER_ADMIN_EMAILS = [
  'pranshu121005@gmail.com',
  'rohitchauhan200207@gmail.com',
];

const PROTECTED_ADMIN_EMAILS = [...SUPER_ADMIN_EMAILS];

const isSuperAdmin = (email = '') =>
  SUPER_ADMIN_EMAILS.includes(String(email).trim().toLowerCase());

const getUsers = async (req, res) => {
  const users = await User.find({}).select('-password').sort({ createdAt: -1 });
  res.json(users);
};

const createUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password || !role) {
    res.status(400);
    throw new Error('Name, email, password, and role are required');
  }

  if (role === 'admin' && !isSuperAdmin(req.user?.email)) {
    res.status(403);
    throw new Error('Only super admins can create admin users');
  }

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, role });
  const safeUser = user.toObject();
  delete safeUser.password;
  res.status(201).json(safeUser);
};

const updateUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const nextRole = req.body.role || user.role;
  const currentRole = user.role;
  const targetEmail = String(user.email || '').trim().toLowerCase();

  if (PROTECTED_ADMIN_EMAILS.includes(targetEmail)) {
    res.status(403);
    throw new Error('Core admin accounts cannot be modified');
  }

  if (
    (currentRole === 'admin' || nextRole === 'admin') &&
    !isSuperAdmin(req.user?.email)
  ) {
    res.status(403);
    throw new Error('Only super admins can modify admin accounts');
  }

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.role = nextRole;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();
  const safeUser = updated.toObject();
  delete safeUser.password;
  res.json(safeUser);
};

const deleteUser = async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const targetEmail = String(user.email || '').trim().toLowerCase();
  if (PROTECTED_ADMIN_EMAILS.includes(targetEmail)) {
    res.status(403);
    throw new Error('Core admin accounts cannot be deleted');
  }

  if (user.role === 'admin' && !isSuperAdmin(req.user?.email)) {
    res.status(403);
    throw new Error('Only super admins can delete admin users');
  }

  await user.deleteOne();
  res.json({ message: 'User deleted' });
};

const getUserActivity = async (req, res) => {
  const user = await User.findById(req.params.id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  const [cases, appointments, reports] = await Promise.all([
    Case.find({
      $or: [
        { createdBy: user._id },
        { assignedTo: user._id },
        { assignedLawyer: user._id },
        { citizen: user._id },
        { policeOfficer: user._id },
        { judge: user._id },
      ],
    })
      .sort({ updatedAt: -1 })
      .limit(25)
      .select('title status caseType hearingDate updatedAt'),
    Appointment.find({
      $or: [{ createdBy: user._id }, { citizen: user._id }, { lawyer: user._id }],
    })
      .sort({ updatedAt: -1 })
      .limit(25)
      .select('title status appointmentDate updatedAt'),
    Report.find({ createdBy: user._id })
      .sort({ updatedAt: -1 })
      .limit(25)
      .select('title type status updatedAt'),
  ]);

  res.json({
    user,
    summary: {
      totalCases: cases.length,
      totalAppointments: appointments.length,
      totalReports: reports.length,
    },
    cases,
    appointments,
    reports,
  });
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getUserActivity,
};

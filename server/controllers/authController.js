const jwt = require('jsonwebtoken');
const User = require('../models/User');

const VALID_ROLES = ['citizen', 'lawyer', 'judge', 'police', 'admin'];
const APPROVED_ADMIN_EMAILS = [
  'pranshu121005@gmail.com',
  'rohitchauhan200207@gmail.com',
];

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();

const isApprovedAdmin = (email = '') => APPROVED_ADMIN_EMAILS.includes(normalizeEmail(email));

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  if (role && !VALID_ROLES.includes(role)) {
    res.status(400);
    throw new Error('Invalid role selected');
  }

  if (role === 'admin') {
    res.status(403);
    throw new Error('Admin registration is disabled from public signup');
  }

  const exists = await User.findOne({ email });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email, password, role });

  res.status(201).json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    token: generateToken(user._id),
  });
};

const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  const user = await User.findOne({ email });

  if (!user || !(await user.matchPassword(password))) {
    res.status(401);
    throw new Error('Invalid credentials');
  }

  if (role && user.role !== role) {
    res.status(401);
    throw new Error('Selected role does not match your account role');
  }

  if (user.role === 'admin' && !isApprovedAdmin(user.email)) {
    res.status(403);
    throw new Error('This admin account is not allowed to access admin dashboard');
  }

  res.json({
    _id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    profilePic: user.profilePic,
    token: generateToken(user._id),
  });
};

const getMyProfile = async (req, res) => {
  res.json(req.user);
};

const updateMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if ('name' in req.body) user.name = req.body.name;
  if ('email' in req.body) user.email = req.body.email;
  if ('profilePic' in req.body) user.profilePic = req.body.profilePic;

  // Handle role-specific fields (allow clearing)
  if ('licenseNumber' in req.body) user.licenseNumber = req.body.licenseNumber;
  if ('specialization' in req.body) user.specialization = req.body.specialization;
  if ('officeAddress' in req.body) user.officeAddress = req.body.officeAddress;
  if ('courtName' in req.body) user.courtName = req.body.courtName;
  if ('badgeNumber' in req.body) user.badgeNumber = req.body.badgeNumber;
  if ('division' in req.body) user.division = req.body.division;
  if ('rank' in req.body) user.rank = req.body.rank;
  if ('phone' in req.body) user.phone = req.body.phone;
  if ('address' in req.body) user.address = req.body.address;
  if ('city' in req.body) user.city = req.body.city;
  if ('experience' in req.body) user.experience = req.body.experience;
  if ('yearsOfService' in req.body) user.yearsOfService = req.body.yearsOfService;
  if ('department' in req.body) user.department = req.body.department;

  if (req.body.password) {
    user.password = req.body.password;
  }

  const updated = await user.save();

  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
    profilePic: updated.profilePic,
    licenseNumber: updated.licenseNumber,
    specialization: updated.specialization,
    officeAddress: updated.officeAddress,
    courtName: updated.courtName,
    badgeNumber: updated.badgeNumber,
    division: updated.division,
    rank: updated.rank,
    phone: updated.phone,
    address: updated.address,
    city: updated.city,
    experience: updated.experience,
    yearsOfService: updated.yearsOfService,
    department: updated.department,
    token: generateToken(updated._id),
  });
};

module.exports = {
  registerUser,
  loginUser,
  getMyProfile,
  updateMyProfile,
};

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

  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  user.profilePic = req.body.profilePic || user.profilePic;

  // Handle role-specific fields
  if (req.body.licenseNumber) user.licenseNumber = req.body.licenseNumber;
  if (req.body.specialization) user.specialization = req.body.specialization;
  if (req.body.officeAddress) user.officeAddress = req.body.officeAddress;
  if (req.body.courtName) user.courtName = req.body.courtName;
  if (req.body.badgeNumber) user.badgeNumber = req.body.badgeNumber;
  if (req.body.division) user.division = req.body.division;
  if (req.body.rank) user.rank = req.body.rank;
  if (req.body.phone) user.phone = req.body.phone;
  if (req.body.address) user.address = req.body.address;
  if (req.body.city) user.city = req.body.city;
  if (req.body.experience) user.experience = req.body.experience;
  if (req.body.yearsOfService) user.yearsOfService = req.body.yearsOfService;
  if (req.body.department) user.department = req.body.department;

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

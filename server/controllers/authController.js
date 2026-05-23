const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');

const VALID_ROLES = ['citizen', 'lawyer', 'judge', 'police', 'admin'];
const APPROVED_ADMIN_EMAILS = [
  'pranshu121005@gmail.com',
  'rohitchauhan200207@gmail.com',
];

const normalizeEmail = (value = '') => String(value).trim().toLowerCase();
const isApprovedAdmin = (email = '') => APPROVED_ADMIN_EMAILS.includes(normalizeEmail(email));

/**
 * Generate Access Token (15 minutes)
 * @param {string} userId - User ID
 * @returns {string} JWT access token
 */
const generateAccessToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Add JWT_SECRET in server/.env and restart the server.');
  }
  return jwt.sign({ id: userId, type: 'access' }, process.env.JWT_SECRET, { expiresIn: '15m' });
};

/**
 * Generate Refresh Token (7 days)
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (userId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Add JWT_SECRET in server/.env and restart the server.');
  }
  return jwt.sign({ id: userId, type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

/**
 * Get device fingerprint from request
 * @param {object} req - Express request
 * @returns {object} Device info
 */
const getDeviceInfo = (req) => {
  const userAgent = req.headers['user-agent'] || '';
  const ipAddress = req.ip || req.connection.remoteAddress || 'unknown';
  const fingerprint = crypto
    .createHash('sha256')
    .update(`${userAgent}${ipAddress}`)
    .digest('hex')
    .substring(0, 16);

  return { userAgent, ipAddress, fingerprint };
};

/**
 * Create session and return tokens
 * @param {string} userId - User ID
 * @param {object} req - Express request
 * @returns {object} { accessToken, refreshToken, sessionId }
 */
const createSession = async (userId, req) => {
  const refreshToken = generateRefreshToken(userId);
  const refreshTokenHash = Session.hashToken(refreshToken);
  const device = getDeviceInfo(req);

  // Expire in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    userId,
    refreshTokenHash,
    device,
    expiresAt,
  });

  // Clean old sessions - keep only 5 active sessions per user
  await Session.cleanOldSessions(userId, 5);

  const accessToken = generateAccessToken(userId);

  return {
    accessToken,
    refreshToken,
    sessionId: session._id,
    expiresIn: 15 * 60, // 15 minutes in seconds
  };
};

/**
 * Register new user
 */
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

  const normalizedEmail = normalizeEmail(email);

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({ name, email: normalizedEmail, password, role });

  // Create session and get tokens
  const { accessToken, refreshToken, expiresIn } = await createSession(user._id, req);

  // Set refresh token in secure cookie (httpOnly, secure, sameSite)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  res.status(201).json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    tokens: {
      accessToken,
      expiresIn,
      tokenType: 'Bearer',
    },
  });
};

/**
 * Login user
 */
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  const user = await User.findOne({ email: normalizeEmail(email) });

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

  // Create session and get tokens
  const { accessToken, refreshToken, expiresIn } = await createSession(user._id, req);

  // Set refresh token in secure cookie (httpOnly, secure, sameSite)
  res.cookie('refresh_token', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  res.json({
    success: true,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profilePic: user.profilePic,
    },
    tokens: {
      accessToken,
      expiresIn,
      tokenType: 'Bearer',
    },
  });
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refresh_token || req.body.refreshToken;

    if (!refreshToken) {
      res.status(401);
      throw new Error('Refresh token not provided');
    }

    // Verify refresh token signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    } catch (err) {
      res.status(401);
      throw new Error('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh') {
      res.status(401);
      throw new Error('Invalid token type');
    }

    // Find and verify session
    const refreshTokenHash = Session.hashToken(refreshToken);
    const session = await Session.findOne({
      userId: decoded.id,
      refreshTokenHash,
    });

    if (!session || !session.verifyToken(refreshToken)) {
      res.status(401);
      throw new Error('Refresh token revoked or expired');
    }

    // Update last used
    session.lastUsedAt = new Date();
    await session.save();

    // Generate new access token
    const accessToken = generateAccessToken(decoded.id);

    res.json({
      success: true,
      tokens: {
        accessToken,
        expiresIn: 15 * 60,
        tokenType: 'Bearer',
      },
    });
  } catch (err) {
    if (res.statusCode < 400) {
      res.status(401);
    }
    throw err;
  }
};

/**
 * Logout user - revoke session
 */
const logoutUser = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refresh_token || req.body.refreshToken;

    if (refreshToken) {
      const refreshTokenHash = Session.hashToken(refreshToken);
      const session = await Session.findOne({
        userId: req.user._id,
        refreshTokenHash,
      });

      if (session) {
        await session.revoke();
      }
    }

    // Clear cookie
    res.clearCookie('refresh_token', {
      httpOnly: true,
      path: '/api/auth',
    });

    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  } catch (err) {
    res.clearCookie('refresh_token', {
      httpOnly: true,
      path: '/api/auth',
    });
    res.json({
      success: true,
      message: 'Logged out successfully',
    });
  }
};

/**
 * Logout all devices - revoke all sessions
 */
const logoutAllDevices = async (req, res) => {
  try {
    await Session.updateMany(
      { userId: req.user._id, isRevoked: false },
      { isRevoked: true, revokedAt: new Date() }
    );

    res.clearCookie('refresh_token', {
      httpOnly: true,
      path: '/api/auth',
    });

    res.json({
      success: true,
      message: 'Logged out from all devices',
    });
  } catch (err) {
    if (res.statusCode < 400) {
      res.status(500);
    }
    throw err;
  }
};

/**
 * Get current user profile
 */
const getMyProfile = async (req, res) => {
  res.json({
    success: true,
    user: req.user,
  });
};

/**
 * Update user profile
 */
const updateMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if ('name' in req.body) user.name = req.body.name;
  if ('email' in req.body) user.email = req.body.email;
  if ('profilePic' in req.body) user.profilePic = req.body.profilePic;

  // Handle role-specific fields
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
    success: true,
    user: {
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
    },
  });
};

/**
 * Get active sessions for current user
 */
const getActiveSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      userId: req.user._id,
      isRevoked: false,
      expiresAt: { $gt: new Date() },
    }).sort({ createdAt: -1 });

    res.json({
      success: true,
      sessions: sessions.map(s => ({
        id: s._id,
        device: s.device,
        createdAt: s.createdAt,
        lastUsedAt: s.lastUsedAt,
        expiresAt: s.expiresAt,
      })),
    });
  } catch (err) {
    if (res.statusCode < 400) {
      res.status(500);
    }
    throw err;
  }
};

/**
 * Revoke specific session by ID
 */
const revokeSession = async (req, res) => {
  try {
    const { sessionId } = req.params;

    const session = await Session.findOne({
      _id: sessionId,
      userId: req.user._id,
    });

    if (!session) {
      res.status(404);
      throw new Error('Session not found');
    }

    await session.revoke();

    res.json({
      success: true,
      message: 'Session revoked',
    });
  } catch (err) {
    if (res.statusCode < 400) {
      res.status(500);
    }
    throw err;
  }
};

module.exports = {
  registerUser,
  loginUser,
  refreshAccessToken,
  logoutUser,
  logoutAllDevices,
  getMyProfile,
  updateMyProfile,
  getActiveSessions,
  revokeSession,
};

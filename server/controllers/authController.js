const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Session = require('../models/Session');
const { BadRequestError, ForbiddenError, UnauthorizedError, NotFoundError } = require('../utils/AppError');

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
const getRefreshSecret = () => process.env.REFRESH_SECRET || process.env.JWT_SECRET;

const toSafeUser = (user) => ({
  _id: user._id,
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  profilePic: user.profilePic,
});

const buildAuthResponse = (user, tokens) => ({
  user: toSafeUser(user),
  token: tokens.accessToken,
  accessToken: tokens.accessToken,
  sessionId: tokens.sessionId,
  tokens: {
    accessToken: tokens.accessToken,
    expiresIn: tokens.expiresIn,
    tokenType: 'Bearer',
  },
});

const generateAccessToken = (user, sessionId) => {
  if (!process.env.JWT_SECRET) {
    throw new Error('JWT_SECRET is missing. Add JWT_SECRET in server/.env and restart the server.');
  }
  return jwt.sign(
    {
      id: user._id,
      userId: user._id,
      role: user.role,
      sessionId,
      type: 'access',
    },
    process.env.JWT_SECRET,
    { expiresIn: '15m' }
  );
};

/**
 * Generate Refresh Token (7 days)
 * @param {string} userId - User ID
 * @returns {string} JWT refresh token
 */
const generateRefreshToken = (user, sessionId) => {
  if (!getRefreshSecret()) {
    throw new Error('REFRESH_SECRET or JWT_SECRET is missing. Add it in server/.env and restart the server.');
  }
  return jwt.sign(
    {
      id: user._id,
      userId: user._id,
      role: user.role,
      sessionId,
      type: 'refresh',
    },
    getRefreshSecret(),
    { expiresIn: '7d' }
  );
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
const createSession = async (user, req) => {
  const device = getDeviceInfo(req);

  // Expire in 7 days
  const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const session = await Session.create({
    userId: user._id,
    refreshTokenHash: 'pending',
    device,
    expiresAt,
  });

  const refreshToken = generateRefreshToken(user, session._id);
  session.refreshTokenHash = Session.hashToken(refreshToken);
  await session.save();

  // Clean old sessions - keep only 5 active sessions per user
  await Session.cleanOldSessions(user._id, 5);

  const accessToken = generateAccessToken(user, session._id);

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
    throw new BadRequestError('Name, email and password are required');
  }

  if (role && !VALID_ROLES.includes(role)) {
    throw new BadRequestError('Invalid role selected');
  }

  if (role === 'admin') {
    throw new ForbiddenError('Admin registration is disabled from public signup');
  }

  const normalizedEmail = normalizeEmail(email);

  const exists = await User.findOne({ email: normalizedEmail });
  if (exists) {
    throw new BadRequestError('User already exists');
  }

  const user = await User.create({ name, email: normalizedEmail, password, role });

  // Create session and get tokens
  const tokens = await createSession(user, req);

  // Set refresh token in secure cookie (httpOnly, secure, sameSite)
  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  const data = buildAuthResponse(user, tokens);
  res.status(201).json({ success: true, data, message: 'Registered successfully', ...data });
};

/**
 * Login user
 */
const loginUser = async (req, res) => {
  const { email, password, role } = req.body;

  if (!email || !password) {
    throw new BadRequestError('Email and password are required');
  }

  const user = await User.findOne({ email: normalizeEmail(email) });

  if (!user || !(await user.matchPassword(password))) {
    throw new UnauthorizedError('Invalid credentials');
  }

  if (role && user.role !== role) {
    throw new UnauthorizedError('Selected role does not match your account role');
  }

  if (user.role === 'admin' && !isApprovedAdmin(user.email)) {
    throw new ForbiddenError('This admin account is not allowed to access admin dashboard');
  }

  // Create session and get tokens
  const tokens = await createSession(user, req);

  // Set refresh token in secure cookie (httpOnly, secure, sameSite)
  res.cookie('refresh_token', tokens.refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000,
    path: '/api/auth',
  });

  const data = buildAuthResponse(user, tokens);
  res.json({ success: true, data, message: 'Logged in successfully', ...data });
};

/**
 * Refresh access token using refresh token
 */
const refreshAccessToken = async (req, res) => {
  try {
    // Get refresh token from cookie or body
    const refreshToken = req.cookies.refresh_token || req.body.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedError('Refresh token not provided');
    }

    // Verify refresh token signature
    let decoded;
    try {
      decoded = jwt.verify(refreshToken, getRefreshSecret());
    } catch (err) {
      throw new UnauthorizedError('Invalid or expired refresh token');
    }

    if (decoded.type !== 'refresh') {
      throw new UnauthorizedError('Invalid token type');
    }

    // Find and verify session
    const refreshTokenHash = Session.hashToken(refreshToken);
    const session = await Session.findOne({
      userId: decoded.id,
      _id: decoded.sessionId,
      refreshTokenHash,
    });

    if (!session || !session.verifyToken(refreshToken)) {
      throw new UnauthorizedError('Refresh token revoked or expired');
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user) {
      throw new UnauthorizedError('User not found');
    }

    const newRefreshToken = generateRefreshToken(user, session._id);
    session.refreshTokenHash = Session.hashToken(newRefreshToken);
    session.lastUsedAt = new Date();
    await session.save();

    const accessToken = generateAccessToken(user, session._id);

    res.cookie('refresh_token', newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/api/auth',
    });

    res.json({
      success: true,
      message: 'Token refreshed',
      data: {
        token: accessToken,
        accessToken,
        tokens: {
          accessToken,
          expiresIn: 15 * 60,
          tokenType: 'Bearer',
        },
      },
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
  const data = { user: toSafeUser(req.user) };
  res.json({ success: true, data, message: 'Profile loaded', ...data });
};

/**
 * Update user profile
 */
const updateMyProfile = async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    throw new NotFoundError('User not found');
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
      throw new NotFoundError('Session not found');
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

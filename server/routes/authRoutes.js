const express = require('express');
const {
	registerUser,
	loginUser,
	refreshAccessToken,
	logoutUser,
	logoutAllDevices,
	getMyProfile,
	updateMyProfile,
	getActiveSessions,
	revokeSession,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');
const { validateRequest } = require('../middleware/validateRequest');
const { 
	registerSchema, 
	loginSchema, 
	updateProfileSchema 
} = require('../validators/schemas');

const router = express.Router();

// STEP 5: Public auth routes with validation
router.post('/register', validateRequest(registerSchema), registerUser);
router.post('/login', validateRequest(loginSchema), loginUser);
router.post('/refresh', refreshAccessToken); // Can be called with or without auth

// STEP 5: Protected auth routes with validation
router.get('/me', protect, getMyProfile);
router.put('/me', protect, validateRequest(updateProfileSchema), updateMyProfile);
router.post('/logout', protect, logoutUser);
router.post('/logout-all', protect, logoutAllDevices);
router.get('/sessions', protect, getActiveSessions);
router.delete('/sessions/:sessionId', protect, revokeSession);

module.exports = router;

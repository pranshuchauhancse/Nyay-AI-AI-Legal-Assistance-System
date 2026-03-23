const express = require('express');
const {
	registerUser,
	loginUser,
	getMyProfile,
	updateMyProfile,
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.get('/me', protect, getMyProfile);
router.put('/me', protect, updateMyProfile);

module.exports = router;

const express = require('express');
const { askChatbot } = require('../controllers/chatbotController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.post('/ask', askChatbot);

module.exports = router;

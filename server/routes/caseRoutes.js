const express = require('express');
const { getCases, createCase, updateCase, deleteCase } = require('../controllers/caseController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getCases).post(createCase);
router.route('/:id').put(updateCase).delete(deleteCase);

module.exports = router;

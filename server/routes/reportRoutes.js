const express = require('express');
const { getReports, createReport, updateReport, deleteReport } = require('../controllers/reportController');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();

router.use(protect);
router.route('/').get(getReports).post(createReport);
router.route('/:id').put(updateReport).delete(deleteReport);

module.exports = router;

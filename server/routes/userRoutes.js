const express = require('express');
const {
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	getUserActivity,
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');
const { allowRoles } = require('../middleware/roleMiddleware');

const router = express.Router();

router.use(protect);
router.use(allowRoles('admin'));

router.route('/').get(getUsers).post(createUser);
router.get('/:id/activity', getUserActivity);
router.route('/:id').put(updateUser).delete(deleteUser);

module.exports = router;

import express from 'express';

import {
	authUser,
	deleteUser,
	getUserByID,
	getUserProfile,
	getUsers,
	registerUser,
	updateUser,
	updateUserProfile,
	generateOnboardingOTP,
	verifyOnboardingOTP,
	userDeposit,
	userWithdraw,
	userTransfer,
} from '../controllers/userController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(registerUser);
router.route('/').get(protect, admin, getUsers);
router.route('/login').post(authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/profile').put(protect, updateUserProfile);
router.route('/:id').delete(protect, admin, deleteUser);
router.route('/:id').get(protect, admin, getUserByID);
router.route('/:id').put(protect, admin, updateUser);
router.route('/deposit').post(protect, userDeposit);
router.route('/withdraw').post(protect, userWithdraw);
router.route('/transfer').all( protect, userTransfer);

router.route('/generate-otp').post(generateOnboardingOTP);
router.route('/verify-otp').post(verifyOnboardingOTP);

export default router;

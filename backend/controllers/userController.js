import asyncHandler from 'express-async-handler';

import User from '../models/userModel.js';
import OTP from '../models/otpModel.js';
import Notification from '../models/notificationModel.js';
import Restaurant from '../models/restaurantModel.js';
import Transaction from '../models/transactionModel.js';
import generateToken from '../utils/generateToken.js';
import { generateOTP, verifyOTP } from "../utils/otp.js";
import { sendOtpToUser } from "../utils/sendOtp.js";


/**
 * @desc 		Auth user
 * @route		POST /api/users/login
 * @access	public
 */
const authUser = asyncHandler(async (req, res) => {
	const { email, password, latitude, longitude } = req.body;
  
	const user = await User.findOne({ email });
  
	if (user && (await user.matchPassword(password))) {
	  if (latitude && longitude) {
		user.location = {
		  type: 'Point',
		  coordinates: [longitude, latitude],
		};
		await user.save();
	  }
  
	  res.json({
		_id: user._id,
		name: user.name,
		email: user.email,
		isAdmin: user.isAdmin,
		token: generateToken(user._id),
	  });
	} else {
	  res.status(401);
	  throw new Error('Invalid email or password');
	}
  });

/**
 * @desc 		Get user profile
 * @route		GET /api/users/profile
 * @access	private
 */
const getUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);

	if (user) {
		res.json({
			_id: user._id,
			name: user.name,
			email: user.email,
			isAdmin: user.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

/**
 * @desc 		Register new user
 * @route		POST /api/users
 * @access	public
 */
const registerUser = asyncHandler(async (req, res) => {
	const { name, email, phone, password} = req.body;

	const userExists = await User.findOne({ email });

	if (userExists) {
		res.status(400); // Bad request
		throw new Error('User already exists');
	}

	const user = await User.create({
		name,
		email,
		phone,
		password,
	  });
	

	if (user) {

		const notificationMessage = `Welcome, ${user.name}! to Halisi!`;
		const notification = new Notification({
		  user: user._id,
		  message: notificationMessage,
		  subject: "Welcome",
		});
		await notification.save();

		res.status(201).json({
			_id: user._id,
			name: user.name,
			email: user.email,
			phone: user.phone,
			isAdmin: user.isAdmin,
			token: generateToken(user._id),
		});
	} else {
		res.status(400);
		throw new Error('Invalid user data');
	}
});

/**
 * @desc     Update user profile
 * @route    PUT /api/users/profile
 * @access   private
 */
const updateUserProfile = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user._id);
  
	if (user) {
	  user.name = req.body.name || user.name;
	  user.email = req.body.email || user.email;
	  user.phone = req.body.phone || user.phone;
	  user.pincode = req.body.pincode || user.pincode;
	  user.emergencyContact = req.body.emergencyContact || user.emergencyContact;
	  user.icon = req.body.icon || user.icon;
  
	  if (req.body.password) {
		user.password = req.body.password;
	  }
  
	  const updatedUser = await user.save();
  
	  if (updatedUser) {
		if (updatedUser.wallet && updatedUser.wallet.length > 0) {
		  const wallet = updatedUser.wallet[0];
		  wallet.phone = updatedUser.phone; 
		  await wallet.save();
		}
  
		const notificationMessage = `Your profile has been updated successfully, ${updatedUser.name}!`;
		const notification = new Notification({
		  user: updatedUser._id,
		  message: notificationMessage,
		  subject: "Profile Update",
		});
		await notification.save();
  
		res.json({
		  _id: updatedUser._id,
		  name: updatedUser.name,
		  email: updatedUser.email,
		  phone: updatedUser.phone,
		  pincode: updatedUser.pincode,
		  emergencyContact: updatedUser.emergencyContact,
		  isAdmin: updatedUser.isAdmin,
		  icon: updatedUser.icon,
		  token: generateToken(updatedUser._id),
		});
	  }
	} else {
	  res.status(404);
	  throw new Error('User not found');
	}
  });
 
  

/**
 * @desc 		Get all users
 * @route		GET /api/users/
 * @access	private/admin
 */
const getUsers = asyncHandler(async (req, res) => {
	const users = await User.find({}).select('-password');
	res.json(users);
});

/**
 * @desc 		Delete user
 * @route		DELETE /api/users/:id
 * @access	private/admin
 */
const deleteUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);

	if (user) {
		await User.deleteOne(user);
		res.json({ message: 'User deleted' });
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

/**
 * @desc 		Get user by ID
 * @route		GET /api/users/:id
 * @access	private/admin
 */
const getUserByID = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id).select('-password');

	if (user) {
		res.json(user);
	} else {
		res.status(404);
		throw new Error('User not found');
	}
});

/**
 * @desc 		Update a user
 * @route		PUT /api/users/:id
 * @access	private/admin
 */
const updateUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.params.id);
  
	if (user) {
	  user.name = req.body.name || user.name;
	  user.email = req.body.email || user.email;
	  user.isAdmin = req.body.isAdmin || user.isAdmin;
  
	  const updatedUser = await user.save();
  
	  if (updatedUser) {
		if (updatedUser.wallet && updatedUser.wallet.length > 0) {
		  const wallet = updatedUser.wallet[0];
		  wallet.phone = updatedUser.phone; 
		  await wallet.save();
		}
  
		const notificationMessage = `Your profile has been updated by an admin, ${updatedUser.name}!`;
		const notification = new Notification({
		  user: updatedUser._id,
		  message: notificationMessage,
		  subject: "Profile Update",
		});
		await notification.save();
  
		res.json({
		  _id: updatedUser._id,
		  name: updatedUser.name,
		  email: updatedUser.email,
		  isAdmin: updatedUser.isAdmin,
		});
	  }
	} else {
	  res.status(404);
	  throw new Error('User not found');
	}
  });
  
/**
 * @description   Generate OTP for onboarding
 * @route         POST /api/users/generate-otp
 * @access        public
 */
const generateOnboardingOTP = asyncHandler(async (req, res) => {
	const { email } = req.body;
  
	await OTP.findOneAndDelete({ email });
  
	const otpData = generateOTP();
  
	const newOTP = new OTP({
	  email,
	  otp: otpData.otp,
	  expiryTime: otpData.expiryTime,
	});
	await newOTP.save();
	console.log(newOTP);
  
	sendOtpToUser(email, otpData);
  
	res.json({ message: "OTP generated and sent successfully" });
  });
  
  /**
   * @description Verify OTP for onboarding
   * @route       POST /api/users/verify-otp
   * @access      public
   */
  const verifyOnboardingOTP = asyncHandler(async (req, res) => {
	const { email, enteredOTP } = req.body; 
  
	const otpDocument = await OTP.findOne({ email });
	
	console.log("OTP Document:", otpDocument);
	
	if (!otpDocument || !verifyOTP(otpDocument.otp, enteredOTP)) {
	  res.status(400);
	  throw new Error("Invalid OTP");
	}
	  
	res.json({ message: "OTP verification successful" });
  });
  
/**
 * @description    Deposit funds into user's wallet
 * @route          POST /api/users/deposit
 * @access         private
 */
const userDeposit = asyncHandler(async (req, res) => {
	const { amount } = req.body;
	const user = await User.findById(req.user.id);
  
	if (!user) {
	  res.status(401);
	  throw new Error("User not authenticated");
	}
  
	if (amount <= 0) {
	  res.status(400);
	  throw new Error("Invalid deposit amount");
	}
  
	// Create a new transaction record
	const depositTransaction = new Transaction({
	  user: user._id,
	  amount,
	  type: "deposit",
	  message: `Deposit of ${amount} ${user.wallet.currency}`,
	});
  
	// Update the user's wallet balance
	user.wallet.balance += amount;
	user.wallet.transactions.push(depositTransaction._id);
  
	// Save the changes to the user's wallet and create the transaction
	await user.wallet.save();
	await depositTransaction.save();
  
	res.json({
	  message: `Successfully deposited ${amount} ${user.wallet.currency} into your wallet`,
	  newBalance: user.wallet.balance,
	});
  });

  
  /**
   * @description    Withdraw funds from user's wallet
   * @route          POST /api/users/withdraw
   * @access         private
   */
  const userWithdraw = asyncHandler(async (req, res) => {
	const { amount } = req.body;
	const user = await User.findById(req.user.id);
  
	if (!user) {
	  res.status(401);
	  throw new Error("User not authenticated");
	}
  
	if (amount <= 0) {
	  res.status(400);
	  throw new Error("Invalid withdrawal amount");
	}
  
	if (user.wallet.balance < amount) {
	  res.status(400);
	  throw new Error("Insufficient balance");
	}
  
	// Create a new transaction record
	const withdrawalTransaction = new Transaction({
	  user: user._id,
	  amount,
	  type: "withdrawal",
	  message: `Withdrawal of ${amount} ${user.wallet.currency}`,
	});
  
	// Update the user's wallet balance
	user.wallet.balance -= amount;
	user.wallet.transactions.push(withdrawalTransaction._id);
  
	// Save the changes to the user's wallet and create the transaction
	await user.wallet.save();
	await withdrawalTransaction.save();
  
	// TODO: Integrate with payment gateway to process withdrawal externally
	// Example: callPaymentGatewayWithdrawMethod(amount, user.wallet.phoneNumber)
  
	res.json({
	  message: `Withdrawal of ${amount} ${user.wallet.currency} initiated`,
	  newBalance: user.wallet.balance,
	});
  });

  /**
 * @description    Transfer funds from user's wallet to another wallet
 * @route          POST /api/users/transfer
 * @access         private
 */
const userTransfer = asyncHandler(async (req, res) => {
	const { recipientPhone, amount } = req.body;
	const senderUser = req.user; 
  
	const senderWallet = await Wallet.findOne({ user: senderUser._id });
  
	let recipientWallet;
  
	const recipientUser = await User.findOne({ phone: recipientPhone });
	const recipientRestaurant = await Restaurant.findOne({ phone: recipientPhone });
  
	if (recipientUser) {
	  
	  recipientWallet = await Wallet.findOne({ user: recipientUser._id });
	} else if (recipientRestaurant) {
	  
	  recipientWallet = await Wallet.findOne({ restaurant: recipientRestaurant._id });
	}
  
	if (!senderWallet || !recipientWallet) {
	  res.status(400).json({ message: 'Invalid sender or recipient wallet' });
	  return;
	}
  
	if (amount <= 0 || senderWallet.balance < amount) {
	  res.status(400).json({ message: 'Invalid transfer amount or insufficient balance' });
	  return;
	}
  
	const debitTransaction = new Transaction({
	  user: senderUser._id,
	  amount: -amount, 
	  type: 'transfer',
	  message: `Transfer to ${recipientPhone}`,
	  description: 'debit', 
	  relatedUser: recipientUser ? recipientUser._id : null, 
	  relatedRestaurant: recipientRestaurant ? recipientRestaurant._id : null, 
	});
  
	const creditTransaction = new Transaction({
	  user: recipientUser ? recipientUser._id : null,
	  restaurant: recipientRestaurant ? recipientRestaurant._id : null,
	  amount,
	  type: 'transfer',
	  message: `Received from ${senderUser.phone}`,
	  description: 'credit', 
	  relatedUser: senderUser._id, 
	});

	senderWallet.balance -= amount;
	if (recipientUser) {
	  recipientWallet.balance += amount;
	} else if (recipientRestaurant) {
	  recipientWallet.balance += amount;
	}
  
	await Promise.all([
	  debitTransaction.save(),
	  creditTransaction.save(),
	  senderWallet.save(),
	  recipientWallet.save(),
	]);
  
	res.json({ message: 'Transfer successful', senderWallet, recipientWallet });
  });
  

export {
	authUser,
	getUserProfile,
	registerUser,
	updateUserProfile,
	getUsers,
	deleteUser,
	getUserByID,
	updateUser,
	generateOnboardingOTP,
	verifyOnboardingOTP,
	userDeposit,
	userWithdraw,
	userTransfer,
};

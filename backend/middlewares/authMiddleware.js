import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

import User from '../models/userModel.js';
import Restaurant from '../models/restaurantModel.js';

const protect = asyncHandler(async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      if (decoded.userType === 'user') {
        req.user = await User.findById(decoded.id).select('-password');
      }

      if (decoded.userType === 'restaurant') {
        req.restaurant = await Restaurant.findById(decoded.id).select('-password');
      }

      next();
    } catch (err) {
      console.error(err);
      throw new Error('Not authorized, token failed');
    }
  } else {
    throw new Error('Token not found');
  }
});

const admin = (req, res, next) => {
  if ((req.user && req.user.isAdmin) || (req.restaurant && req.restaurant.isAdmin)) {
    next();
  } else {
    res.status(401);
    throw new Error('Not authorized. Only for administrators.');
  }
};

export { protect, admin };

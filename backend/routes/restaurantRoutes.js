import express from 'express';

import {
	authRestaurant,
    getRestaurantProfile,
    registerRestaurant,
    updateRestaurantProfile,
    getRestaurants,
    getRestaurantByID,
    deleteRestaurant,
    updateRestaurant,
    createMenu,
    updateMenuItem,
    getMyMenus,
    getRestaurantMenuById,   
    deleteMenuItem,
    createRestaurantReview,    
} from '../controllers/restaurantController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/register').post(registerRestaurant);
router.route('/login').post(authRestaurant);
router.route('/profile').get(protect, getRestaurantProfile);
router.route('/profile').put(protect, updateRestaurantProfile);
router.route('/menus').get( protect, getMyMenus);
router.route('/menus/:id').get(protect, getRestaurantMenuById);
router.route('/menus').post(protect, createMenu);
router.route('/menus/:id').put(protect, updateMenuItem);
router.route('/menus/:id').delete(protect, deleteMenuItem);

router.route('/:id/reviews').post(protect, createRestaurantReview);

// Restaurant CRUD operations (admin)
router.route('/').get(protect, admin, getRestaurants);
router.route('/:id').get(protect, admin, getRestaurantByID);
router.route('/:id').delete(protect, admin, deleteRestaurant);
router.route('/:id').put(protect, admin, updateRestaurant);

export default router;
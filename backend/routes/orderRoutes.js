import express from 'express';

import {
	createOrder,
	getMyOrders,
	getOrderById,
	getOrders,
	getRestaurantOrders,
	getRestaurantOrderById,
	updateOrderToDelivered,
	updateOrderToPaid,
	updateRestaurantOrderToDelivered,
} from '../controllers/orderController.js';
import { admin, protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').post(protect, createOrder).get(protect, admin, getOrders);
router.route('/restaurants/orders').get(protect, getRestaurantOrders);
router.route('/restaurants/orders/:id').get(protect, getRestaurantOrderById);
router.route('/myorders').get(protect, getMyOrders);
router.route('/:id').get(protect, getOrderById);
router.route('/:id/pay').put(protect, updateOrderToPaid);
router.route('/:id/deliver').put(protect, admin, updateOrderToDelivered);
router.route('/restaurants/orders/:id/deliver').put(protect, updateRestaurantOrderToDelivered);


export default router;

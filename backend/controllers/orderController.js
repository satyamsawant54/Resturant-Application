import asyncHandler from 'express-async-handler';

import Order from '../models/orderModel.js';
import Restaurant from '../models/restaurantModel.js';

/**
 * @desc 		Create new order
 * @route		POST /api/orders
 * @access	private
 */
const createOrder = asyncHandler(async (req, res) => {
	const {
		orderItems,
		shippingAddress,
		paymentMethod,
		itemsPrice,
		taxPrice,
		shippingPrice,
		totalPrice,
	} = req.body;

	if (orderItems && orderItems.length === 0) {
		res.status(400);
		throw new Error('No order items');
	} else {
		const order = new Order({
			orderItems,
			user: req.user._id,
			shippingAddress,
			paymentMethod,
			itemsPrice,
			taxPrice,
			shippingPrice,
			totalPrice,
		});

		const createdOrder = await order.save();
		res.status(201).json(createdOrder);
	}
});

/**
 * @desc 		Get order by ID
 * @route		GET /api/orders/:id
 * @access	private
 */
const getOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate(
		'user',
		'name email'
	);

	if (order) {
		res.json(order);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

/**
 * @desc 		Update order to paid
 * @route		PUT /api/orders/:id/pay
 * @access	private
 */
const updateOrderToPaid = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isPaid = true;
		order.paidAt = Date.now();
		order.paymentResult = {
			id: req.body.id,
			state: req.body.state,
			update_time: req.body.update_time,
			email_address: req.body.email_address,
		};

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

/**
 * @desc 		Get logged in user's orders
 * @route		GET /api/orders/myorders
 * @access	private
 */
const getMyOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({ user: req.user._id });
	res.json(orders);
});

/**
 * @desc 		Get all orders
 * @route		GET /api/orders/
 * @access	private/admin
 */
const getOrders = asyncHandler(async (req, res) => {
	const orders = await Order.find({}).populate('user', 'name');
	res.json(orders);
});

/**
 * @desc 		Update order to delivered
 * @route		PUT /api/orders/:id/deliver
 * @access	private/admin
 */
const updateOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);

	if (order) {
		order.isDelivered = true;
		order.deliveredAt = Date.now();

		const updatedOrder = await order.save();
		res.json(updatedOrder);
	} else {
		res.status(404);
		throw new Error('Order not found');
	}
});

/**
 * @desc     Get orders for the logged-in restaurant
 * @route    GET /api/restaurants/orders
 * @access   private/restaurant
 */
const getRestaurantOrders = asyncHandler(async (req, res) => {
	if (!req.restaurant) {
	  res.status(401);
	  throw new Error('Not authorized as a restaurant');
	}

	const orders = await Order.find({ 'orderItems.menu': { $in: req.restaurant.menu } })
	  .populate('user', 'name email');
  
	res.json(orders);
  });


/**
 * @desc     Update restaurant order to delivered
 * @route    PUT /api/restaurants/orders/:id/deliver
 * @access   private/restaurant
 */
const updateRestaurantOrderToDelivered = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id);
  
	if (!req.restaurant) {
	  res.status(401);
	  throw new Error('Not authorized as a restaurant');
	}
	if (order && order.restaurant.toString() === req.restaurant._id.toString()) {
	  order.isDelivered = true;
	  order.deliveredAt = Date.now();
  
	  const updatedOrder = await order.save();
	  res.json(updatedOrder);
	} else {
	  res.status(404);
	  throw new Error('Order not found or not associated with the restaurant');
	}
  });


/**
 * @desc     Get order by ID for the restaurant
 * @route    GET /api/restaurants/orders/:id
 * @access   private/restaurant
 */
const getRestaurantOrderById = asyncHandler(async (req, res) => {
	const order = await Order.findById(req.params.id).populate('user', 'name email');
  
	if (order) {
	  // Check if the authenticated restaurant is the one associated with the order
	  if (order.restaurant.toString() === req.restaurant._id.toString()) {
		res.json(order);
	  } else {
		res.status(403);
		throw new Error('Unauthorized: This order does not belong to your restaurant');
	  }
	} else {
	  res.status(404);
	  throw new Error('Order not found');
	}
  });
  

export {
	createOrder,
	getOrderById,
	updateOrderToPaid,
	getMyOrders,
	getOrders,
	getRestaurantOrders,
	getRestaurantOrderById,
	updateOrderToDelivered,
	updateRestaurantOrderToDelivered,
};

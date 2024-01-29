import asyncHandler from 'express-async-handler';

import Restaurant from '../models/restaurantModel.js';
import Menu from '../models/menuModel.js';
import Notification from '../models/notificationModel.js';
import generateToken from '../utils/generateToken.js';


/**
 * @desc     Auth restaurant
 * @route    POST /api/restaurants/login
 * @access   public
 */
const authRestaurant = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const restaurant = await Restaurant.findOne({ email }).populate({
    path: 'menus',
    model: 'Menu',
  });

  if (restaurant && (await restaurant.matchPassword(password))) {
    res.json({     
      _id: restaurant._id,
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.phone,
      icon: restaurant.icon,
      location: restaurant.location,
      address: restaurant.address,
      time_open: restaurant.time_open,
      time_close: restaurant.time_close,
      wallet: restaurant.wallet,
      reviews: restaurant.reviews,
      menus: restaurant.menus, 
      token: generateToken(restaurant._id),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
});


/**
 * @desc     Get restaurant profile
 * @route    GET /api/restaurants/profile
 * @access   private
 */
const getRestaurantProfile = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.restaurant._id);

  if (restaurant) {
    res.json({
      _id: restaurant._id,
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.phone,
      icon: restaurant.icon,
      location: restaurant.location,
      address: restaurant.address,
      time_open: restaurant.time_open,
      time_close: restaurant.time_close,      
    });
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});


/**
 * @desc     Register new restaurant
 * @route    POST /api/restaurants
 * @access   public
 */
const registerRestaurant = asyncHandler(async (req, res) => {
  const { name, email, phone, password } = req.body;

  const restaurantExists = await Restaurant.findOne({ email });

  if (restaurantExists) {
    res.status(400);
    throw new Error('Restaurant already exists');
  }

  const restaurant = await Restaurant.create({
    name,
    email,
    phone,
    password,
    icon: '/images/restaurant.png',
  });

  if (restaurant) {

    const notificationMessage = `Welcome, ${restaurant.name}! to Halisi !`;
		const notification = new Notification({
		  restaurant: restaurant._id,
		  message: notificationMessage,
		  subject: "Welcome",
		});
		await notification.save();

    res.status(201).json({
      _id: restaurant._id,
      name: restaurant.name,
      email: restaurant.email,
      phone: restaurant.phone,
      icon: restaurant.icon,
      token: generateToken(restaurant._id),
    });
  } else {
    res.status(400);
    throw new Error('Invalid restaurant data');
  }
});


/**
 * @desc     Update restaurant profile
 * @route    PUT /api/restaurants/profile
 * @access   private
 */
const updateRestaurantProfile = asyncHandler(async (req, res) => {
  const restaurant = await Restaurant.findById(req.restaurant._id);

  if (restaurant) {
    restaurant.name = req.body.name || restaurant.name;
    restaurant.email = req.body.email || restaurant.email;
    restaurant.phone = req.body.phone || restaurant.phone;
    restaurant.icon = req.body.icon || restaurant.icon;
    restaurant.location.type = 'Point';
    restaurant.location.coordinates = req.body.coordinates || restaurant.location.coordinates;
    restaurant.address = req.body.address || restaurant.address;
    restaurant.time_open = req.body.time_open || restaurant.time_open;
    restaurant.time_close = req.body.time_close || restaurant.time_close;

    if (req.body.password) {
      restaurant.password = req.body.password;
    }

    const updatedRestaurant = await restaurant.save();

    if (updatedRestaurant) {
      if (updatedRestaurant.wallet && updatedRestaurant.wallet.length > 0) {
        const wallet = updatedRestaurant.wallet[0];
        wallet.phone = updatedRestaurant.phone;
        await wallet.save();
      }

      const notificationMessage = `Your profile has been updated successfully, ${updatedRestaurant.name}!`;
      const notification = new Notification({
        restaurant: updatedRestaurant._id,
        message: notificationMessage,
        subject: "Profile Update",
      });
      await notification.save();

      res.json({
        _id: updatedRestaurant._id,
        name: updatedRestaurant.name,
        email: updatedRestaurant.email,
        phone: updatedRestaurant.phone,
        icon: updatedRestaurant.icon,
        location: updatedRestaurant.location,
        address: updatedRestaurant.address,
        time_open: updatedRestaurant.time_open,
        time_close: updatedRestaurant.time_close,
      });
    }
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});


/**
 * @desc 		Get all restaurants
 * @route		GET /api/restaurants/
 * @access	public
 */
const getRestaurants = asyncHandler(async (req, res) => {
  const keyword = req.query.keyword;
  let restaurants;

  if (keyword) {
    restaurants = await Restaurant.find({
      name: { $regex: keyword, $options: 'i' },
    }).select('-password');
  } else {
    restaurants = await Restaurant.find({}).select('-password');
  }
  res.json(restaurants);
});


/**
 * @desc 		Get user by ID
 * @route		GET /api/restaurants/:id
 * @access	public
 */
const getRestaurantByID = asyncHandler(async (req, res) => {
	const restaurant = await Restaurant.findById(req.params.id).select('-password');

	if (restaurant) {
		res.json(restaurant);
	} else {
		res.status(404);
		throw new Error('Restaurant not found');
	}
});


/**
 * @desc 		Delete restaurant
 * @route		DELETE /api/restaurants/:id
 * @access	private/admin
 */
const deleteRestaurant = asyncHandler(async (req, res) => {
	const restaurant = await Restaurant.findById(req.params.id);

	if (restaurant) {
		await Restaurant.deleteOne(restaurant);
		res.json({ message: 'Restaurant deleted' });
	} else {
		res.status(404);
		throw new Error('Restaurant not found');
	}
});


/**
 * @desc 		Admin Update a Restaurant
 * @route		PUT /api/restaurants/:id
 * @access	private/admin
 */
const updateRestaurant = asyncHandler(async (req, res) => {
	const restaurant = await Restaurant.findById(req.params.id);

	if (restaurant) {
		restaurant.name = req.body.name || restaurant.name;
		restaurant.email = req.body.email || restaurant.email;
		restaurant.isAdmin = req.body.isAdmin;

		const updatedRestaurant = await restaurant.save();

		res.json({
			_id: updatedRestaurant._id,
			name: updatedRestaurant.name,
			email: updatedRestaurant.email,
			isAdmin: updatedRestaurant.isAdmin,
		});
	} else {
		res.status(404);
		throw new Error('Restaurant not found');
	}
});


/**
 * @desc     Create a menu item for the restaurant
 * @route    POST /api/restaurants/menus
 * @access   private
 */
const createMenu = asyncHandler(async (req, res) => {
  const { id: restaurantId } = req.restaurant;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    res.status(404);
    throw new Error('Restaurant not found');
  }

  const menuData = {
    name: req.body.name || 'Menu name',
    description: req.body.description || 'Describe the menu item here',
    price: req.body.price || 0,
    images: req.body.images || ['/images/menuItem.png'],
    quantityInStock: req.body.quantityInStock || 0,
  };

  const menu = new Menu({
    restaurant: restaurant._id, 
    ...menuData,
  });

  const createdMenu = await menu.save();

  restaurant.menus.push(createdMenu._id);

  const updatedRestaurant = await restaurant.save();

  if (!updatedRestaurant) {
    res.status(400);
    throw new Error('Failed to create menu item');
  }

  const notificationMessage = `New menu item "${createdMenu.name}" has been added to your restaurant's menu.`;
  const notification = new Notification({
    restaurant: updatedRestaurant._id,
    message: notificationMessage,
    subject: 'Menu Item',
  });

  await notification.save();

  res.status(201).json(createdMenu);
});


/**
 * @desc     Update a menu item for a Restaurant
 * @route    PUT /api/restaurants/menus/:id
 * @access   private
 */
const updateMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId, menuItemId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (restaurant) {
    const { name, price, description, images, quantityInStock } = req.body;

    const menuItem = await Menu.findById(menuItemId);

    if (menuItem) {
      if (name) {
        menuItem.name = name;
      }

      if (price) {
        menuItem.price = price;
      }

      if (description) {
        menuItem.description = description;
      }

      if (images) {
        menuItem.images = images;
      }

      if (quantityInStock !== undefined) {
        menuItem.quantityInStock = quantityInStock;
      }

      const updatedMenuItem = await menuItem.save();

      const index = restaurant.menus.findIndex((item) => item.toString() === menuItemId);
      restaurant.menus[index] = updatedMenuItem._id;

      const updatedRestaurant = await restaurant.save();

      if (updatedRestaurant) {
        const notificationMessage = `Menu item "${name}" has been updated in your restaurant's menu.`;
        const notification = new Notification({
          restaurant: updatedRestaurant._id,
          message: notificationMessage,
          subject: 'Menu Item Updated',
        });

        await notification.save();

        res.json(updatedMenuItem);
      } else {
        res.status(400);
        throw new Error('Failed to update menu item');
      }
    } else {
      res.status(404);
      throw new Error('Menu item not found');
    }
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});
  

/**
 * @desc     Get all menus under a Restaurant
 * @route    GET /api/restaurants/menus
 * @access   private
 */
const getMyMenus = asyncHandler(async (req, res) => {
  const restaurantId = req.restaurant._id;

  const restaurant = await Restaurant.findById(restaurantId).populate('menus');

  if (restaurant) {
    res.json(restaurant.menus);
  } else {
    res.status(404).json([]);
    throw new Error('Restaurant not found');
  }
});

  
/**
 * @desc     Get a menu by ID for a Restaurant
 * @route    GET /api/restaurants/menus/:id
 * @access   private
 */
const getRestaurantMenuById = asyncHandler(async (req, res) => {
  const { restaurantId, menuId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    res.status(401);
    throw new Error('Not authorized to access this resource');
  }

  const menu = await Menu.findById(menuId);

  if (menu && menu.restaurant.toString() === restaurantId) {
    res.json(menu);
  } else {
    res.status(404);
    throw new Error('Menu not found');
  }
});


/**
 * @desc     Delete a menu item for the restaurant
 * @route    DELETE /api/restaurants/menus/:id
 * @access   private
 */
const deleteMenuItem = asyncHandler(async (req, res) => {
  const { restaurantId, menuItemId } = req.params;

  const restaurant = await Restaurant.findById(restaurantId);

  if (!restaurant) {
    res.status(401);
    throw new Error('Not authorized to delete this menu item');
  }

  // Use $pull to remove the menu item from the restaurant's menu array
  const updatedRestaurant = await Restaurant.findByIdAndUpdate(
    restaurantId,
    { $pull: { menu: menuItemId } },
    { new: true }
  );

  if (updatedRestaurant) {
    const notificationMessage = `Menu item has been deleted from your restaurant's menu.`;
    const notification = new Notification({
      restaurant: updatedRestaurant._id,
      message: notificationMessage,
      subject: 'Menu Item Deleted',
    });

    await notification.save();

    res.json(updatedRestaurant.menu);
  } else {
    res.status(404);
    throw new Error('Menu item not found');
  }
});


/**
 * @desc 		Create new Restaurant review
 * @route		POST /api/restaurants/:id/reviews
 * @access	private
 */
const createRestaurantReview = asyncHandler(async (req, res) => {
  const { rating, comment } = req.body;

  const restaurant = await Restaurant.findById(req.params.id);

  if (restaurant) {
    const review = {
      name: req.user.name, 
      rating: +rating,
      comment,
      user: req.user._id, 
    };

    restaurant.reviews.push(review);
    restaurant.numReviews = restaurant.reviews.length;

    restaurant.rating =
      restaurant.reviews.reduce((acc, currVal) => currVal.rating + acc, 0) /
      restaurant.reviews.length;

    await restaurant.save();
    res.status(201).json({ message: 'Review added' });
  } else {
    res.status(404);
    throw new Error('Restaurant not found');
  }
});


export {
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
};

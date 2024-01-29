import asyncHandler from 'express-async-handler';

import Menu from '../models/menuModel.js';

  
  /**
   * @desc     Get all menus or search menus by name
   * @route    GET /api/menus
   * @access   public
   */
  const getAllMenus = asyncHandler(async (req, res) => {
    const { search } = req.query;
    let query = {};
  
    if (search) {
      query = { name: { $regex: new RegExp(search, 'i') } };
    }
  
    const menus = await Menu.find(query);
    if ((!menus || menus.length === 0) && !search) {
      const allMenus = await Menu.find({});
      res.json(allMenus);
    } else {
      res.json(menus);
    }
  });

  /**
 * @desc 		Get single menu
 * @route		GET /api/menus/:id
 * @access	public
 */
  const getMenuById = asyncHandler(async (req, res) => {
    try {
      const menu = await Menu.findById(req.params.id);
  
      if (menu) {
        // You can populate any referenced fields here
        // For example, if 'restaurant' is a referenced field, you can populate it like this:
        await menu.populate('restaurant', 'name').execPopulate();
  
        res.json(menu);
      } else {
        res.status(404);
        throw new Error('Menu not found');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Something went wrong' });
    }
  });
  
  
  
  /**
   * @desc     Get the top menus
   * @route    GET /api/menus/top
   * @access   public
   */
  const getTopMenus = asyncHandler(async (req, res) => {
    // Fetch top 6 menus by sorting based on popularity or rating
    const topMenus = await Menu.find().sort({ popularity: -1 }).limit(6);
  
    res.json(topMenus);
  });
  
  
  /**
   * @desc     Like a menu item
   * @route    POST /api/menus/:id/like
   * @access   private
   */
  const likeMenu = asyncHandler(async (req, res) => {
    const { menuId } = req.params;
    const user = req.user; 
  
    const menu = await Menu.findById(menuId);
  
    if (menu) {
      const liked = menu.likes.some((userId) => userId.equals(user._id));
  
      if (!liked) {
        menu.likes.push(user._id);
        menu.popularity += 1;
        await menu.save();
  
        res.json({ message: 'Menu liked successfully' });
      } else {
        res.status(400);
        throw new Error('Menu already liked');
      }
    } else {
      res.status(404);
      throw new Error('Menu not found');
    }
  });
  
  
  /**
   * @desc     Dislike a menu item
   * @route    POST /api/menus/:id/dislike
   * @access   private
   */
  const dislikeMenu = asyncHandler(async (req, res) => {
    const { menuId } = req.params;
    const user = req.user; 
  
    const menu = await Menu.findById(menuId);
  
    if (menu) {
      const disliked = menu.dislikes.some((userId) => userId.equals(user._id));
  
      if (!disliked) {
        menu.dislikes.push(user._id);
        menu.popularity -= 1;
        await menu.save();
  
        res.json({ message: 'Menu disliked successfully' });
      } else {
        res.status(400);
        throw new Error('Menu already disliked');
      }
    } else {
      res.status(404);
      throw new Error('Menu not found');
    }
  });

  export {  
    getAllMenus,
    getMenuById,   
    getTopMenus,
    likeMenu,
    dislikeMenu,
  };
  
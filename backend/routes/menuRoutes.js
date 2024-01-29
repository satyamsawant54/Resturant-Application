import express from 'express';

import {
    getAllMenus,
    getMenuById,
    getTopMenus,
    likeMenu,
    dislikeMenu,  
} from '../controllers/menuController.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.route('/').get(getAllMenus);
router.route('/:id').get( getMenuById);
router.route('/top').get(getTopMenus);
router.route('/:id/like').put(protect, likeMenu);
router.route('/:id/dislike').put(protect, dislikeMenu);

export default router;
import express from 'express';
const router = express.Router();


import { protect } from '../middleware/auth.middleware.js';

import { 
    getMyCart, 
    addItemToCart, 
    removeItemFromCart 
} from '../controllers/cart.controller.js'; 

router.route('/')
    .get(protect, getMyCart); 

router.post('/add', protect, addItemToCart);

router.delete('/:itemId', protect, removeItemFromCart);


export default router;
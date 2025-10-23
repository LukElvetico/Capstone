import express from 'express';
const router = express.Router();

import { protect } from '../middleware/auth.middleware.js';

import { 
    addToCart,          
    getMyCart,          
    removeItemFromCart,
    updateItemQuantity 
} from '../controllers/cart.controller.js'; 

router.route('/')
    .get(protect, getMyCart) 
    .post(protect, addToCart); 


router.route('/:itemId')
    .put(protect, updateItemQuantity) 
    .delete(protect, removeItemFromCart); 

export default router;
import express from 'express';
const router = express.Router();

import { protect, admin } from '../middleware/auth.middleware.js';

import { 
    createOrderFromCart,
    getMyOrders, 
    getOrderById,

} from '../controllers/order.controller.js'; 

router.route('/me')
    .get(protect, getMyOrders);

router.route('/:id')
    .get(protect, getOrderById);

export default router;
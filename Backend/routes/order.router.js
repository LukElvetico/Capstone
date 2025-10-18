import express from 'express';
const router = express.Router();

import { protect, admin } from '../middleware/auth.middleware.js';

import { 
    createOrderFromCart, 
    completeCheckout, 
    getMyOrders, 
    getOrderById 
} from '../controllers/order.controller.js'; 

router.route('/')
    .post(protect, createOrderFromCart);

router.get('/me', protect, getMyOrders);

router.put('/:orderId/pay', protect, completeCheckout);

router.route('/:id')
    .get(protect, getOrderById);

export default router;
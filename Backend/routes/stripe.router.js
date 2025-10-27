import express from 'express';
import { protect } from '../middleware/auth.middleware.js'; 
import { createCheckoutSession, handleWebhook } from '../controllers/stripe.controller.js';

const router = express.Router();


router.post('/create-checkout-session', protect, createCheckoutSession);

router.post('/webhook', handleWebhook);

export default router;
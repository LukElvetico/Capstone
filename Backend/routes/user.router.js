import express from 'express';
const router = express.Router();

import { protect } from '../middleware/auth.middleware.js';

import { getMyProfile, updateMyProfile } from '../controllers/user.controller.js'; 

router.route('/me')
    .get(protect, getMyProfile)
    .put(protect, updateMyProfile);


export default router;
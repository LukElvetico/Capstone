import express from 'express';  
const router = express.Router();

import { registerUser, loginUser, logoutUser } from '../controllers/auth.controller.js'; 
import { protect } from '../middleware/auth.middleware.js'; 

router.post('/register', registerUser);

router.post('/login', loginUser);

router.post('/logout', protect, logoutUser); 

export default router;
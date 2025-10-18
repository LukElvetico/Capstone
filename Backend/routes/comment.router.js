import express from 'express';
const router = express.Router({ mergeParams: true }); 

import { protect } from '../middleware/auth.middleware.js'; 
import { createComment, getCommentsByParent } from '../controllers/comment.controller.js'; 

router.post('/', protect, createComment); 

router.get('/', getCommentsByParent); 

export default router;
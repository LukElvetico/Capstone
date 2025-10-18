import express from 'express';
import { protect, checkPurchase } from '../middleware/auth.middleware.js'; 
import { createPost, getPosts, getPostById } from '../controllers/post.controller.js'; 
import commentRouter from './comment.router.js'; 

const router = express.Router();
router.route('/').post(protect, checkPurchase, createPost);

router.route('/').get(getPosts);
router.route('/:id').get(getPostById);

router.use('/:postId/comments', commentRouter); 


export default router;
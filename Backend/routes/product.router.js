import express from 'express';
const router = express.Router();

import { protect, admin, checkPurchase } from '../middleware/auth.middleware.js';

import { 
    listAllProducts, 
    getProductDetails, 
    createProduct, 
    updateProduct, 
    deleteProduct, 
    configureProduct 
} from '../controllers/product.controller.js'; 

import { createComment, getCommentsByParent } from '../controllers/comment.controller.js'; 

router.get('/', listAllProducts); 

router.get('/:id', getProductDetails); 

router.post('/configurator', configureProduct); 

router.post('/', protect, admin, createProduct); 

router.route('/:id')
    .put(protect, admin, updateProduct)
    .delete(protect, admin, deleteProduct);
router.post('/:productId/comments', protect, checkPurchase, createComment); 

router.get('/:productId/comments', getCommentsByParent); 


export default router;
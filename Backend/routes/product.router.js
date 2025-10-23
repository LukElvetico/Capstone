import express from 'express';
import { 
    createProduct, 
    getProducts, 
    getProductById,
    updateProduct, 
    deleteProduct, 
} from '../controllers/product.controller.js';
import { protect, admin } from '../middleware/auth.middleware.js'; 
import { upload, uploadToCloudinary } from '../middleware/uploadCloudinary.js'; 

const router = express.Router();

router
    .route('/')
    .get(getProducts)
    .post(protect, admin, upload.single('image'), uploadToCloudinary, createProduct); 

router
    .route('/:id')
    .get(getProductById)
    .put(protect, admin, upload.single('image'), uploadToCloudinary, updateProduct) 
    .delete(protect, admin, deleteProduct); 

export default router;

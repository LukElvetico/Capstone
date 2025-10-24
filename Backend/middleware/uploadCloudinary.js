import { v2 as cloudinary } from 'cloudinary';
import multer from 'multer';

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
export const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadToCloudinary = async (req, res, next) => {
    if (!req.file) {
        return next(); 
    }

    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = "data:" + req.file.mimetype + ";base64," + b64;

    try {
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: 'capstone-products',
            resource_type: 'auto'
        });


        req.body.imageUrl = result.secure_url; 
        
        next();

    } catch (error) {
        console.error('Errore Cloudinary:', error);
        res.status(500).json({ message: 'Errore durante l\'upload dell\'immagine.', error: error.message });
    }
};
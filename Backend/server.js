import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; 
import { notFound, errorHandler } from './middleware/error.middleware.js'; 
import authRouter from './routes/auth.router.js';
import userRouter from './routes/user.router.js';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js'; 
import postRouter from './routes/post.router.js'; 
import orderRouter from './routes/order.router.js'; 
import commentRouter from './routes/comment.router.js';


const app = express();

const MONGODB_URI = process.env.MONGODB_URI; 
const PORT = process.env.PORT || 4000;

const corsOptions = {
    origin: process.env.FRONTEND_URL,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    optionsSuccessStatus: 204
};

app.use(cors(corsOptions));
app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.get('/', (req, res) => {
    res.json({ message: "Il Backend è online e funzionante!" });
});
app.use('/api', authRouter); 
app.use('/api/users', userRouter); 
app.use('/api/products', productRouter); 
app.use('/api/cart', cartRouter); 
app.use('/api/orders', orderRouter); 
app.use('/api/posts', postRouter); 
app.use('/api/comments', commentRouter); 
app.use(notFound);
app.use(errorHandler);
app.use((req, res, next) => {
    console.error(`TENTATIVO DI ACCESSO A ROTTA NON TROVATA: ${req.method} ${req.originalUrl}`);
    next();
});
app.use(notFound);
app.use(errorHandler);

const startServer = async () => {
    try {
        if (!MONGODB_URI) {
            throw new Error("MONGODB_URI non è definito nel file .env");
        }
        
        await mongoose.connect(MONGODB_URI); 
        console.log("Server correttamente collegato al database MongoDB"); 

        app.listen(PORT, () => {
            console.log(`Il server è online sulla porta ${PORT}`);
        });

    } catch (error) {
        console.error("ERRORE CRITICO DI CONNESSIONE AL DB:", error.message);
        process.exit(1);
    }
};

startServer();

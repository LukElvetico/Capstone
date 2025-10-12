import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; 
import authRouter from './routes/auth.router.js';
import userRouter from './routes/user.router.js';
import productRouter from './routes/product.router.js';
import cartRouter from './routes/cart.router.js';
import postRouter from './routes/post.router.js'; 
// da finire gli import di rotte, modelli ecc

// start express
const app = express();

const MONGODB_URI = process.env.MONGODB_URI; 
const PORT = process.env.PORT || 4000;

const corsOptions = {
 // origine
 origin: process.env.FRONTEND_URL || 'http://localhost:5173', // SOSTITUIRE CON PORT DA .ENV //alterntiva: origin: process.env.FRONTEND_URL || 'http://localhost:5173',
 methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
 credentials: true, // per cookie/headers di autenticazione
 optionsSuccessStatus: 204
};

// middlewares
app.use(cors(corsOptions));
app.use(express.json()); 
// da finire

// Rotte (Definizione degli endpoint API)

// Rotta di benvenuto
app.get('/', (req, res) => {
 res.json({ message: "Il Backend è online" });
});

// Rotte per l'Autenticazione (/api/register, /api/login, /api/logout)
app.use('/api', authRouter); 

// Rotte per gli Utenti (/api/users/me)
app.use('/api/users', userRouter); 

// Rotte per Prodotti e Configuratore (/api/products/:id, /api/configurator)
app.use('/api/products', productRouter); 

// Rotte per Carrello e Checkout (/api/cart, /api/cart/items, /api/checkout)
app.use('/api/cart', cartRouter);

//Rotte per i Post della Community (/api/posts, /api/posts/:id)
app.use('/api/posts', postRouter); 

// Start server

const startServer = async () => {
 try {
  // connessione mongo da env
 await mongoose.connect(MONGODB_URI);  
  console.log("Server correttamente collegato al database"); 

//express
  app.listen(PORT, () => {
   console.log(`Il server è online sulla porta ${PORT}`);
  });

 } catch (err) {
  // errore
  console.error("❌ ERRORE CRITICO: Impossibile connettersi al database.");
  console.error(err.message);
  process.exit(1);
 }
};


startServer();
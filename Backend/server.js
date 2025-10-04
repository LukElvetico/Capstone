import express from 'express';
import cors from 'cors';
// Altri import come mongoose, dotenv, ecc.

const app = express();

// 1. CONFIGURAZIONE CORS
const corsOptions = {
    // ⚠️ Importante: Specifica l'origine ESATTA del tuo Frontend Vite
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // Permette l'invio di cookie/headers di autenticazione
    optionsSuccessStatus: 204
};

// 2. Applica il middleware CORS
app.use(cors(corsOptions));

// Altri middleware
app.use(express.json()); 
// app.use(express.urlencoded({ extended: true }));
// ...

// Rotte
app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});

// Avvio del server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Il server è online alla porta ${PORT}`);
});
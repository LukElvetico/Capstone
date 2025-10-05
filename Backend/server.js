// server.js CORRETTO

import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import 'dotenv/config'; 
// da finire gli import di rotte, modelli ecc

// Correzione 1: Rimuovi la riga 'require', in quanto express è già importato sopra.
// const express = require('express'); 

// Inizializzazione di Express
const app = express();

// Correzione 2: Usa il nome della variabile d'ambiente corretto: MONGODB_URI
const MONGODB_URI = process.env.MONGODB_URI; 
const PORT = process.env.PORT || 4000;

//const port = process.env.PORT > per la 4000
//const allowedOrigin = 'https:vercel.ecc'
// CORS
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

// Rotte
app.get('/', (req, res) => {
    res.json({ message: "Il Backend è online" });
});

// Start server

const startServer = async () => {
    try {
        // connessione mongo da env
        // Qui usiamo la variabile d'ambiente corretta MONGODB_URI
        await mongoose.connect(MONGODB_URI);
    
        // verifica
        console.log("Server correttamente collegato al database"); 

        // avvio express
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
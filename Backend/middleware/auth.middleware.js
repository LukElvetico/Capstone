import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const protect = (req, res, next) => {
    // Logica per verificare il token JWT
    
    //PLACEHOLDER
    if (!req.user) {
        console.warn("ATTENZIONE: Il middleware 'protect' è un placeholder e non autentica realmente.");
        // NEXT PER PROCEDERE
        
        // PLACEHOLDER
        // SIMULAZIONE DI UN UTENTE AUTENTICATO
        req.user = { id: 'placeholderUserId', hasPurchased: true }; 
        // ------------------------------
    }
    
    next();
};

// MIDDLEWARE ADMIN (OPZIONALE DA IMPLEMENTARE)
/*
export const admin = (req, res, next) => {
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(401).send({ message: 'Non autorizzato come amministratore' });
    }
};
/*
*/
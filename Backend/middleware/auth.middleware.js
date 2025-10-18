// File: middleware/auth.middleware.js

import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

// Assicurati che JWT_SECRET sia accessibile da qui (normalmente tramite variabili d'ambiente)
const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_placeholder'; 

/**
 * @desc Middleware 'protect': Verifica JWT e autentica l'utente loggato.
 */
export const protect = async (req, res, next) => { // 🚨 Rinominata in 'protect'
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);

            // Trova l'utente tramite l'ID nel token e attacca l'oggetto utente a req.user (escludendo la password)
            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                // Utente non più esistente (es. cancellato)
                return res.status(401).json({ message: 'Utente non trovato o token non valido.' });
            }

            // Tutto ok, prosegui
            next();

        } catch (error) {
            // JWT non valido (scaduto, alterato, ecc.)
            console.error(error);
            return res.status(401).json({ message: 'Non autorizzato, token fallito o scaduto.' });
        }
    }

    if (!token) {
        // Nessun token fornito nell'header
        return res.status(401).json({ message: 'Non autorizzato, nessun token fornito.' });
    }
};


/**
 * @desc Middleware 'admin': Autorizza solo gli amministratori.
 */
export const admin = (req, res, next) => {
    // Richiede che 'protect' sia stato chiamato prima per popolare req.user
    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Non autorizzato. Accesso consentito solo agli amministratori.' });
    }
};

/**
 * @desc Middleware 'checkPurchase': Autorizza solo chi ha effettuato un acquisto (hasPurchased: true).
 */
export const checkPurchase = (req, res, next) => {
    // Richiede che 'protect' sia stato chiamato prima
    if (req.user && req.user.hasPurchased) {
        next();
    } else {
        res.status(403).json({ message: 'Non autorizzato. Devi aver effettuato almeno un acquisto per accedere a questa funzionalità.' });
    }
};
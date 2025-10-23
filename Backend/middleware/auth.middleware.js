import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const JWT_SECRET = process.env.JWT_SECRET; 
export const protect = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];
            if (!token || token.toLowerCase() === 'null' || token.toLowerCase() === 'undefined' || token.length < 10) {
                console.error("Tentativo di accesso con token mancante o fittizio.");
                return res.status(401).json({ message: 'Non autorizzato, il token è mancante o non valido. Riprova il login.' });
            }

            const decoded = jwt.verify(token, JWT_SECRET); 

            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Utente non trovato o token non valido.' });
            }

            next();

        } catch (error) {
            console.error("Errore di verifica JWT:", error.message);
            return res.status(401).json({ message: 'Non autorizzato. Token non valido o scaduto. Riprova il login.' });
        }
    } else {
        return res.status(401).json({ message: 'Non autorizzato, nessun token fornito nell\'header.' });
    }
};

export const admin = (req, res, next) => {

    if (req.user && req.user.isAdmin) {
        next();
    } else {
        res.status(403).json({ message: 'Non autorizzato. Accesso consentito solo agli amministratori.' });
    }
};

export const checkPurchase = (req, res, next) => {
    if (req.user && req.user.hasPurchased) {
        next();
    } else {
        res.status(403).json({ message: 'Non autorizzato. Devi aver effettuato un acquisto per accedere a questa funzionalità.' });
    }
};
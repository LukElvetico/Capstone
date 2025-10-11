import jwt from 'jsonwebtoken';
import User from '../models/User.js'; 

const JWT_SECRET = process.env.JWT_SECRET || 'jwt_secret_placeholder'; 

export const authenticateUser = async (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1];

            const decoded = jwt.verify(token, JWT_SECRET);

            req.user = await User.findById(decoded.userId).select('-password');
            
            if (!req.user) {
                return res.status(401).json({ message: 'Utente non trovato o token non valido.' });
            }

            next();

        } catch (error) {
            console.error(error);
            return res.status(401).json({ message: 'Non autorizzato, token fallito o scaduto.' });
        }
    }

    if (!token) {
        return res.status(401).json({ message: 'Non autorizzato, nessun token fornito.' });
    }
};

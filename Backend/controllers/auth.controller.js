import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import bcrypt from 'bcryptjs'; 
import { sendWelcomeEmail } from '../helpers/mailer.js';
const generateToken = (userId, isAdmin) => {
    return jwt.sign(
        { userId, isAdmin }, 
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
    );
};
export const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body; 

    if (!firstName || !lastName || !email || !password) {
        res.status(400); 
        throw new Error('Assicurati di compilare tutti i campi (Nome, Cognome, Email, Password).');
    }
    
    const userExists = await User.findOne({ email });

    if (userExists) {
        res.status(400);
        throw new Error('Utente già registrato con questa email.');
    }

    try {
        const user = await User.create({
            firstName, 
            lastName, 
            email,
            password,
        });

        if (user) {
            
            sendWelcomeEmail(user.email, user.firstName)
                .catch(err => console.error("Email di benvenuto non inviata:", err));
            res.status(201).json({
                _id: user._id,
                firstName: user.firstName,
                lastName: user.lastName,
                email: user.email,
                isAdmin: user.isAdmin,
                hasPurchased: user.hasPurchased,
                token: generateToken(user._id, user.isAdmin),
            });
        } else {
            res.status(400);
            throw new Error('Dati utente non validi.');
        }
    } catch (error) {
        if (error.name === 'ValidationError') {
            const message = Object.values(error.errors).map(val => val.message).join(', ');
            res.status(400);
            throw new Error(`Errore di validazione: ${message}`);
        } 
        
        console.error("ERRORE DURANTE IL SALVATAGGIO UTENTE:", error);
        res.status(500);
        throw new Error('Errore interno del server durante la creazione utente. Verifica la connessione DB.');
    }
});

export const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
        res.json({
            _id: user._id,
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isAdmin: user.isAdmin,
            hasPurchased: user.hasPurchased,
            token: generateToken(user._id, user.isAdmin),
        });
    } else {
        res.status(401); 
        throw new Error('Email o password non validi.');
    }
});
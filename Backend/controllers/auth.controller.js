import User from '../models/User.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET; 

const generateToken = (userId, isAdmin) => {
    return jwt.sign(
        { 
            userId: userId,
            isAdmin: isAdmin 
        }, 
        JWT_SECRET, 
        { expiresIn: '1d' } 
    );
};
 

/**
 * @desc Registra un nuovo utente nel sistema
 * @route POST /api/auth/register
 * @access Pubblica
 */
export const registerUser = async (req, res) => { 
    const { email, firstName, lastName, password } = req.body; 

    if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ message: 'Per favore, inserisci tutti i campi richiesti.' });
    }

    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'Utente già registrato.' });
        }

        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
        
        const newUser = await User.create({
            email, 
            firstName, 
            lastName, 
            password: hashedPassword, 
        });
        
        const token = generateToken(newUser._id, newUser.isAdmin);

        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            isAdmin: newUser.isAdmin,
            hasPurchased: newUser.hasPurchased, 
            token: token, 
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore durante la registrazione.', error: error.message });
    }
}; 

/**
  @desc Autentica l'utente e restituisce il token
  @route POST /api/auth/login
  @access Pubblica
 **/
export const loginUser = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Inserisci email e password.' });
    }

    try {
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ message: 'Credenziali non valide.' });
        }

        const token = generateToken(user._id, user.isAdmin);

        res.status(200).json({
            _id: user._id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isAdmin: user.isAdmin,
            hasPurchased: user.hasPurchased,
            token: token,
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore durante l\'accesso.', error: error.message });
    }
};
 

/**
 * @desc Logout (Lato server)
 * @route POST /api/auth/logout
 * @access Privata
 */
export const logoutUser = (req, res) => { 
    res.status(200).json({ message: 'Logout effettuato con successo (token distrutto lato client).' });
};
import User from '../models/User.js'; // Assicurati che il percorso sia corretto
export const register = async (req, res) => {
    // Estrai SOLO i campi necessari. Non estrarre 'isAdmin' da req.body!
    const { email, firstName, lastName, password } = req.body; 

    // ... logica per hasing e salvataggio ...

    const newUser = new User({ 
        email, 
        firstName, 
        lastName, 
        password: hashedPassword 
        // 'isAdmin' sarà automaticamente 'false' grazie al default nel Model
    });
    
    // ... salva e rispondi ...
}; //non deve considereare isAdmin che in models è di default false
// Il primo account Admin non viene creato tramite l'API pubblica di registrazione, ma viene inserito manualmente nel database (o tramite un seeder), impostando isAdmin: true direttamente.

/*import User from '../models/User.js'; //
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Assumiamo che questa sia disponibile tramite process.env
const JWT_SECRET = process.env.JWT_SECRET; 

/**
 * @desc Registra un nuovo utente nel sistema
 * @route POST /api/register
 * @access Pubblica
 *
export const register = async (req, res) => {
    // Estrai SOLO i campi che l'utente può inviare, escludendo isAdmin
    const { email, firstName, lastName, password } = req.body; 

    // 1. Validazione di base (Opzionale: puoi usare anche un middleware come express-validator)
    if (!email || !firstName || !lastName || !password) {
        return res.status(400).json({ message: 'Per favore, inserisci tutti i campi richiesti.' });
    }

    try {
        // 2. Verifica se l'utente esiste già
        const userExists = await User.findOne({ email });

        if (userExists) {
            return res.status(400).json({ message: 'Utente già registrato con questa email.' });
        }

        // 3. Hashing della Password
        // Genera un 'salt' (valore casuale) per rendere l'hash unico
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);
        
        // 4. Crea un nuovo utente
        const newUser = await User.create({
            email, 
            firstName, 
            lastName, 
            password: hashedPassword, 
            // isAdmin: false è il default definito nel Model User.js, non serve specificarlo qui
        });
        
        // 5. Genera il JWT per l'autenticazione immediata dopo la registrazione
        const token = jwt.sign(
            { 
                userId: newUser._id, 
                isAdmin: newUser.isAdmin 
            }, 
            JWT_SECRET, 
            { expiresIn: '1d' }
        );

        // 6. Rispondi con i dati dell'utente e il token
        res.status(201).json({
            _id: newUser._id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            isAdmin: newUser.isAdmin,
            token: token, // Il token per l'accesso immediato
        });

    } catch (error) {
        // Gestione di altri errori del database/server
        res.status(500).json({ message: 'Errore durante la registrazione dell\'utente.', error: error.message });
    }
}; 

aggiungere qui anche la funzione 'login' e 'logout' */
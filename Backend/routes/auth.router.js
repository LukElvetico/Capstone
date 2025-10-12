import express from 'express';  
const router = express.Router();
// Importa il controller per l'autenticazione (Placeholder)
// const authController = require('../controllers/auth.controller'); 

// Rotta per la registrazione di un nuovo utente Metodo HTTP: POST | Endpoint: /api/register
router.post('/register', (req, res) => {
    // authController.register(req, res);
    res.send({ message: 'Placeholder per la Registrazione' });
});

// Rotta per l'accesso (Login) Metodo HTTP: POST | Endpoint: /api/login
router.post('/login', (req, res) => {
    // authController.login(req, res);
    res.send({ message: 'Placeholder per il Login' });
});

// Rotta per il Logout Metodo HTTP: POST | Endpoint: /api/logout
router.post('/logout', (req, res) => {
    // authController.logout(req, res);
    res.send({ message: 'Placeholder per il Logout' });
});

export default router;
/**
 * File: user.router.js
 * Descrizione: Rotte per la gestione del profilo utente (Dettagli Account).
 * Rif. PDF: /api/users/me (GET)
 */

import express from 'express';
const router = express.Router();
// Importa il middleware per la verifica dell'autenticazione (Placeholder)
// const { protect } = require('../middleware/auth.middleware');
// Importa il controller per l'utente (Placeholder)
// const userController = require('../controllers/user.controller'); 

// Rotta per ottenere i dettagli dell'account utente corrente
// Metodo HTTP: GET | Endpoint: /api/users/me
// Questa rotta richiede tipicamente un middleware di autenticazione (`protect`)
router.get('/me', (req, res) => {
    // protect, userController.getAccountDetails(req, res);
    res.send({ message: 'Placeholder per i Dettagli Account' });
});

export default router;  
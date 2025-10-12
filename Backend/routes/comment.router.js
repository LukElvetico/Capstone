import express from 'express';
const router = express.Router();

// Importa eventuali controller e middleware (Placeholder)
// import commentController from '../controllers/comment.controller.js'; 
// import { protect } from '../middleware/auth.middleware.js'; // per utenti loggati

// Rotta per creare un nuovo commento/recensione su un prodotto.
// Metodo HTTP: POST | Endpoint: /api/products/:productId/comments
// L'ID del prodotto viene passato come parametro nella URL.
// Richiede l'autenticazione per assicurarsi che solo gli utenti registrati possano lasciare recensioni.
router.post('/:productId/comments', (req, res) => {
    // protect, commentController.createComment(req, res);
    res.send({ message: `Placeholder per Creare Commento sul Prodotto ID: ${req.params.productId}` });
});

// Rotta per ottenere tutti i commenti/recensioni di un prodotto specifico.
// Metodo HTTP: GET | Endpoint: /api/products/:productId/comments
router.get('/:productId/comments', (req, res) => {
    // commentController.getCommentsByProduct(req, res);
    res.send({ message: `Placeholder per Lista Commenti del Prodotto ID: ${req.params.productId}` });
});

// È essenziale usare 'export default' per le importazioni in server.js
export default router;
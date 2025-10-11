/**
 * File: product.router.js
 * Descrizione: Rotte per prodotti e configurazione.
 * Rif. PDF: /api/products/:id (GET), /api/configurator (POST)
 */

import express from 'express';
const router = express.Router();
// Importa il controller per i prodotti e la configurazione (Placeholder)
// const productController = require('../controllers/product.controller'); 

// Rotta per ottenere un singolo prodotto tramite ID/Slug
// Metodo HTTP: GET | Endpoint: /api/products/:id
router.get('/:id', (req, res) => {
    // productController.getProductDetails(req, res);
    res.send({ message: `Placeholder per Dettagli Prodotto ID: ${req.params.id}` });
});

// Rotta per la configurazione personalizzata di un prodotto
// Metodo HTTP: POST | Endpoint: /api/configurator
// Tipicamente riceve i parametri di configurazione (memoria, colore, ecc.)
router.post('/configurator', (req, res) => {
    // productController.configureProduct(req, res);
    res.send({ message: 'Placeholder per Configura Prodotto' });
});

// Rotta implicita per la lista prodotti (non esplicitamente in PDF API, ma dedotta da FE /products)
// Metodo HTTP: GET | Endpoint: /api/products
router.get('/', (req, res) => {
    // productController.listAllProducts(req, res);
    res.send({ message: 'Placeholder per Lista Prodotti' });
});

export default router;
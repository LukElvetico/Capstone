// File: controllers/cart.controller.js

import Cart from '../models/Cart.js';
import Product from '../models/Product.js'; 
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 

// ===================================================================
// FUNZIONI HELPER
// ===================================================================

/**
 * @desc Funzione helper per confrontare due array di configurazioni
 * È vitale per determinare se due articoli con lo stesso prodotto base
 * sono considerati lo stesso articolo nel carrello (stesse customizzazioni).
 */
const areConfigurationsEqual = (config1, config2) => {
    if (config1.length !== config2.length) {
        return false;
    }
    
    // Ordina le configurazioni per nome per garantire che l'ordine non influisca sul confronto
    const sortedConfig1 = [...config1].sort((a, b) => a.name.localeCompare(b.name));
    const sortedConfig2 = [...config2].sort((a, b) => a.name.localeCompare(b.name));

    return sortedConfig1.every((c1, index) => {
        const c2 = sortedConfig2[index];
        // Confrontiamo nome, valore e priceAdjustment per una corrispondenza esatta
        return c1.name === c2.name && c1.value === c2.value && c1.priceAdjustment === c2.priceAdjustment;
    });
};


// ===================================================================
// CONTROLLER
// ===================================================================

/**
 * @desc Ottiene il carrello dell'utente loggato
 * @route GET /api/cart
 * @access Privata (richiede protect)
 */
export const getMyCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        res.status(200).json({ cart });
    } else {
        // Se non esiste un carrello, ne restituiamo uno vuoto
        res.status(200).json({ 
            cart: {
                user: req.user._id,
                items: [],
                totalPrice: 0,
            }
        });
    }
});


/**
 * @desc Aggiunge un nuovo articolo al carrello o aggiorna la quantità di uno esistente
 * @route POST /api/cart
 * @access Privata (richiede protect)
 */
export const addToCart = asyncHandler(async (req, res) => {
    // Il frontend invia productId, quantity e configuration
    const { productId, configuration, quantity } = req.body;
    const userId = req.user._id;

    // 1. Validazione di base e di formato
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        throw new Error('ID Prodotto non valido.');
    }
    if (!quantity || quantity <= 0) {
        res.status(400);
        throw new Error('La quantità deve essere un numero maggiore di zero.');
    }
    // ✅ CORREZIONE: verifica che configuration sia un array
    if (!configuration || !Array.isArray(configuration)) {
        res.status(400);
        throw new Error('La configurazione è mancante o non è un array valido. Assicurati che il frontend invii un array di configurazioni.');
    }

    // 2. Troviamo il carrello dell'utente (o ne creiamo uno)
    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        // Se non esiste, crea un nuovo carrello
        cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }

    // 3. Troviamo il prodotto originale nel DB
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Prodotto non trovato.');
    }

    // 4. Calcoliamo il prezzo totale dell'articolo configurato
    let itemPrice = product.basePrice;
    
    // Aggiungiamo i costi delle customizzazioni
    configuration.forEach(config => {
        if (config.priceAdjustment && typeof config.priceAdjustment === 'number') {
            itemPrice += config.priceAdjustment;
        }
    });


    // 5. Verifichiamo se l'articolo (con la stessa configurazione) esiste già nel carrello
    const existingItem = cart.items.find(item => 
        item.productId.toString() === productId && 
        areConfigurationsEqual(item.configuration, configuration)
    );

    if (existingItem) {
        // Articolo esistente: aggiorna la quantità
        existingItem.quantity += quantity;
    } else {
        // Nuovo articolo: aggiungilo all'array
        cart.items.push({
            productId: productId,
            name: product.name, // Salviamo il nome del prodotto per una visualizzazione più semplice
            imageUrl: product.imageUrl,
            configuration: configuration, // Salviamo l'array di configurazioni
            quantity: quantity,
            itemPrice: itemPrice, // Prezzo finale configurato per singolo articolo
        });
    }

    // 6. Ricalcola il totale complessivo del carrello
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);

    const updatedCart = await cart.save();
    
    res.status(201).json({ 
        message: 'Articolo aggiunto al carrello con successo.',
        cart: updatedCart 
    });
});


/**
 * @desc Aggiorna la quantità di un articolo nel carrello
 * @route PUT /api/cart/:itemId
 * @access Privata (richiede protect)
 */
export const updateItemQuantity = asyncHandler(async (req, res) => {
    const { quantity } = req.body;
    const { itemId } = req.params;

    if (!quantity || quantity <= 0) {
        res.status(400);
        throw new Error('La quantità deve essere un numero maggiore di zero.');
    }

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Carrello non trovato.');
    }

    // Trova l'articolo da aggiornare
    const itemToUpdate = cart.items.find(item => item._id.toString() === itemId);

    if (!itemToUpdate) {
        res.status(404);
        throw new Error('Articolo non trovato nel carrello.');
    }

    itemToUpdate.quantity = quantity;

    // Ricalcola il totale complessivo del carrello
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);

    const updatedCart = await cart.save();

    res.status(200).json({ 
        message: 'Quantità articolo aggiornata.', 
        cart: updatedCart 
    });
});


/**
 * @desc Rimuove un articolo dal carrello
 * @route DELETE /api/cart/:itemId
 * @access Privata (richiede protect)
 */
export const removeItemFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Carrello non trovato.');
    }
    
    // Registra la lunghezza iniziale per la verifica
    const initialLength = cart.items.length;
    
    // Rimuoviamo l'articolo filtrando l'array
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

    if (cart.items.length === initialLength) {
         res.status(404);
         throw new Error('Articolo non trovato nel carrello.');
    }

    // Ricalcolo
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);

    const updatedCart = await cart.save();

    res.status(200).json({ 
        message: 'Articolo rimosso dal carrello.', 
        cart: updatedCart 
    });
});
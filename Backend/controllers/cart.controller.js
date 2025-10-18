import Cart from '../models/Cart.js';
import Product from '../models/Product.js'; // serve per verifica? check

/**
 * @desc Ottiene il carrello dell'utente loggato
 * @route GET /api/cart
 * @access Privata (richiede protect)
 */
export const getMyCart = async (req, res) => {
    try {
        // Cerca il carrello associato all'utente loggato e se non esiste, ne crea uno vuoto.
        let cart = await Cart.findOne({ user: req.user._id }).populate('items.productId', 'name imageUrl');

        if (!cart) {
            // Se l'utente non ha un carrello, ne creiamo uno e lo salviamo.
            cart = await Cart.create({ user: req.user._id, items: [] });
        }
        
        res.status(200).json(cart);
        
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero del carrello.', error: error.message });
    }
};

/**
 * @desc Aggiunge un prodotto (già configurato) al carrello
 * @route POST /api/cart/add
 * @access Privata (richiede protect)
 */
export const addItemToCart = async (req, res) => {
    // Dati inviati
    const { productId, configuration, finalPrice, quantity = 1 } = req.body; 

    if (!productId || !configuration || !finalPrice) {
        return res.status(400).json({ message: 'Prodotto, configurazione e prezzo sono obbligatori.' });
    }
    
    try {
        let cart = await Cart.findOne({ user: req.user._id });

        // Se l'utente non ha un carrello, lo creiamo
        if (!cart) {
            cart = await Cart.create({ user: req.user._id, items: [] });
        }

        // Crea il nuovo articolo del carrello
        const newItem = {
            productId,
            quantity: quantity,
            configuration,
            itemPrice: finalPrice, // Prezzo finale per singola unità
        };
        
        // Aggiunge l'articolo all'array e ricalcola il totale
        cart.items.push(newItem);
        
        // Calcola nuovo totale
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);
        
        const updatedCart = await cart.save();
        
        res.status(200).json({ 
            message: 'Prodotto aggiunto al carrello.', 
            cart: updatedCart 
        });
        
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'aggiunta al carrello.', error: error.message });
    }
};

/**
 * @desc Rimuove un articolo dal carrello
 * @route DELETE /api/cart/:itemId
 * @access Privata (richiede protect)
 */
export const removeItemFromCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            return res.status(404).json({ message: 'Carrello non trovato.' });
        }
        
        // Filtra l'array per rimuovere l'articolo con l'_id corrispondente
        const initialLength = cart.items.length;
        cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

        if (cart.items.length === initialLength) {
             return res.status(404).json({ message: 'Articolo non trovato nel carrello.' });
        }
        
        //Ricalcolo
        cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);

        const updatedCart = await cart.save();

        res.status(200).json({ 
            message: 'Articolo rimosso dal carrello.', 
            cart: updatedCart 
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore nella rimozione dal carrello.', error: error.message });
    }
};
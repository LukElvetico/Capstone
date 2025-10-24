import Cart from '../models/Cart.js';
import Product from '../models/Product.js'; 
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 

const areConfigurationsEqual = (config1, config2) => {
    if (config1.length !== config2.length) {
        return false;
    }
    
    const sortedConfig1 = [...config1].sort((a, b) => a.name.localeCompare(b.name));
    const sortedConfig2 = [...config2].sort((a, b) => a.name.localeCompare(b.name));

    return sortedConfig1.every((c1, index) => {
        const c2 = sortedConfig2[index];
        return c1.name === c2.name && c1.value === c2.value && c1.priceAdjustment === c2.priceAdjustment;
    });
};

export const getMyCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (cart) {
        res.status(200).json({ cart });
    } else {

        res.status(200).json({ 
            cart: {
                user: req.user._id,
                items: [],
                totalPrice: 0,
            }
        });
    }
});


export const addToCart = asyncHandler(async (req, res) => {

    const { productId, configuration, quantity } = req.body;
    const userId = req.user._id;

    if (!mongoose.Types.ObjectId.isValid(productId)) {
        res.status(400);
        throw new Error('ID Prodotto non valido.');
    }
    if (!quantity || quantity <= 0) {
        res.status(400);
        throw new Error('La quantità deve essere un numero maggiore di zero.');
    }

    if (!configuration || !Array.isArray(configuration)) {
        res.status(400);
        throw new Error('La configurazione è mancante o non è un array valido. Assicurati che il frontend invii un array di configurazioni.');
    }

    let cart = await Cart.findOne({ user: userId });

    if (!cart) {
        cart = new Cart({ user: userId, items: [], totalPrice: 0 });
    }
    const product = await Product.findById(productId);

    if (!product) {
        res.status(404);
        throw new Error('Prodotto non trovato.');
    }

    let itemPrice = product.basePrice;
    
    configuration.forEach(config => {
        if (config.priceAdjustment && typeof config.priceAdjustment === 'number') {
            itemPrice += config.priceAdjustment;
        }
    });


    const existingItem = cart.items.find(item => 
        item.productId.toString() === productId && 
        areConfigurationsEqual(item.configuration, configuration)
    );

    if (existingItem) {
        
        existingItem.quantity += quantity;
    } else {
        cart.items.push({
            productId: productId,
            name: product.name, 
            imageUrl: product.imageUrl,
            configuration: configuration,
            quantity: quantity,
            itemPrice: itemPrice,
        });
    }

    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);

    const updatedCart = await cart.save();
    
    res.status(201).json({ 
        message: 'Articolo aggiunto al carrello con successo.',
        cart: updatedCart 
    });
});


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
    const itemToUpdate = cart.items.find(item => item._id.toString() === itemId);

    if (!itemToUpdate) {
        res.status(404);
        throw new Error('Articolo non trovato nel carrello.');
    }

    itemToUpdate.quantity = quantity;
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);

    const updatedCart = await cart.save();

    res.status(200).json({ 
        message: 'Quantità articolo aggiornata.', 
        cart: updatedCart 
    });
});

export const removeItemFromCart = asyncHandler(async (req, res) => {
    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        res.status(404);
        throw new Error('Carrello non trovato.');
    }
    const initialLength = cart.items.length;
    cart.items = cart.items.filter(item => item._id.toString() !== req.params.itemId);

    if (cart.items.length === initialLength) {
         res.status(404);
         throw new Error('Articolo non trovato nel carrello.');
    }
    cart.totalPrice = cart.items.reduce((acc, item) => acc + (item.itemPrice * item.quantity), 0);

    const updatedCart = await cart.save();

    res.status(200).json({ 
        message: 'Articolo rimosso dal carrello.', 
        cart: updatedCart 
    });
});
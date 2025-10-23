import Order from '../models/Order.js';
import User from '../models/User.js';   
import Cart from '../models/Cart.js'; 
import asyncHandler from 'express-async-handler';

export const createOrderFromCart = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { paymentMethod, shippingAddress } = req.body; 

    if (!paymentMethod || !shippingAddress) {
        res.status(400);
        throw new Error('Metodo di pagamento e indirizzo di spedizione sono obbligatori.');
    }

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Il carrello è vuoto. Impossibile creare un ordine.');
    }

    const newOrder = new Order({
        user: userId,
        orderItems: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            configuration: item.configuration,
            itemPrice: item.itemPrice,
        })),
        totalAmount: cart.totalPrice,
        shippingAddress: shippingAddress,
        paymentMethod: paymentMethod,
        paymentStatus: 'Paid', 
    });

    const order = await newOrder.save();
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    const user = await User.findById(userId);
    if (user && !user.hasPurchased) {
        user.hasPurchased = true;
        await user.save();
        console.log(`[COMMUNITY] Utente ${userId} abilitato: hasPurchased = true.`);
    }

    res.status(201).json({
        message: 'Ordine creato con successo. Utente abilitato alla community.',
        order: order,
    });
});


export const getMyOrders = asyncHandler(async (req, res) => {
    const orders = await Order.find({ user: req.user._id })
        .sort({ createdAt: -1 });

    res.status(200).json(orders);
});
export const getOrderById = asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id)
        .populate('user', 'firstName lastName email'); 

    if (!order) {
        res.status(404);
        throw new Error('Ordine non trovato.');
    }
    
    if (order.user._id.toString() !== req.user._id.toString()) {
        res.status(403);
        throw new Error('Non autorizzato ad accedere a questo ordine.');
    }

    res.status(200).json(order);
});
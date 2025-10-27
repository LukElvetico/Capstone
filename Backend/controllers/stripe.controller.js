import asyncHandler from 'express-async-handler';
import Cart from '../models/Cart.js'; 
import Order from '../models/Order.js'; 
import User from '../models/User.js'; 
// import Stripe from 'stripe';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY); 

const STRIPE_PUBLISHABLE_KEY = 'test_publishable_key';
const createOrderFromStripeSession = async (cart, userId) => {
    console.log(`Simluazione per ${userId}...`);

    const newOrder = new Order({
        user: userId,
        orderItems: cart.items.map(item => ({
            productId: item.productId,
            quantity: item.quantity,
            // cart item stripe session info
            configuration: item.configuration, 
            itemPrice: item.itemPrice,
        })),
        totalAmount: cart.totalPrice,
        shippingAddress: {
            // Stripesessione data simulated
            name: 'Nome',
            address: 'Indirizzo',
            city: 'Città',
            zip: '12345',
            country: 'IT',
        },
        paymentMethod: 'Stripe',
        paymentStatus: 'Pagato',
        isPaid: true,
        paidAt: new Date(),
    });

    const order = await newOrder.save();
    
    cart.items = [];
    cart.totalPrice = 0;
    await cart.save();

    const user = await User.findById(userId);
    if (user && !user.hasPurchased) {
        user.hasPurchased = true;
        await user.save();
        console.log(`${userId} è abilitato alle recensioni: hasPurchased = true.`);
    }

    console.log(`Ordine ${order._id} creato con successo!`);
    return order;
};


export const createCheckoutSession = asyncHandler(async (req, res) => {
    const userId = req.user._id;
    const { shippingAddressId, paymentMethod } = req.body; 

    const cart = await Cart.findOne({ user: userId });

    if (!cart || cart.items.length === 0) {
        res.status(400);
        throw new Error('Il carrello è vuoto. Impossibile procedere con il checkout.');
    }

    const lineItems = cart.items.map(item => {
        const itemPriceInCents = Math.round(item.itemPrice * 100); 
        return {
            price_data: {
                currency: 'eur',
                product_data: {
                    name: item.name,
                    description: item.configuration.map(c => `${c.name}: ${c.value}`).join(', '),
                },
                unit_amount: itemPriceInCents, 
            },
            quantity: item.quantity,
        };
    });

    //const session = await stripe.checkout.sessions.create({...});
    console.log(`Tentativo di sessione simulata per ${userId}...`);

    const SIMULATED_SESSION_ID = `cs_test_simulazione_${Date.now()}`;
    const FRONTEND_URL = process.env.FRONTEND_URL;
    const SUCCESS_URL = `${FRONTEND_URL}/successo?session_id=${SIMULATED_SESSION_ID}`;
    const CANCEL_URL = `${FRONTEND_URL}/annullato`;

    res.json({ 
        url: SUCCESS_URL,
        sessionId: SIMULATED_SESSION_ID,
        message: 'Reindirizzamento a Stripe simulato con successo.'
    });
});


export const handleWebhook = asyncHandler(async (req, res) => {
   
    const sig = req.headers['stripe-signature'];
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
    let stripeEvent;
    
    try {
         stripeEvent = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err) {
        console.error(`Webhook Signature Verification Failed.`, err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // SIMLUATION
   const event = {
        type: 'checkout.session.completed', // L'evento cruciale
        data: {
            object: {
                id: req.body.session_id || `cs_webhook_simulato_${Date.now()}`,
                metadata: {
                    userId: req.body.userId,
                    cartId: req.body.cartId,
                },
            },
        },
    };

    console.log(`[WEBHOOK RICEVUTO - SIMULATO]: ${event.type}`);

    switch (event.type) {
        case 'checkout.session.completed':
            const userId = event.data.object.metadata.userId;
            const cartId = event.data.object.metadata.cartId;
            const cart = await Cart.findById(cartId); 

            if (cart) {
                await createOrderFromStripeSession(cart, userId);
            } else {
                console.error(`[WEBHOOK ERRORE] Carrello non trovato per ID: ${cartId}`);
            }
            break;
        // payment_failed and payment_intent.succeeded are simulated here
        case 'payment_intent.succeeded':
            console.log('PaymentIntent ha avuto successo (simulato).');
            break;
        default:
            console.log(`Evento non gestito: ${event.type}`);
    }
    res.status(200).json({ received: true });
});

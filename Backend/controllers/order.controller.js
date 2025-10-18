import Order from '../models/Order.js';
import User from '../models/User.js';   
import Cart from '../models/Cart.js'; 

/**
 * @desc Crea un nuovo ordine basato sul contenuto del carrello
 * @route POST /api/orders
 * @access Privata (richiede 'protect')
 */
export const createOrderFromCart = async (req, res) => {
    const userId = req.user._id;
    const { paymentMethod, shippingAddress } = req.body; 

    if (!paymentMethod || !shippingAddress) {
        return res.status(400).json({ message: 'Metodo di pagamento e indirizzo di spedizione sono obbligatori.' });
    }

    try {
        const cart = await Cart.findOne({ user: userId });

        if (!cart || cart.items.length === 0) {
            return res.status(400).json({ message: 'Il carrello è vuoto. Impossibile creare un ordine.' });
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
            paymentStatus: 'Pending',
        });

        const createdOrder = await newOrder.save();

        cart.items = [];
        cart.totalPrice = 0;
        await cart.save();

        res.status(201).json({ 
            message: 'Ordine creato con successo. Procedi al pagamento.',
            order: createdOrder 
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore durante la creazione dell\'ordine.', error: error.message });
    }
};


/**
 * @desc Segna l'ordine come Pagato e abilita l'utente alla community (Logica Cruciale)
 * @route PUT /api/orders/:orderId/pay
 * @access Privata (richiede 'protect')
 */
export const completeCheckout = async (req, res) => {
    const userId = req.user._id;
    const orderId = req.params.orderId;

    try {
        const order = await Order.findByIdAndUpdate(
            orderId, 
            { paymentStatus: 'Paid', paidAt: Date.now() }, 
            { new: true }
        );

        if (!order) {
            return res.status(404).json({ message: 'Ordine non trovato.' });
        }

        if (!req.user.hasPurchased) {
            await User.findByIdAndUpdate(userId, { hasPurchased: true });
        }

        res.status(200).json({
            message: 'Pagamento riuscito. Utente abilitato alla community.',
            order: order,
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore durante il completamento del checkout.', error: error.message });
    }
};

/**
 * @desc Ottiene tutti gli ordini dell'utente loggato
 * @route GET /api/orders/me
 * @access Privata (richiede 'protect')
 */
export const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.status(200).json(orders);
        
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero degli ordini.', error: error.message });
    }
};

/**
 * @desc Ottiene un singolo ordine per ID
 * @route GET /api/orders/:id
 * @access Privata (richiede 'protect')
 */
export const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'firstName lastName email'); 

        if (!order) {
            return res.status(404).json({ message: 'Ordine non trovato.' });
        }
        
        if (order.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Non autorizzato ad accedere a questo ordine.' });
        }
        
        res.status(200).json(order);

    } catch (error) {
        res.status(404).json({ message: 'Ordine non trovato o ID non valido.' });
    }
};
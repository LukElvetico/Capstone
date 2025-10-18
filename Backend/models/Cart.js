import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    // Prodotto base: versione S o versione L
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    configuration: [{
        name: String, // es "RAM"
        value: String, // es "16GB"
        priceAdjustment: Number, 
    }],

    itemPrice: {
        type: Number,
        required: true,
    },
});


const CartSchema = new mongoose.Schema({
    //un utente, un carrello
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, // Ogni utente può avere un solo carrello attivo
    },
    items: [CartItemSchema], // Array degli articoli nel carrello
    totalPrice: {
        type: Number,
        default: 0,
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Cart', CartSchema);
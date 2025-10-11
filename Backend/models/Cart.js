import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    // Riferimento al prodotto base
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
    // Dettagli della configurazione selezionata dall'utente
    configuration: [{
        name: String, // e.g., "RAM"
        value: String, // e.g., "16GB"
        priceAdjustment: Number, // L'aggiustamento di prezzo specifico per questa opzione
    }],
    // Prezzo calcolato per questo singolo articolo (basePrice + adjustments)
    itemPrice: {
        type: Number,
        required: true,
    },
});


const CartSchema = new mongoose.Schema({
    // Riferimento all'utente proprietario del carrello (un utente, un carrello)
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
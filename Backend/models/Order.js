import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: 'Italia' },
});

const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Copia degli articoli al momento dell'acquisto (simile a CartItemSchema)
    orderItems: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true,
        },
        quantity: Number,
        configuration: [
            { name: String, value: String, priceAdjustment: Number }
        ],
        itemPrice: Number,
    }],
    shippingAddress: AddressSchema,
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String, // es. "CreditCard", "PayPal"
        required: true,
    },
    paymentStatus: {
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    isDelivered: {
        type: Boolean,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Order', OrderSchema);
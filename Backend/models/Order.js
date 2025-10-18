import mongoose from 'mongoose';

const AddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    zip: { type: String, required: true },
    country: { type: String, required: true, default: 'Italia' },
}, { _id: false }); 


const OrderItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    quantity: { type: Number, default: 1 },
    configuration: [
        { name: String, value: String, priceAdjustment: Number } 
    ],
    itemPrice: { type: Number, required: true },
}, { _id: false });


const OrderSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderItems: [OrderItemSchema],
    shippingAddress: AddressSchema,
    totalAmount: {
        type: Number,
        required: true,
    },
    paymentMethod: {
        type: String, 
        required: true,
    },
    paymentStatus: { 
        type: String,
        enum: ['Pending', 'Paid', 'Failed'],
        default: 'Pending',
    },
    paidAt: { 
        type: Date,
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
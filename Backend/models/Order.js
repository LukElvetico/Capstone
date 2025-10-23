import mongoose from 'mongoose';

const orderItemSchema = mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Product', 
    },
    quantity: {
        type: Number,
        required: true,
    },
    configuration: {
        type: Object, 
        required: false,
    },
    itemPrice: {
        type: Number,
        required: true,
    },
    productNameSnapshot: {
        type: String,
        required: false,
    }
}, { _id: false });

const orderSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    orderItems: [orderItemSchema], 
    shippingAddress: {
        
        type: Object, 
        required: true,
    },
    paymentMethod: {
        type: String,
        required: true,
    },
    totalAmount: {
        type: Number,
        required: true,
        default: 0.0,
    },
    paymentStatus: {
        type: String,
        required: true,
        default: 'Pending', 
    },
    paidAt: {
        type: Date,
        required: false,
    },
    isDelivered: {
        type: Boolean,
        required: true,
        default: false,
    },
    deliveredAt: {
        type: Date,
    },
}, {
    timestamps: true,
});

const Order = mongoose.model('Order', orderSchema);

export default Order;
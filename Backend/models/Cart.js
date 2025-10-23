import mongoose from 'mongoose';

const CartItemSchema = new mongoose.Schema({
    productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    imageUrl: { 
        type: String,
        required: false,
    },
    quantity: {
        type: Number,
        required: true,
        min: 1,
        default: 1,
    },
    configuration: [{
        name: String, 
        value: String, 
        priceAdjustment: Number, 
    }],

    itemPrice: { 
        type: Number,
        required: true,
    },
});


const CartSchema = new mongoose.Schema({

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true, 
    },
    items: [CartItemSchema], 
    totalPrice: {
        type: Number,
        default: 0,
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Cart', CartSchema);
import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    // Riferimento al prodotto che viene recensito
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
    },
    // Riferimento all'utente che ha lasciato la recensione
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    rating: {
        type: Number,
        required: [true, 'Il rating è obbligatorio'],
        min: 1,
        max: 5,
    },
    text: {
        type: String,
        required: [true, 'Il testo della recensione è obbligatorio'],
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Comment', CommentSchema);
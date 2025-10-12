import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    // Campo che determina a quale modello si riferisce il commento (Product o Post)
    onModel: {
        type: String,
        required: true,
        enum: ['Product', 'Post'] // Limita i valori ammessi
    },
    // Riferimento al documento (Product o Post) che viene recensito/commentato
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        // Usa refPath per rendere dinamico il riferimento a seconda del valore di 'onModel'
        refPath: 'onModel', 
    },
    // Riferimento all'utente che ha lasciato la recensione/commento
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    // Il rating ha senso solo per i prodotti, potresti renderlo opzionale:
    rating: {
        type: Number,
        // rimosso `required: [true, 'Il rating è obbligatorio']`
        min: 1,
        max: 5,
    },
    text: {
        type: String,
        required: [true, 'Il testo è obbligatorio'],
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Comment', CommentSchema);
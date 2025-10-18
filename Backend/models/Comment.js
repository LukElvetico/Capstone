import mongoose from 'mongoose';

const CommentSchema = new mongoose.Schema({
    parent: {
        type: mongoose.Schema.Types.ObjectId,
        required: [true, 'Il commento deve essere associato a un Post o un Prodotto.'],
        refPath: 'onModel',
    },

    onModel: {
        type: String,
        required: true,
        enum: {
            values: ['Post', 'Product'],
            message: 'Il riferimento del commento non è valido (deve essere Post o Product).'
        }
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    text: {
        type: String,
        required: [true, 'Il ommento non può essere vuoto.'],
        trim: true,
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
    }
}, { 
    timestamps: true 
});

export default mongoose.model('Comment', CommentSchema);
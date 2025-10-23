import mongoose from 'mongoose';

const PostSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Il titolo è obbligatorio'],
        trim: true,
    },
    content: {
        type: String,
        required: [true, 'Il contenuto è obbligatorio'],
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Post', PostSchema);
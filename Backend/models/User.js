import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // Usiamo l'email come identificativo univoco (username implicito)
    email: {
        type: String,
        required: [true, 'L\'email è obbligatoria'],
        unique: true,
        trim: true,
        lowercase: true,
    },
    firstName: {
        type: String,
        required: [true, 'Il nome è obbligatorio'],
        trim: true,
    },
    lastName: {
        type: String,
        required: [true, 'Il cognome è obbligatorio'],
        trim: true,
    },
    password: {
        type: String,
        required: [true, 'La password è obbligatoria'],
        minlength: [6, 'La password deve avere almeno 6 caratteri'],
    },
    // Campo amministrativo
    isAdmin: {
        type: Boolean,
        default: false,
    },
}, { 
    timestamps: true 
});

// Nota: La logica di hashing della password (bcrypt) sarà aggiunta come pre-save middleware qui.

export default mongoose.model('User', UserSchema);
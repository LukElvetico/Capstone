import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({

    email: {
        type: String,
        required: [true, "L'email è obbligatoria"],
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
    // Campo amministrativo > ADMIN = 1 splo per caricare/gestire prodotti
    isAdmin: {
        type: Boolean,
        default: false,
    },
//se un acquisto = recensione
    hasPurchased: {
        type: Boolean,
        default: false,
    },
}, { 
    timestamps: true 
});


export default mongoose.model('User', UserSchema);
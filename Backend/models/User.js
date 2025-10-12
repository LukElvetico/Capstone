import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // Usiamo l'email come identificativo univoco (username implicito)
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
    // Campo amministrativo > ADMIN = 1 SOLO PER caricare/gestire prodotti
    isAdmin: {
        type: Boolean,
        default: false,
    },
    //tracciare se l'utente ha effettuato almeno un acquisto = può fare post/recensioni
    hasPurchased: {
        type: Boolean,
        default: false, // Inizialmente l'utente non ha effettuato acquisti
    },
}, { 
    timestamps: true 
});


export default mongoose.model('User', UserSchema);
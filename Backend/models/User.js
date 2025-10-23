import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

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
    isAdmin: {
        type: Boolean,
        default: false,
    },
    hasPurchased: {
        type: Boolean,
        default: false,
    },
}, { 
    timestamps: true 
});

UserSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};
UserSchema.pre('save', async function (next) {
    next();
});

export default mongoose.model('User', UserSchema);
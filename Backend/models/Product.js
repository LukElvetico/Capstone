import mongoose from 'mongoose';

const OptionSchema = new mongoose.Schema({
    optionName: { type: String, required: true }, 
    optionId: { type: String, required: true, unique: true }, 
    priceAdjustment: { type: Number, default: 0 },
    description: { type: String },
});

const OptionGroupSchema = new mongoose.Schema({
    groupName: { type: String, required: true }, 
    options: [OptionSchema],
    minSelection: { type: Number, default: 1 },
    maxSelection: { type: Number, default: 1 },
});

const CompatibilityRuleSchema = new mongoose.Schema({
    ruleName: { type: String, required: true },
    sourceOptionId: { type: String, required: true },
    excludedOptionId: { type: String, required: true }, 
    message: { type: String },
});


const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Il nome del prodotto è obbligatorio'],
        trim: true,
        unique: true,
    },
    basePrice: {
        type: Number,
        required: [true, 'Il prezzo base è obbligatorio'],
        min: 0,
    },
    description: {
        type: String,
        required: [true, 'La descrizione è obbligatoria'],
    },
    category: {
        type: String,
        required: true,
    },
    imageUrl: {
        type: String,
        default: 'https://via.placeholder.com/300x200?text=Prodotto',
    },
    optionGroups: [OptionGroupSchema],
    compatibilityRules: [CompatibilityRuleSchema],

}, {
    timestamps: true
});

export default mongoose.model('Product', ProductSchema);
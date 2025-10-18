import mongoose from 'mongoose';

const ChoiceSchema = new mongoose.Schema({
    value: { 
        type: String,
        required: true,
    },
    priceAdjustment: {
        type: Number,
        default: 0,
    },
    // Nome dell'opzione che questo elemento sblocca/blocca rispetto alle regole di compatibilità. S non può avere XXX di Ram e archivazione e L ha minimo XXX di Ram ma può scegliere archivazione
    relatedOptionId: { 
        type: String, 
    }
}, { _id: false }); // 

const OptionGroupSchema = new mongoose.Schema({
    name: { //che sono "Modello", "RAM", "Archiviazione", "Colore"
        type: String,
        required: true,
    },

    isDependent: { 
        type: Boolean,
        default: false,
    },

    choices: [ChoiceSchema],
}, { _id: false });

const ProductSchema = new mongoose.Schema({
    name: { // nome del prodotto ovvero telefono model S o telefono model L
        type: String,
        required: [true, 'Il nome del prodotto è obbligatorio'],
        trim: true,
        unique: true,
    },
    basePrice: {
        type: Number,
        required: [true, 'Il prezzo base è obbligatorio'],
    },
    description: {
        type: String,
    },
    category: {
        type: String,
        required: true,
    },

    imageUrl: {
        type: String,
        required: [true, 'L\'immagine del prodotto è obbligatoria'],
    },
    
    optionGroups: [OptionGroupSchema], 
    
    compatibilityRules: {
        type: [String], 
        default: [],
    },


    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
    numReviews: {
        type: Number,
        default: 0,
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Product', ProductSchema);
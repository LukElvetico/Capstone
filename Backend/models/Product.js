import mongoose from 'mongoose';

// --- SUB-SCHEMA 1: Definizione della singola scelta con il suo costo ---
const ChoiceSchema = new mongoose.Schema({
    value: { // Es: "S", "L", "8GB", "Rosso"
        type: String,
        required: true,
    },
    priceAdjustment: { // Differenza di prezzo rispetto al basePrice (es: 100 per l'upgrade a L)
        type: Number,
        default: 0,
    },
    // Campo usato per la logica di interconnessione (vedi sotto)
    // Non strettamente necessario in Mongoose, ma utile per il Frontend/Backend
    relatedOptionId: {
        type: String, // ID o nome dell'opzione che questo elemento sblocca/blocca
    }
}, { _id: false });

// --- SUB-SCHEMA 2: Definizione di un Gruppo di Opzioni (es. "RAM", "Colore") ---
const OptionGroupSchema = new mongoose.Schema({
    name: { // Es: "Modello", "RAM", "Archiviazione", "Colore"
        type: String,
        required: true,
    },
    isDependent: { // Indica se questo gruppo dipende dalla selezione di un altro (es. RAM dipende da Modello)
        type: Boolean,
        default: false,
    },
    choices: [ChoiceSchema],
}, { _id: false });


// --- SCHEMA PRINCIPALE: ProductSchema ---
const ProductSchema = new mongoose.Schema({
    name: { // Es: "Cellphone", "Hyperwatch", "Doc"
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
    // Array di tutti i gruppi di opzioni configurabili
    optionGroups: [OptionGroupSchema], 
    
    // Logica di Interconnessione (Cruciale per i tuoi requisiti)
    // Definizione le regole di esclusione/inclusione a livello di prodotto.
    // Es: "Se model:S, = ram:16GB è escluso"
    compatibilityRules: {
        type: [String], // Array di stringhe che codificano le regole
        default: [],
    },

    // Campi per Recensioni
    averageRating: {
        type: Number,
        default: 0,
        min: 0,
        max: 5,
    },
}, { 
    timestamps: true 
});

export default mongoose.model('Product', ProductSchema);
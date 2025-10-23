import Product from '../models/Product.js';
import asyncHandler from 'express-async-handler';
import mongoose from 'mongoose'; 

const normalizeForId = (str) => {
    return (str || '').toString().replace(/\s/g, '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
};

const processOptionGroups = (optionGroups) => {
    return optionGroups.map(group => {
        const normalizedGroupName = normalizeForId(group.groupName || group.name);
        
        const processedOptions = group.options.map(option => {
            const normalizedOptionName = normalizeForId(option.name);
            const generatedOptionId = `${normalizedGroupName}:${normalizedOptionName}`;

            return {
                ...option,
                optionName: option.name, 
                optionId: generatedOptionId, 
            };
        });

        return {
            ...group,
            options: processedOptions,
            groupName: group.groupName || group.name, 
        };
    });
};


export const createProduct = asyncHandler(async (req, res) => {
    const { name, basePrice, description, category, imageUrl, optionGroups, compatibilityRules } = req.body;

    const processedOptionGroups = processOptionGroups(optionGroups);

    try {
        const product = new Product({
            name,
            basePrice,
            description,
            category,
            imageUrl: req.body.imageUrl || imageUrl, 
            optionGroups: processedOptionGroups,
            compatibilityRules,

        });

        const createdProduct = await product.save();
        res.status(201).json(createdProduct);

    } catch (error) {
        if (error.code === 11000) {
            const field = Object.keys(error.keyValue)[0];
            res.status(400); 
            throw new Error(`Valore duplicato per il campo: '${field}'. Assicurati che il nome del prodotto e gli ID delle opzioni siano univoci.`);
        } 
        
        if (error instanceof mongoose.Error.ValidationError) {
            const messages = Object.values(error.errors).map(val => val.message);
            res.status(400);
            throw new Error(`Errore di validazione: ${messages.join(', ')}`);
        } 
        res.status(500);
        throw new Error(`Errore generico durante il salvataggio del prodotto: ${error.message}`);
    }
});

export const getProducts = asyncHandler(async (req, res) => {
    const products = await Product.find({});
    res.json(products);
});

export const getProductById = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        res.json(product);
    } else {
        res.status(404);
        throw new Error('Prodotto non trovato');
    }
});

export const updateProduct = asyncHandler(async (req, res) => {
    const { 
        name, 
        basePrice, 
        description, 
        category, 
        imageUrl, 
        optionGroups, 
        compatibilityRules 
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
        let processedOptionGroups = optionGroups;
        
        if (optionGroups) {
            processedOptionGroups = processOptionGroups(optionGroups);
        }

        product.name = name || product.name;
        product.basePrice = basePrice !== undefined ? basePrice : product.basePrice;
        product.description = description || product.description;
        product.category = category || product.category;
        
        if (req.body.imageUrl) {
             product.imageUrl = req.body.imageUrl; 
        } else if (imageUrl !== undefined) {
             product.imageUrl = imageUrl;
        }

        product.optionGroups = processedOptionGroups || product.optionGroups;
        product.compatibilityRules = compatibilityRules || product.compatibilityRules;

        const updatedProduct = await product.save();
        res.json(updatedProduct);

    } else {
        res.status(404);
        throw new Error('Prodotto non trovato.');
    }
});

export const deleteProduct = asyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
        await Product.deleteOne({ _id: product._id }); 
        res.json({ message: 'Prodotto rimosso con successo.' });
    } else {
        res.status(404);
        throw new Error('Prodotto non trovato.');
    }
});

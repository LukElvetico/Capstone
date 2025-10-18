import Product from '../models/Product.js';

/**
 * @desc Crea un nuovo prodotto (Admin)
 * @route POST /api/products
 * @access Privata/Admin (richiede protect, admin)
 */
export const createProduct = async (req, res) => {
    // req.body.imageUrl fornito dal middleware 'uploadToCloudinary' > verifica/sistemare 
    const { name, basePrice, description, category, imageUrl, optionGroups, compatibilityRules } = req.body;

    try {
        const product = await Product.create({
            name,
            basePrice,
            description,
            category,
            imageUrl, // url cloudinary
            optionGroups,
            compatibilityRules,
        });

        res.status(201).json({ 
            message: 'Prodotto creato con successo', 
            product 
        });
    } catch (error) {
        res.status(400).json({ 
            message: 'Errore nella creazione del prodotto.', 
            error: error.message 
        });
    }
};

/**
 * @desc Aggiorna un prodotto esistente (Admin)
 * @route PUT /api/products/:id
 * @access Privata/Admin
 */
export const updateProduct = async (req, res) => {
    const { name, basePrice, description, category, imageUrl, optionGroups, compatibilityRules } = req.body;

    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato.' });
        }

        product.name = name || product.name;
        product.basePrice = basePrice || product.basePrice;
        product.description = description || product.description;
        product.category = category || product.category;
        product.imageUrl = imageUrl || product.imageUrl;
        product.optionGroups = optionGroups || product.optionGroups;
        product.compatibilityRules = compatibilityRules || product.compatibilityRules;

        const updatedProduct = await product.save();
        res.status(200).json({ 
            message: 'Prodotto aggiornato con successo', 
            product: updatedProduct 
        });
        
    } catch (error) {
        res.status(400).json({ 
            message: 'Errore nell\'aggiornamento del prodotto.', 
            error: error.message 
        });
    }
};

/**
 * @desc Elimina un prodotto (Admin)
 * @route DELETE /api/products/:id
 * @access Privata/Admin
 */
export const deleteProduct = async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);

        if (!result) {
            return res.status(404).json({ message: 'Prodotto non trovato.' });
        }
        
        res.status(200).json({ message: 'Prodotto eliminato con successo.' });
    } catch (error) {
        res.status(500).json({ message: 'Errore nell\'eliminazione del prodotto.', error: error.message });
    }
};

/**
 * @desc Ottiene tutti i prodotti
 * @route GET /api/products
 * @access Pubblica
 */
export const listAllProducts = async (req, res) => {
    try {
        // filtri e paginazione? Da inserire qui in caso
        const products = await Product.find({});
        res.status(200).json(products);
    } catch (error) {
        res.status(500).json({ message: 'Errore nel recupero dei prodotti.', error: error.message });
    }
};

/**
 * @desc Ottiene i dettagli di un singolo prodotto
 * @route GET /api/products/:id
 * @access Pubblica
 */
export const getProductDetails = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({ message: 'Prodotto non trovato.' });
        }
        res.status(200).json(product);
    } catch (error) {
        res.status(404).json({ message: 'Prodotto non trovato o ID non valido.' });
    }
};

/**
 * @desc Esegue la configurazione di un prodotto e calcola il prezzo finale.
 * @route POST /api/configurator
 * @access Pubblica
 */
export const configureProduct = async (req, res) => {
    const { productId, selectedOptions } = req.body; 

    if (!productId || !selectedOptions) {
        return res.status(400).json({ message: 'Prodotto e opzioni di configurazione sono obbligatorie.' });
    }

    try {
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({ message: 'Prodotto base non trovato.' });
        }

        let finalPrice = product.basePrice;
        let selectedConfiguration = [];

        
        selectedOptions.forEach(selection => {
            const group = product.optionGroups.find(g => g.name === selection.name);
            if (group) {
                const choice = group.choices.find(c => c.value === selection.value);
                if (choice) {
                    finalPrice += choice.priceAdjustment;
                    selectedConfiguration.push({
                        name: selection.name,
                        value: selection.value,
                        priceAdjustment: choice.priceAdjustment,
                    });
                }
            }
        });
        
        res.status(200).json({
            message: 'Configurazione completata.',
            productId: product._id,
            productName: product.name,
            finalPrice: parseFloat(finalPrice.toFixed(2)),
            configuration: selectedConfiguration,
        });

    } catch (error) {
        res.status(500).json({ message: 'Errore nella configurazione del prodotto.', error: error.message });
    }
};
import Comment from '../models/Comment.js';
import Post from '../models/Post.js';      // verifica
import Product from '../models/Product.js'; // verifica

/**
 * @desc Nuova recensione su  risorsa (Post che è prodotto)
 * @route POST /api/posts/:postId/comments oppure produt al posto di post, da capire come gestire
 * @access Privata = protect, checkPurchase
 */
export const createComment = async (req, res) => {
    let parentId;
    let onModel;

    if (req.params.postId) {
        parentId = req.params.postId;
        onModel = 'Post';
    } else if (req.params.productId) {
        parentId = req.params.productId;
        onModel = 'Product';
    } else {
        return res.status(400).json({ message: 'ID della risorsa genitore mancante.' });
    }
    
    const { text, rating } = req.body;
    const user = req.user._id;

    if (!text) {
        return res.status(400).json({ message: 'Il testo del commento è obbligatorio.' });
    }
    
    try {

        let parentResource;
        if (onModel === 'Post') {
            parentResource = await Post.findById(parentId);
        } else if (onModel === 'Product') {
            parentResource = await Product.findById(parentId);
            
            if (!rating && onModel === 'Product') {
                return res.status(400).json({ message: 'Le recensioni sui prodotti richiedono un voto (rating).' });
            }
        }
        
        if (!parentResource) {
            return res.status(404).json({ message: `${onModel} non trovato.` });
        }

        const newComment = await Comment.create({
            user,
            text,
           // rating: onModel === 'Product' ? rating : undefined, 
            parent: parentId,
            onModel,
        });


        res.status(201).json({
            message: `${onModel === 'Product' ? 'Recensione' : 'Commento'} creato con successo.`,
            comment: newComment,
        });

    } catch (error) {
        res.status(500).json({ 
            message: 'Errore durante la creazione del commento.', 
            error: error.message 
        });
    }
};

/**
 * @desc Ottiene le recensioni/post
 * @route GET /api/posts/:postId/comments o product > capire
 * @access Pubblica
 */
export const getCommentsByParent = async (req, res) => {
    let parentId;
    let onModel;

    if (req.params.postId) {
        parentId = req.params.postId;
        onModel = 'Post';
    } else if (req.params.productId) {
        parentId = req.params.productId;
        onModel = 'Product';
    } else {
        return res.status(400).json({ message: 'ID della risorsa genitore mancante.' });
    }

    try {

        const comments = await Comment.find({
            parent: parentId,
            onModel: onModel,
        })
        .populate('user', 'firstName lastName')
        .sort({ createdAt: 1 });
        res.status(200).json(comments);

    } catch (error) {
        res.status(500).json({ message: 'Errore durante il recupero dei commenti.', error: error.message });
    }
};
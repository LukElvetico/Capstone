import Post from '../models/Post.js';
import User from '../models/User.js'; // serve? > verifica
/**
 * @desc Crea un nuovo post
 * @route POST /api/posts
 * @access Privata (Richiede: protect, checkPurchase)
 */
export const createPost = async (req, res) => {
    
    const { title, content } = req.body;

    const author = req.user._id; 

    try {
        const newPost = await Post.create({
            title,
            content,
            author,
        });

        res.status(201).json({
            message: 'Post creato con successo.',
            post: newPost
        });

    } catch (error) {
        res.status(400).json({ 
            message: 'Errore durante la creazione del post.', 
            error: error.message 
        });
    }
};


/**
 * @desc Ottiene tutti i post della community (pubblico)
 * @route GET /api/posts
 * @access Pubblica
 */
export const getPosts = async (req, res) => {
    try {
        const posts = await Post.find({})
            .populate('author', 'firstName lastName email') 
            .sort({ createdAt: -1 }); 
        
        res.status(200).json(posts);
        
    } catch (error) {
        res.status(500).json({ message: 'Errore durante il recupero dei post.', error: error.message });
    }
};


/**
 * @desc Ottiene un singolo post per ID (pubblico)
 * @route GET /api/posts/:id
 * @access Pubblica
 */
export const getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'firstName lastName email');

        if (!post) {
            return res.status(404).json({ message: 'Post non trovato.' });
        }

        res.status(200).json(post);

    } catch (error) {
        res.status(404).json({ message: 'Post non trovato o ID non valido.', error: error.message });
    }
};
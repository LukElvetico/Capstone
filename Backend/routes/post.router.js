import express from 'express';
import { protect } from '../middleware/auth.middleware.js'; // da finire incompleto check dopo
import { createPost, getPosts, getPostById } from '../controllers/post.controller.js'; // Controller da creare
// Importare controller dei commenti, necessario per le rotte nidificate DA FARE FINIRE
// import { createComment, getCommentsByPost } from '../controllers/comment.controller.js'; 

const router = express.Router();

//Rotte principali per il Post

// Rotta per creare un post (richiede autenticazione e la verifica di "hasPurchased") > La logica 'hasPurchased' deve risiedere nel controller 'createPost'.
router.route('/').post(protect, createPost);

// Rotte pubbliche per visualizzare i post
router.route('/').get(getPosts);
router.route('/:id').get(getPostById);

//rotte commenti

// Rotta per creare un nuovo commento su un Post.
// Metodo HTTP: POST | Endpoint: /api/posts/:postId/comments
// Richiede l'autenticazione. Il controller dovrà usare 'onModel: "Post"'.
router.post('/:postId/comments', protect, (req, res) => {
    // protect, createComment(req, res);
    res.send({ message: `Placeholder per Creare Commento sul Post ID: ${req.params.postId}` });
});

// Rotta per ottenere tutti i commenti di un Post specifico.
// Metodo HTTP: GET | Endpoint: /api/posts/:postId/comments
router.get('/:postId/comments', (req, res) => {
    // getCommentsByPost(req, res);
    res.send({ message: `Placeholder per Lista Commenti del Post ID: ${req.params.postId}` });
});


export default router;
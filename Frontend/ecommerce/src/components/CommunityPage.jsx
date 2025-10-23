import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, ListGroup, Stack } from 'react-bootstrap';
import { formatDistanceToNow, isValid } from 'date-fns'; 
import { it } from 'date-fns/locale';
import { useAuth } from '../AuthContext.jsx'; 
import axios from 'axios';

const POSTS_API_URL = '/posts'; 

const StarRatingDisplay = ({ rating, size = 18 }) => {
    const stars = [];
    // Numero intero di stelle piene
    const fullStars = Math.floor(rating);

    for (let i = 0; i < 5; i++) {
        const starClass = i < fullStars ? 'bi-star-fill text-warning' : 'bi-star text-warning opacity-50';
        stars.push(<i key={i} className={`bi ${starClass}`} style={{ fontSize: size }} />);
    }

    return <div className="d-flex gap-1">{stars}</div>;
};

const StarRatingInput = ({ value, onChange, size = 25 }) => {
    const [hover, setHover] = useState(0);

    const handleClick = (index) => {
        onChange(index + 1);
    };

    return (
        <div className="d-flex gap-1" onMouseLeave={() => setHover(0)}>
            {[...Array(5)].map((_, index) => {
                const ratingValue = index + 1;
                const starClass = ratingValue <= (hover || value) 
                    ? 'bi-star-fill text-warning' 
                    : 'bi-star text-warning opacity-50';
                
                return (
                    <i 
                        key={index} 
                        className={`bi ${starClass} cursor-pointer`}
                        style={{ fontSize: size, cursor: 'pointer' }}
                        onClick={() => handleClick(index)}
                        onMouseEnter={() => setHover(ratingValue)}
                    />
                );
            })}
        </div>
    );
};

const PostForm = ({ onPostSubmitted }) => {
    const { user, loading: authLoading } = useAuth();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [rating, setRating] = useState(5); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const canPost = user && user.hasPurchased;

    if (authLoading) return <Spinner animation="border" size="sm" />;
    
    if (!user) {
        return (
            <Alert variant="info" className="text-center">
                <i className="bi bi-box-arrow-in-right me-2"></i>
                Effettua il **login** per visualizzare e contribuire alla Community.
            </Alert>
        );
    }

    if (!canPost) {
        return (
            <Alert variant="warning" className="text-center">
                <i className="bi bi-cart-check me-2"></i>
                Per poter lasciare una recensione, devi aver effettuato almeno un acquisto sul nostro sito.
            </Alert>
        );
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(false);
        setLoading(true);

        if (title.length < 5 || content.length < 10) {
            setError('Inserisci un titolo (min. 5 caratteri) e un contenuto (min. 10 caratteri).');
            setLoading(false);
            return;
        }

        try {
            const token = user.token; 
            if (!token) {
                 setError('Token di autenticazione non trovato. Riprova il login.');
                 setLoading(false);
                 return;
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            };

            const postData = { title, content, rating };
            await axios.post(POSTS_API_URL, postData, config);

            setTitle('');
            setContent('');
            setRating(5);
            setSuccess(true);
            onPostSubmitted(); 

        } catch (err) {
            const message = err.response?.data?.message || 'Errore durante l\'invio del post. Riprova più tardi.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="shadow-lg border-0 mb-4 p-4">
            <Card.Title className="fw-bold text-primary">Lascia la tua Recensione</Card.Title>
            {error && <Alert variant="danger" onClose={() => setError(null)} dismissible>{error}</Alert>}
            {success && <Alert variant="success" onClose={() => setSuccess(false)} dismissible>Post inviato con successo! Aggiornamento in corso...</Alert>}
            
            <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Titolo della Recensione</Form.Label>
                    <Form.Control 
                        type="text" 
                        value={title} 
                        onChange={(e) => setTitle(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </Form.Group>
                
                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">Il tuo Feedback</Form.Label>
                    <Form.Control 
                        as="textarea" 
                        rows={3} 
                        value={content} 
                        onChange={(e) => setContent(e.target.value)} 
                        required 
                        disabled={loading}
                    />
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label className="fw-bold d-block"></Form.Label>
                    <StarRatingInput 
                        value={rating} 
                        onChange={setRating} 
                        size={25}
                    />
                </Form.Group>

                <Button variant="primary" type="submit" disabled={loading} className="w-100 mt-3">
                    {loading ? <Spinner animation="border" size="sm" /> : 'Invia Recensione'}
                </Button>
            </Form>
        </Card>
    );
};

const PostItem = ({ post }) => {
    const dateToFormat = post.createdAt ? new Date(post.createdAt) : null;
    const timeAgo = dateToFormat && isValid(dateToFormat)
        ? formatDistanceToNow(dateToFormat, { addSuffix: true, locale: it })
        : 'Data non disponibile'; 

    return (
        <ListGroup.Item className="d-flex flex-column">
            <Stack direction="horizontal" className="align-items-start mb-2">
                <div className="me-3 text-center">
                    <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center" style={{ width: '40px', height: '40px', fontSize: '1.2rem' }}>
                        <i className="bi bi-person-fill"></i>
                    </div>
                </div>
                <div className="flex-grow-1">
                    <h5 className="mb-1 text-primary">{post.title}</h5>
                    <div className="d-flex align-items-center mb-1">
                        <StarRatingDisplay rating={post.rating || 0} size={18} />
                        <small className="text-muted ms-2">di **{post.author?.firstName || 'Anonimo'}**</small>
                    </div>
                </div>
                <small className="text-muted text-end" style={{ minWidth: '100px' }}>{timeAgo}</small>
            </Stack>
            <p className="text-dark-emphasis mb-0 ps-5" style={{ whiteSpace: 'pre-wrap' }}>
                {post.content}
            </p>
        </ListGroup.Item>
    );
};

const CommunityPage = () => {
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchPosts = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(POSTS_API_URL);
            const sortedPosts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            setPosts(sortedPosts);
        } catch (err) {
            const message = err.response?.data?.message || 'Impossibile caricare i post della community.';
            setError(message);
        } finally {
            setLoading(false);
        }
    };
    useEffect(() => {
        fetchPosts();
    }, []);
    const handlePostSubmitted = () => {
        fetchPosts(); 
    };

    return (
        <Container className="my-5">
            <Row className="justify-content-center">
                <Col lg={10}>
                    <h1 className="text-center fw-bolder text-dark mb-4">Community & Recensioni </h1>
                </Col>
            </Row>
            <Row>
                <Col lg={4} className="mb-4 mb-lg-0">
                    <PostForm onPostSubmitted={handlePostSubmitted} />
                </Col>
                <Col lg={8}>
                    {loading ? (
                        <Card className="shadow-sm p-5 border-0 text-center">
                            <Spinner animation="border" variant="info" />
                            <p className="mt-2 text-muted">Caricamento post...</p>
                        </Card>
                    ) : error ? (
                        <Alert variant="danger">{error}</Alert>
                    ) : (
                        <Card className="shadow-sm border-0">
                            <Card.Header className="bg-light fw-bold text-dark">
                                Ultimi Post e Recensioni ({posts.length})
                            </Card.Header>
                            <ListGroup variant="flush">
                                {posts.length > 0 ? (
                                    posts.map(post => <PostItem key={post._id} post={post} />)
                                ) : (
                                    <ListGroup.Item className="text-center text-muted py-4">
                                        Nessun post trovato. Sii il primo a lasciare una recensione!
                                    </ListGroup.Item>
                                )}
                            </ListGroup>
                        </Card>
                    )}
                </Col>
            </Row>
        </Container>
    );
};

export default CommunityPage;
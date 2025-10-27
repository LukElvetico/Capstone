import React, { useState, useEffect } from 'react';
import { Container, Card, Carousel, Spinner, Alert, Button, Row, Col } from 'react-bootstrap'; 
import { Link } from 'react-router-dom';
import axios from 'axios'; 
import { formatDistanceToNow, isValid } from 'date-fns'; 
import { it } from 'date-fns/locale';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5173/api';
const PRODUCTS_API_URL = `${BASE_URL}/products`;
const POSTS_API_URL = `${BASE_URL}/posts`;
const CarouselImage = ({ src, altText }) => (
    <div className="carousel-image-container d-flex justify-content-center align-items-center" style={{ height: '500px', overflow: 'hidden' }}>
        <img
            className="d-block w-100" 
            src={src}
            alt={altText}
            style={{ maxHeight: '100%', objectFit: 'cover' }} 
        />
    </div>
);
const customIndicatorStyle = `
.carousel-indicators [data-bs-target] {
    width: 15px !important;
    height: 15px !important;
    border-radius: 50% !important; 
    margin: 0 5px !important;
    background-color: #007bff;
    opacity: 0.3;
    transition: opacity 0.3s;
}

.carousel-indicators .active {
    opacity: 1;
    background-color: #17a2b8 !important;
}

@media (max-width: 767.98px) {
    .carousel-control-prev, .carousel-control-next {
        display: none;
    }
}
`;
const ProductCarouselSection = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get(PRODUCTS_API_URL);
                const featuredProducts = response.data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 3);
                
                setProducts(featuredProducts);
                setLoading(false);
            } catch (err) {
                console.error("Errore nel recupero dei prodotti:", err);
                setError("Non è stato possibile caricare i prodotti in vetrina. Riprova più tardi.");
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Card className="mt-5 p-5 border-0 bg-light text-center shadow-sm">
                <Spinner animation="border" variant="primary" />
                <p className="mt-3">Caricamento prodotti...</p>
            </Card>
        );
    }

    if (error) {
        return (
            <Alert variant="danger" className="mt-5">
                {error}
            </Alert>
        );
    }
    
    if (products.length === 0) {
        return (
            <Card className="mt-5 p-5 border-0 bg-light text-center shadow-sm">
                <h3 className="text-secondary">Nessun Prodotto in Vetrina</h3>
                <p>Torna più tardi per scoprire le nostre offerte!</p>
                <Link to="/shop" className="btn btn-primary mt-3">Vai allo Shop</Link>
            </Card>
        );
    }
    return (
        <>
            <style>{customIndicatorStyle}</style>

            <Card className="mt-5 p-0 border-0 text-white shadow-lg">
                <Carousel 
                    controls={true}
                    indicators={true} 
                    interval={5000} 
                    className="custom-carousel-indicators"
                >
                    {products.map((product, index) => (
                        <Carousel.Item key={product._id} className="text-center">
                            
                            <CarouselImage 
                            src={product.imageUrl} 
                                altText={product.name} 
                            />
                            <Row className="justify-content-center align-items-start position-absolute top-0 bottom-0 start-0 end-0 p-3 p-md-5">
                                <Col 
                                    xs={12} 
                                    md={{ span: 4, offset: 7 }} 
                                    className="text-start bg-dark bg-opacity-50 p-4 rounded shadow-lg h-100 d-flex flex-column"
                                >
                                    <div className="text-center text-md-start flex-grow-1">
                                        <h2 className="display-5 fw-bold text-warning">{product.name}</h2>
                                        
                                        <p className="text-white-50 mt-2 mb-3">
                                            {product.description.substring(0, 100)}...
                                        </p>
                                        
                                    </div>
                                    <Button 
                                        as={Link} 
                                        to={`/shop/${product._id}`} 
                                        variant="warning" 
                                        size="lg"
                                        className="mt-3 fw-bold w-100 mt-auto" 
                                    >
                                        Configura Ora <br/> <span className="fs-6 fst-italic">a partire da</span> (€{product.basePrice.toFixed(2)})
                                    </Button>
                                    
                                </Col>
                            </Row>
                            
                        </Carousel.Item>
                    ))}
                </Carousel>
            </Card>
        </>
    );
};

const RandomPostSection = () => {
    const [post, setPost] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchRandomPost = async () => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.get(POSTS_API_URL); 
            const posts = response.data;

            if (posts.length > 0) {
                const randomIndex = Math.floor(Math.random() * posts.length);
                setPost(posts[randomIndex]);
            } else {
                setPost(null);
            }
            setLoading(false);
        } catch (err) {
            console.error("Errore nel recupero del post:", err);
            setError("Non è stato possibile caricare i post della community.");
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRandomPost();
    }, []);
    if (loading) {
        return (
            <Card className="mt-5 p-4 border-0 bg-light text-center shadow-sm">
                <Spinner animation="grow" variant="info" />
                <p className="mt-2 text-muted">Caricamento recensioni dalla Community...</p>
            </Card>
        );
    }

    if (error) {
        return <Alert variant="danger" className="mt-5 text-center">{error}</Alert>;
    }

    if (!post) {
        return (
            <Card className="mt-5 p-5 border-0 bg-light text-center shadow-sm">
                <h3 className="text-secondary">Ancora nessuna recensione.</h3>
                <p>Sii il primo a condividere la tua esperienza!</p>
                <Link to="/community" className="btn btn-outline-info mt-3">Visita la Community</Link>
            </Card>
        );
    }
    
    // Visualizzazione del Post Casuale
    const postDate = isValid(new Date(post.createdAt)) ? 
        formatDistanceToNow(new Date(post.createdAt), { addSuffix: true, locale: it }) : 
        'Data non disponibile';

    return (
        <section className="mt-5 pt-5 border-top">
            <h2 className="display-6 fw-bold text-center text-info mb-4">La Nostra Community Dice...</h2>
            <Card className="shadow-lg border-info mb-5">
                <Card.Body>
                    <div className="d-flex justify-content-between align-items-start mb-2">
                        <Card.Title className="h4 text-primary">{post.title}</Card.Title>
                        <Button 
                            variant="outline-info" 
                            size="sm" 
                            onClick={fetchRandomPost} 
                            title="Mostra un'altra recensione"
                        >
                            <i className="bi bi-arrow-repeat"></i> Altro Post
                        </Button>
                    </div>
                    <Card.Text className="text-muted fst-italic mb-3">
                        "{post.content.substring(0, 300)}
                        {post.content.length > 300 ? '...' : ''}"
                    </Card.Text>
                    <div className="d-flex justify-content-between align-items-center small border-top pt-2">
                        <p className="m-0 text-secondary">
                            — **{post.author.firstName} {post.author.lastName}**
                        </p>
                        <p className="m-0 text-secondary" title={new Date(post.createdAt).toLocaleDateString()}>
                            Pubblicato {postDate}
                        </p>
                        <Link to={`/community/${post._id}`} className="btn btn-link btn-sm p-0">
                             <i className="bi bi-arrow-right-circle-fill ms-1"></i>
                        </Link>
                    </div>
                </Card.Body>
            </Card>
        </section>
    );
};


const CallToActionSection = () => (
    <section className="text-center mt-5 pt-5 border-top">
        <h2 className="display-6 fw-bold text-secondary">Inizia Subito</h2>
        <p className="lead mt-3">Sia che tu voglia acquistare o condividere la tua esperienza, siamo qui per te.</p>
        <Link to="/shop" className="btn btn-lg btn-primary shadow-lg me-3">
            <i className="bi bi-cart-fill me-2"></i>
            Inizia lo Shopping
        </Link>
        <Link to="/community" className="btn btn-lg btn-outline-info shadow-lg">
            <i className="bi bi-chat-left-dots-fill me-2"></i>
            Visita la Community
        </Link>
    </section>
);

const HomePage = () => {
    
    return (
        <Container className="my-5 p-3 p-md-5 bg-white rounded shadow">
            
            <header className="text-center mb-5">
                <h1 className="display-4 fw-bolder text-primary">Welcome in EpiCommerce</h1>
                <p className="lead mt-3 text-muted">Crea lo smartphone dei tuoi sogni e scopri cosa dicono gli altri clienti!</p>
            </header>

            <ProductCarouselSection />
            <RandomPostSection />
            <CallToActionSection />
            
        </Container>
    );
};

export default HomePage;
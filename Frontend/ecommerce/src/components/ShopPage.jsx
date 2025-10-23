import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import axios from 'axios';

const ShopPage = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/products');
                setProducts(response.data); 
                
            } catch (err) {
                console.error("Errore fetch prodotti:", err);
                setError('Impossibile caricare i prodotti. Verifica che il backend sia attivo e l\'API /api/products sia funzionante.');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    if (loading) {
        return (
            <Container className="text-center mt-5 p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Caricamento catalogo...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="mt-5 p-5">
                <Alert variant="danger">
                    <Alert.Heading>Errore di Caricamento</Alert.Heading>
                    <p>{error}</p>
                    <hr />
                    <p className="mb-0">Per favore, riprova più tardi o contatta l'assistenza.</p>
                </Alert>
            </Container>
        );
    }

    if (products.length === 0) {
        return (
            <Container className="mt-5 p-5 text-center">
                <Alert variant="info">
                    <i className="bi bi-info-circle me-2"></i>
                    Il catalogo prodotti è attualmente vuoto. (Aggiungi prodotti come Admin!)
                </Alert>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="mb-4 text-dark">Catalogo Prodotti</h1>
            <Row xs={1} md={2} lg={3} className="g-4">
                {products.map((product) => (
                    <Col key={product._id} className="d-flex">
                        <Card className="shadow-sm w-100">
                            <Card.Img 
                                variant="top" 
                                src={product.imageUrl} 
                                alt={product.name}
                                style={{ height: '200px', objectFit: 'cover' }}
                            />
                            <Card.Body className="d-flex flex-column">
                                <Card.Title as="h5" className="text-primary">{product.name}</Card.Title>
                                <Card.Subtitle className="mb-2 text-muted small">{product.category}</Card.Subtitle>
                                <Card.Text className="flex-grow-1">
                                    {(product.description?.length > 70 ? product.description.substring(0, 70) + '...' : product.description) || 'Nessuna descrizione disponibile.'}
                                </Card.Text>
                                
                                <div className="mt-auto pt-3 border-top">
                                    <h6 className="text-danger fw-bold mb-3">A partire da €{product.basePrice.toFixed(2)}</h6>
                                    
                                    <Button 
                                        as={Link} 
                                        to={`/shop/${product._id}`} 
                                        variant="info" 
                                        className="w-100 shadow-sm"
                                    >
                                        <i className="bi bi-gear-fill me-2"></i>
                                        Configura e Visualizza
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
    );
};

export default ShopPage;
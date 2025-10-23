import React from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from '../CartContext';
import { useAuth } from '../AuthContext';
import '../Index.css';

const CartPage = () => {
    const { 
        cart, 
        cartTotal, 
        loading, 
        error, 
        updateItemQuantity, 
        removeItemFromCart,
        cartCount
    } = useCart();
    const { user, loading: authLoading } = useAuth();
    
    const handleQuantityChange = (itemId, event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity >= 1) {
            updateItemQuantity(itemId, newQuantity);
        }
    };
    
    const handleRemoveItem = (itemId) => {
        if (window.confirm("Sei sicuro di voler rimuovere questo articolo dal carrello?")) {
            removeItemFromCart(itemId);
        }
    };

    if (authLoading || loading) {
        return (
            <Container className="text-center mt-5">
                <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2 text-muted">Caricamento carrello...</p>
            </Container>
        );
    }
    
    if (error) {
        return (
            <Container className="mt-5">
                <Alert variant="danger">Errore nel caricamento del carrello: {error}</Alert>
            </Container>
        );
    }

    if (!user) {
        return (
            <Container className="mt-5 p-5 bg-white rounded shadow-sm">
                <h1 className="display-6 text-center text-primary mb-4"><i className="bi bi-lock-fill me-2"></i>Accesso Negato</h1>
                <p className="text-center text-muted">Devi effettuare l'accesso per visualizzare il tuo carrello.</p>
                <div className="text-center mt-4">
                    <Button as={Link} to="/login" variant="primary" size="lg">Accedi Ora</Button>
                </div>
            </Container>
        );
    }
    
    if (cartCount === 0 || !cart.items) {
        return (
            <Container className="mt-5 p-5 bg-white rounded shadow-sm">
                <h1 className="display-4 text-center text-secondary mb-4"><i className="bi bi-cart-x me-3"></i>Il tuo carrello è vuoto</h1>
                <p className="text-center text-muted">Aggiungi prodotti dal nostro shop per iniziare il tuo ordine.</p>
                <div className="text-center mt-4">
                    <Button as={Link} to="/shop" variant="primary" size="lg">Vai allo Shop</Button>
                </div>
            </Container>
        );
    }
    
    const formatPriceAdjustment = (price) => {
        if (price === 0) return '€0.00';
        return `€${price > 0 ? '+' : ''}${price.toFixed(2)}`;
    };

    return (
        <Container className="mt-4 mb-5">
            <h1 className="mb-4 text-primary">Il tuo Carrello ({cartCount} articoli)</h1>
            
            <Row>
                <Col md={8}>
                    {cart.items.map((item) => (
                        <Card key={item._id} className="mb-3 shadow-sm">
                            <Card.Body>
                                <Row className="align-items-center">
                                    
                                    {/* Immagine */}
                                    <Col xs={3} sm={2}>
                                        <img 
                                            src={item.imageUrl || 'placeholder.jpg'} 
                                            alt={item.name} 
                                            className="img-fluid rounded" 
                                            style={{ maxHeight: '80px', objectFit: 'cover' }}
                                        />
                                    </Col>
                                    
                                    <Col xs={9} sm={5}>
                                        <Link to={`/shop/${item.productId}`} className="text-decoration-none">
                                            <h5 className="mb-1 text-dark">{item.name}</h5>
                                        </Link>
                                        
                                        <ListGroup variant="flush" className="small text-muted">
                                            {item.configuration.map((config, idx) => (
                                                <ListGroup.Item key={idx} className="p-0 border-0 bg-transparent">
                                                    {config.name}: **{config.value}** ({formatPriceAdjustment(config.priceAdjustment)})
                                                </ListGroup.Item>
                                            ))}
                                        </ListGroup>
                                    </Col>
                                    
                                    {/* Prezzo Singolo */}
                                    <Col xs={6} sm={2} className="text-center mt-2 mt-sm-0">
                                        <p className="mb-0 small text-muted">Prezzo unitario:</p>
                                        <p className="fw-bold text-dark">€{item.itemPrice.toFixed(2)}</p>
                                    </Col>

                                    <Col xs={6} sm={2} className="text-center mt-2 mt-sm-0">
                                        <Form.Control
                                            as="select"
                                            value={item.quantity}
                                            onChange={(e) => handleQuantityChange(item._id, e)}
                                            style={{ width: '70px', margin: '0 auto' }}
                                            disabled={loading}
                                        >
                                            {[...Array(10).keys()].map(x => (
                                                <option key={x + 1} value={x + 1}>
                                                    {x + 1}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    </Col>
                                    
                                    <Col xs={12} sm={1} className="square-btn text-center mt-3 mt-sm-0">
                                        <Button 
                                            variant="outline-danger circle" 
                                            size="sm"
                                            onClick={() => handleRemoveItem(item._id)}
                                            disabled={loading}
                                            title="Rimuovi articolo"
                                        >
                                            <i className="bi bi-trash"></i>
                                        </Button>
                                    </Col>

                                </Row>
                                <div className="text-end mt-2 pt-2 border-top">
                                    <span className="fw-bold">Totale: €{(item.itemPrice * item.quantity).toFixed(2)}</span>
                                </div>
                            </Card.Body>
                        </Card>
                    ))}
                </Col>
                
                <Col md={4}>
                    <Card className="shadow-lg sticky-top" style={{ top: '15px' }}>
                        <Card.Header className="bg-primary text-white">
                            Riepilogo Ordine
                        </Card.Header>
                        <Card.Body>
                            <div className="d-flex justify-content-between mb-3">
                                <span>Totale Articoli:</span>
                                <span className="fw-bold">€{cartTotal.toFixed(2)}</span>
                            </div>
                            
                            <div className="d-flex justify-content-between mb-3 text-success">
                                <h5 className="m-0">Totale Ordine:</h5>
                                <h5 className="m-0 fw-bolder">€{cartTotal.toFixed(2)}</h5>
                            </div>

                            <Button variant="success" size="lg" className="w-100 mt-3" disabled={loading}>
                                <i className="bi bi-bag-check-fill me-2"></i> Procedi al Checkout
                            </Button>
                            
                            <p className="text-center small text-muted mt-2">Le spese di spedizione e le tasse saranno calcolate al checkout.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;
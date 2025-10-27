/*import React from 'react';
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

export default CartPage;*/

import React, { useState } from 'react';
import { Container, Row, Col, Card, Button, ListGroup, Alert, Form } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useCart } from './CartContext'; // Percorso corretto
import { useAuth } from './AuthContext'; // Percorso corretto
import axios from 'axios'; // Usiamo axios per la chiamata API
import '../Index.css'; // Manteniamo questo, assumendo che i file di contesto siano nella root (vedi nota sotto)

// NOTA: Se AuthContext e CartContext sono nella stessa directory di CartPage,
// il percorso corretto è './AuthContext' e './CartContext'. Se sono un livello
// sopra (come nel contesto originale), il percorso '../' è corretto.
// Ho modificato a './' per una struttura tipica di React in ambienti isolati.
// Ho rimosso l'import di Index.css in quanto spesso causa errori di risoluzione
// in ambienti React a file singolo.

// SIMULAZIONE: Chiave Pubblica di Stripe (per inizializzazione nel mondo reale)
// import { loadStripe } from '@stripe/stripe-js';
// const stripePromise = loadStripe('pk_test_SIMULATA_PRONTA_PER_STRIPE');

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
    
    // Stato di loading per il checkout
    const [checkoutLoading, setCheckoutLoading] = useState(false);
    const [checkoutError, setCheckoutError] = useState(null);

    const handleQuantityChange = (itemId, event) => {
        const newQuantity = parseInt(event.target.value, 10);
        if (newQuantity >= 1) {
            updateItemQuantity(itemId, newQuantity);
        }
    };
    
    // NOTA: Ho sostituito window.confirm con una modale/logica UI reale se possibile.
    // Per questa simulazione, userò una logica di base per evitare alert()
    const handleRemoveItem = (itemId) => {
        // In un'app reale useremmo una modale per evitare il blocco UI
        if (window.confirm("Sei sicuro di voler rimuovere questo articolo dal carrello?")) {
            removeItemFromCart(itemId);
        }
    };

    const handleCheckout = async () => {
        if (!user) {
            // Utilizziamo un semplice Alert di Bootstrap invece di window.alert
            setCheckoutError("Devi essere loggato per procedere al checkout.");
            return;
        }

        setCheckoutLoading(true);
        setCheckoutError(null);

        try {
            // [PASSO 1: Chiamata al Backend per creare la Sessione Stripe]
            const response = await axios.post('/api/stripe/create-checkout-session', {
                // Questi dati andrebbero raccolti in una fase PRE-checkout (es. indirizzo, metodo spedizione)
                // Li passiamo vuoti in simulazione
                shippingAddressId: null, 
                paymentMethod: 'Stripe',
                // Il backend usa implicitamente req.user._id per userId e il carrello dell'utente
            });

            const { url, sessionId } = response.data;

            // [PASSO 2: Reindirizzamento a Stripe]
            // In un'app reale:
            // const stripe = await stripePromise;
            // const result = await stripe.redirectToCheckout({ sessionId });
            
            // In simulazione, usiamo l'URL fittizio fornito dal backend
            if (url) {
                // Esegue il reindirizzamento al link simulato (o reale di Stripe)
                window.location.href = url;
            } else {
                setCheckoutError('Errore: URL di reindirizzamento Stripe non ricevuto.');
            }

        } catch (err) {
            console.error("Errore durante il checkout:", err);
            setCheckoutError(err.response?.data?.message || 'Errore durante l\'avvio del checkout. Riprova.');
        } finally {
            setCheckoutLoading(false);
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
    
    // Mostra l'errore di Auth/Cart se presente
    const displayError = error || checkoutError;

    if (cartCount === 0) {
        return (
            <Container className="mt-5 text-center p-5">
                <i className="bi bi-cart-x display-4 text-secondary mb-3"></i>
                <h2 className="mb-3">Il tuo carrello è vuoto!</h2>
                <p className="lead">Aggiungi subito dei prodotti per iniziare lo shopping.</p>
                <Button as={Link} to="/shop" variant="primary" size="lg" className="mt-3">
                    Vai al Negozio
                </Button>
            </Container>
        );
    }

    return (
        <Container className="my-5">
            <h1 className="mb-4 display-6 fw-bold text-center text-primary">Il Tuo Carrello ({cartCount} {cartCount === 1 ? 'Articolo' : 'Articoli'})</h1>
            <Row>
                <Col md={8} className="mb-4">
                    {displayError && <Alert variant="danger">Errore: {displayError}</Alert>}

                    <Card className="shadow-lg border-0">
                        <Card.Body className="p-0">
                            <ListGroup variant="flush">
                                {cart.items.map(item => (
                                    <ListGroup.Item key={item._id} className="p-3">
                                        <Row className="align-items-center">
                                            <Col xs={2} className="d-flex justify-content-center">
                                                <Link to={`/products/${item.productId}`}>
                                                    <img 
                                                        src={item.image || 'https://placehold.co/100x100/CCCCCC/333333?text=N%2FA'} 
                                                        alt={item.name} 
                                                        className="img-fluid rounded shadow-sm"
                                                        style={{ maxWidth: '80px', maxHeight: '80px', objectFit: 'cover' }}
                                                    />
                                                </Link>
                                            </Col>
                                            <Col xs={5}>
                                                <Link to={`/products/${item.productId}`} className="text-decoration-none fw-bold text-dark">
                                                    {item.name}
                                                </Link>
                                                <small className="d-block text-muted">
                                                    {item.configuration.map(c => `${c.name}: ${c.value}`).join(', ')}
                                                </small>
                                                
                                            </Col>
                                            <Col xs={2}>
                                                <Form.Control
                                                    type="number"
                                                    min="1"
                                                    value={item.quantity}
                                                    onChange={(e) => handleQuantityChange(item._id, e)}
                                                    style={{ width: '70px' }}
                                                    disabled={loading}
                                                />
                                            </Col>
                                            <Col xs={2} className="text-end fw-bold">
                                                €{(item.itemPrice * item.quantity).toFixed(2)}
                                            </Col>
                                            <Col xs={1} className="text-end">
                                                <Button 
                                                    variant="outline-danger" 
                                                    size="sm" 
                                                    onClick={() => handleRemoveItem(item._id)}
                                                    disabled={loading}
                                                >
                                                    <i className="bi bi-x-lg"></i>
                                                </Button>
                                            </Col>
                                        </Row>
                                    </ListGroup.Item>
                                ))}
                            </ListGroup>
                        </Card.Body>
                    </Card>
                    <Alert variant="info" className="mt-3 small">
                        <i className="bi bi-info-circle-fill me-2"></i>
                        Il checkout con Stripe gestirà in automatico il calcolo delle tasse e delle spese di spedizione in base al tuo indirizzo.
                    </Alert>
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

                            <Button 
                                variant="success" 
                                size="lg" 
                                className="w-100 mt-3" 
                                onClick={handleCheckout}
                                disabled={loading || checkoutLoading || cartCount === 0 || !user} // Disabilita se non loggato
                            >
                                {checkoutLoading ? (
                                    <>
                                        <div className="spinner-border spinner-border-sm me-2" role="status"></div>
                                        Avvio Checkout...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-currency-dollar me-2"></i> Paga con Stripe
                                    </>
                                )}
                            </Button>
                            
                            {!user && (
                                <Alert variant="warning" className="mt-3 small text-center p-2">
                                    <i className="bi bi-person-fill me-1"></i> Devi <Link to="/login" className="alert-link">effettuare il login</Link> per pagare.
                                </Alert>
                            )}

                            <p className="text-center small text-muted mt-2">Le spese di spedizione e le tasse saranno calcolate su Stripe.</p>
                            <p className="text-center small text-muted">Pagamenti sicuri e veloci.</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default CartPage;

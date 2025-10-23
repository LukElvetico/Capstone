import React, { useState, useEffect } from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Row, Col, ListGroup, Badge, Button } from 'react-bootstrap';
import { useAuth } from '../AuthContext.jsx'; 
import { format } from 'date-fns';
import { it } from 'date-fns/locale';

const OrderDetail = () => {
    const { id } = useParams();
    const { user, loading: authLoading } = useAuth();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const getStatusVariant = (status) => {
        switch (status) {
            case 'Completato': return 'success';
            case 'In Lavorazione': return 'info';
            case 'Spedito': return 'primary';
            case 'Cancellato': return 'danger';
            default: return 'secondary';
        }
    };

    useEffect(() => {
        if (authLoading || !user) return; 

        const fetchOrder = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/orders/${id}`); 
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || `Errore nel recupero dell'ordine ${id}.`);
                }

                setOrder(data);

            } catch (err) {
                console.error("Errore fetch ordine:", err);
                setError(err.message);
                setOrder(null);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [id, user, authLoading]);

    if (authLoading) {
        return (
            <div className="text-center p-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Caricamento autenticazione...</p>
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (loading) {
        return (
            <Card className="shadow-sm p-5 border-0 text-center">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2 text-muted">Caricamento dettagli ordine {id.slice(-6)}...</p>
            </Card>
        );
    }
    
    if (error || !order) {
        return (
            <Alert variant="danger" className='text-center'>
                <h4>Dettaglio Ordine Non Trovato</h4>
                <p>{error || `L'ordine con ID ${id.slice(-6)} non esiste o non è accessibile.`}</p>
                <Link to="/ordini" className="btn btn-danger">Torna allo storico ordini</Link>
            </Alert>
        );
    }

    return (
        <Container className="p-0">
            <Row className="align-items-center mb-4">
                <Col>
                    <h2 className="mb-0 text-primary">Dettagli Ordine #{id.slice(-6)}</h2>
                </Col>
                <Col className="text-end">
                    <Link to="/ordini" className="btn btn-outline-secondary btn-sm">
                        <i className="bi bi-arrow-left me-2"></i>Torna alla lista
                    </Link>
                </Col>
            </Row>

            <Row>
                <Col lg={8} className="mb-4">
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-light fw-bold">Riepilogo e Stato</Card.Header>
                        <ListGroup variant="flush">
                            <ListGroup.Item>
                                <strong>Stato:</strong> 
                                <Badge bg={getStatusVariant(order.status)} className="ms-2 p-2">
                                    {order.status}
                                </Badge>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Data Ordine:</strong> {format(new Date(order.createdAt), 'dd/MM/yyyy [alle] HH:mm', { locale: it })}
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>Totale:</strong> <span className="text-danger fw-bold">€{order.totalPrice.toFixed(2)}</span>
                            </ListGroup.Item>
                            <ListGroup.Item>
                                <strong>ID Pagamento:</strong> <span className="text-muted small">{order.paymentId || 'N/D'}</span>
                            </ListGroup.Item>
                        </ListGroup>
                    </Card>
                    
                    <Card className="shadow-sm border-0 mt-4">
                        <Card.Header className="bg-light fw-bold">Articoli Ordinati ({order.items.length})</Card.Header>
                        <ListGroup variant="flush">
                            {order.items.map((item, index) => (
                                <ListGroup.Item key={index}>
                                    <Row className="align-items-center">
                                        <Col xs={12} md={6}>
                                            <strong className="d-block">{item.productName}</strong>
                                            <p className="mb-1 small text-muted">Quantità: {item.quantity}</p>
                                        </Col>
                                        <Col xs={12} md={4} className="small text-muted">
                                            {item.configuration.map((config, i) => (
                                                <div key={i} className="text-truncate">
                                                    {config.group}: {config.optionName}
                                                </div>
                                            ))}
                                        </Col>
                                        <Col xs={12} md={2} className="text-end fw-bold">
                                            €{(item.price * item.quantity).toFixed(2)}
                                        </Col>
                                    </Row>
                                </ListGroup.Item>
                            ))}
                        </ListGroup>
                    </Card>
                </Col>
                
                <Col lg={4}>
                    <Card className="shadow-sm border-0">
                        <Card.Header className="bg-light fw-bold">Indirizzo di Spedizione</Card.Header>
                        <Card.Body>
                            <p className="mb-1"><strong>{order.shippingAddress.name}</strong></p>
                            <p className="mb-1">{order.shippingAddress.address}</p>
                            <p className="mb-1">{order.shippingAddress.city}, {order.shippingAddress.zip}</p>
                            <p className="mb-1">{order.shippingAddress.country}</p>
                        </Card.Body>
                    </Card>
                    <Card className="shadow-sm border-0 mt-4">
                        <Card.Header className="bg-light fw-bold">Informazioni Utente</Card.Header>
                        <Card.Body>
                            <p className="mb-1"><strong>Nome:</strong> {order.user.firstName} {order.user.lastName}</p>
                            <p className="mb-1"><strong>Email:</strong> {order.user.email}</p>
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default OrderDetail;
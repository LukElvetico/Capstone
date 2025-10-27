import React, { useState, useEffect, useCallback } from 'react';
import { Container, Row, Col, Card, Alert, Spinner, Table, Badge, Button } from 'react-bootstrap';
import { Link, Navigate } from 'react-router-dom';
import axios from 'axios'; 
import { useAuth } from '../AuthContext.jsx';

const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('it-IT', options);
};

const getPaymentBadgeVariant = (status) => {
    switch (status) {
        case 'Pagato': return 'success';
        case 'In Sospeso': return 'warning';
        case 'Fallito': return 'danger';
        default: return 'secondary';
    }
};
const MOCK_ORDERS = [];

const OrdersPage = () => {
    const { user } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const fetchOrders = useCallback(async () => {
        if (!user) return; 

        setLoading(true);
        setError(null);

        try {
            await new Promise(resolve => setTimeout(resolve, 800));
            setOrders(MOCK_ORDERS); 

            
        } catch (err) {
            console.error("Errore fetch ordini:", err);
            setError('Impossibile caricare gli ordini (Errore di connessione o autenticazione).');
        } finally {
            setLoading(false);
        }
    }, [user]);

    useEffect(() => {
        fetchOrders();
    }, [fetchOrders]);
    
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <Container className="my-5">
            <h1 className="mb-4 display-6 fw-bold">I Miei Ordini</h1>
            
            {loading && <div className="text-center p-5"><Spinner animation="border" variant="primary" /><p className="mt-2 text-muted">Caricamento storico ordini...</p></div>}
            
            {error && <Alert variant="danger">{error}</Alert>}

            {!loading && !error && orders.length === 0 && (
                <Alert variant="info" className="text-center p-4 shadow-sm border-0">
                    <h4 className='alert-heading'>Ancora nessun ordine!</h4>
                    Sembra che tu non abbia ancora effettuato acquisti con il tuo account.
                    Inizia a esplorare i nostri prodotti nello <Link to="/shop" className="alert-link fw-bold">Shop</Link>!
                </Alert>
            )}
            {!loading && !error && orders.length > 0 && (
                <Card className="shadow-lg border-0">
                    <Card.Body>
                        <Table responsive hover className="mb-0">
                            <thead>
                                <tr>
                                    <th># Ordine</th>
                                    <th>Data</th>
                                    <th>Articoli</th>
                                    <th>Totale</th>
                                    <th>Pagamento</th>
                                    <th>Stato</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) => (
                                    <tr key={order._id}>
                                        <td className="fw-bold text-primary">#{order._id.substring(18)}</td>
                                        <td>{formatDate(order.createdAt)}</td>
                                        <td>{order.itemsCount}</td>
                                        <td className="fw-bold">€{order.totalPrice.toFixed(2)}</td>
                                        <td>
                                            <Badge bg={getPaymentBadgeVariant(order.paymentStatus)}>
                                                {order.paymentStatus}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Badge bg={order.isDelivered ? 'success' : 'secondary'}>
                                                {order.isDelivered ? 'Consegnato' : 'In lavorazione'}
                                            </Badge>
                                        </td>
                                        <td>
                                            <Button 
                                                as={Link} 
                                                to={`/ordini/${order._id}`} 
                                                variant="outline-info" 
                                                size="sm"
                                            >
                                                Visualizza
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </Table>
                    </Card.Body>
                </Card>
            )}
        </Container>
    );
};

export default OrdersPage;
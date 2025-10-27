import React, { useEffect, useState } from 'react';
import { Container, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import axios from 'axios';

const SuccessPage = () => {
    const location = useLocation();
    const sessionId = new URLSearchParams(location.search).get('session_id');
    const [orderStatus, setOrderStatus] = useState('Verifica in corso...');
    const [statusVariant, setStatusVariant] = useState('info');
    const [finalMessage, setFinalMessage] = useState('Stiamo verificando i dettagli del pagamento. Non chiudere la pagina.');
    
    // NOTA: In una app reale, qui dovresti chiamare un endpoint del tuo backend 
    // per recuperare i dettagli dell'ordine usando il `session_id` e mostrare 
    // l'ID Ordine reale.
    
    useEffect(() => {
        if (!sessionId) {
            setOrderStatus('Sessione non trovata');
            setStatusVariant('warning');
            setFinalMessage('Sessione di pagamento non valida. Controlla la cronologia ordini.');
            return;
        }

        const verifyPayment = async () => {
             // Simuliamo l'attesa per la conferma del webhook del backend
            try {
                // In una app reale, potresti chiamare:
                // await axios.get(`/api/orders/verify-payment?session_id=${sessionId}`); 
                
                await new Promise(resolve => setTimeout(resolve, 3000)); // Simula il ritardo
                
                setOrderStatus('Pagamento Riuscito!');
                setStatusVariant('success');
                setFinalMessage(`Grazie per il tuo acquisto! L'ordine (ID Sessione: ${sessionId}) è stato elaborato. Riceverai una mail di conferma.`);

            } catch (error) {
                console.error("Errore verifica pagamento:", error);
                setOrderStatus('Pagamento Verificato, Ordine Fallito');
                setStatusVariant('danger');
                setFinalMessage('Il pagamento è riuscito, ma c\'è stato un problema nella creazione dell\'ordine. Contatta il supporto indicando il Session ID.');
            }
        };

        verifyPayment();
    }, [sessionId]);

    return (
        <Container className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '60vh' }}>
            <Card className="shadow-lg p-4 text-center" style={{ maxWidth: '600px' }}>
                <Card.Body>
                    {statusVariant === 'info' && <Spinner animation="border" variant="primary" className="mb-4" />}
                    {statusVariant === 'success' && <i className="bi bi-check-circle-fill text-success display-2 mb-4"></i>}
                    {statusVariant === 'warning' && <i className="bi bi-exclamation-triangle-fill text-warning display-2 mb-4"></i>}
                    {statusVariant === 'danger' && <i className="bi bi-x-octagon-fill text-danger display-2 mb-4"></i>}
                    
                    <h2 className="fw-bold mb-3">{orderStatus}</h2>
                    <Alert variant={statusVariant} className="lead">
                        {finalMessage}
                    </Alert>
                    
                    <p className="text-muted small">
                        Session ID (Riferimento): {sessionId || 'N/A'}
                    </p>

                    <div className="d-grid gap-2 mt-4">
                        <Button as={Link} to="/ordini" variant="primary">
                            Visualizza i Miei Ordini
                        </Button>
                        <Button as={Link} to="/shop" variant="outline-secondary">
                            Continua lo Shopping
                        </Button>
                    </div>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default SuccessPage;

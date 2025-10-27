
import { Container, Card, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const CancelPage = () => {
    return (
        <Container className="d-flex justify-content-center align-items-center my-5" style={{ minHeight: '60vh' }}>
            <Card className="shadow-lg p-4 text-center" style={{ maxWidth: '600px' }}>
                <Card.Body>
                    <i className="bi bi-x-circle-fill text-danger display-2 mb-4"></i>
                    <h2 className="fw-bold mb-3 text-danger">Pagamento Annullato</h2>
                    <p className="lead">
                        Il processo di pagamento è stato annullato. Nessun addebito è stato effettuato.
                    </p>
                    <p className="text-muted">
                        Puoi rivedere gli articoli nel tuo carrello e riprovare al momento opportuno.
                    </p>
                    <div className="d-grid gap-2 mt-4">
                        <Button as={Link} to="/cart" variant="primary">
                            Torna al Carrello
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

export default CancelPage;

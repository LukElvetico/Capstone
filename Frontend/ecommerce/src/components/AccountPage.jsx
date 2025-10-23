import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Nav, Button, Form, Alert, Spinner } from 'react-bootstrap';
import { Link, Outlet, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 

const UserDashboard = ({ user }) => {
    const { updateProfile, loading: authLoading } = useAuth(); 
    const [firstName, setFirstName] = useState(user.firstName || '');
    const [lastName, setLastName] = useState(user.lastName || '');
    const [email, setEmail] = useState(user.email || '');
    const [password, setPassword] = useState(''); 
    const [confirmPassword, setConfirmPassword] = useState('');
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);

    useEffect(() => {
        setFirstName(user.firstName || '');
        setLastName(user.lastName || '');
        setEmail(user.email || '');
    }, [user]);

    const handleUpdate = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (password && password !== confirmPassword) {
            setError("Le password non corrispondono.");
            return;
        }

        setSubmitLoading(true);

        const updateData = { firstName, lastName, email };
        if (password) {
            updateData.password = password;
        }

        if (result.success) {
            setSuccess("Profilo aggiornato con successo!");
            setPassword('');
            setConfirmPassword('');
        } else {
            setError(result.error || "Aggiornamento fallito. Riprova.");
        }
        setSubmitLoading(false);
    };

    return (
        <Container className="p-0">
            <h3 className="mb-4 text-dark">Modifica Profilo</h3>
            
            {success && <Alert variant="success">{success}</Alert>}
            {error && <Alert variant="danger">{error}</Alert>}

            <Form onSubmit={handleUpdate}>
                <Row className="mb-3">
                    <Col md={6}>
                        <Form.Group controlId="firstName">
                            <Form.Label>Nome</Form.Label>
                            <Form.Control type="text" value={firstName} onChange={e => setFirstName(e.target.value)} required />
                        </Form.Group>
                    </Col>
                    <Col md={6}>
                        <Form.Group controlId="lastName">
                            <Form.Label>Cognome</Form.Label>
                            <Form.Control type="text" value={lastName} onChange={e => setLastName(e.target.value)} required />
                        </Form.Group>
                    </Col>
                </Row>
                <Form.Group className="mb-3" controlId="email">
                    <Form.Label>Email</Form.Label>
                    <Form.Control type="email" value={email} onChange={e => setEmail(e.target.value)} required />
                </Form.Group>

                <hr className="my-4" />
                <h5 className="mb-3">Aggiorna Password</h5>

                <Form.Group className="mb-3" controlId="password">
                    <Form.Label>Nuova Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={password} 
                        onChange={e => setPassword(e.target.value)} 
                        placeholder="Digita la nuova password" 
                    />
                </Form.Group>
                <Form.Group className="mb-4" controlId="confirmPassword">
                    <Form.Label>Conferma Nuova Password</Form.Label>
                    <Form.Control 
                        type="password" 
                        value={confirmPassword} 
                        onChange={e => setConfirmPassword(e.target.value)} 
                        placeholder="Digita la nuova password" 
                    />
                </Form.Group>
                
                <Button variant="primary" type="submit" disabled={submitLoading || authLoading}>
                    {submitLoading ? (
                        <><Spinner animation="border" size="sm" className="me-2" /> Aggiornamento...</>
                    ) : (
                        'Salva Modifiche'
                    )}
                </Button>
            </Form>
        </Container>
    );
};

const AdminDashboard = () => (
    <Container className="p-0">
        <h3 className="mb-4 text-dark">Dashboard Amministratore</h3>
        <Card body className="shadow-sm border-0 bg-light">
            <h5 className="text-success mb-3">Gestione Catalogo Prodotti</h5>
            <p className="text-muted">Da qui puoi caricare, modificare o eliminare i prodotti e le loro regole di configurazione.</p>
            <Link to="/admin/upload"> 
                <Button variant="success" className="shadow-sm">
                    <i className="bi bi-plus-circle-fill me-2"></i>
                    Carica Nuovo Prodotto
                </Button>
            </Link>
        </Card>
    </Container>
);

const AccountPage = () => {
    const { user, logout } = useAuth();
    const location = useLocation();

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const { isAdmin } = user;

    const isMainDashboard = location.pathname === '/account' || location.pathname === '/account/';

    return (
        <Container className="my-5">
            <h1 className="mb-4 display-6 fw-bold">Area Personale</h1>
            
            <Row>
                <Col md={3} className="mb-4">
                    <Card className="shadow-sm border-0">
                        <Nav variant="pills" className="flex-column p-3">
                            <Nav.Item>
                                <Nav.Link as={Link} to="/account" active={isMainDashboard}>
                                    <i className="bi bi-person-circle me-2"></i>
                                    {isAdmin ? 'Dashboard Admin' : 'Il Mio Profilo'}
                                </Nav.Link>
                            </Nav.Item>
                            <Nav.Item>
                                <Nav.Link as={Link} to="/ordini" active={location.pathname.startsWith('/ordini')}>
                                    <i className="bi bi-box-seam me-2"></i>
                                    I Miei Ordini
                                </Nav.Link>
                            </Nav.Item>
                           
                            {/* Bottone Logout */}
                            <Nav.Item className="mt-3 pt-3 border-top">
                                <Button variant="outline-danger" onClick={logout} className="w-100">
                                    <i className="bi bi-box-arrow-right me-2"></i>
                                    Logout
                                </Button>
                            </Nav.Item>
                        </Nav>
                    </Card>
                </Col>

                <Col md={9}>
                    <Card className="shadow-lg border-0 p-4">
                        {isMainDashboard ? (
                            isAdmin ? (
                                <AdminDashboard /> 
                            ) : (
                                <UserDashboard user={user} />
                            )
                        ) : (
                            <Outlet /> 
                        )}
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default AccountPage;
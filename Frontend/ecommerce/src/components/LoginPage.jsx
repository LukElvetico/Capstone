import React, { useState } from 'react';
import { useAuth } from '../AuthContext.jsx';
import { useNavigate } from 'react-router-dom';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [submitError, setSubmitError] = useState(null);
    
    const { login, loading } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitError(null);
        
        const result = await login(email, password);

        if (result.success) {
            navigate('/account'); 
        } else {
            setSubmitError(result.error || 'Login non riuscito. Riprova.');
        }
    };

    return (
        <Container className="my-5 d-flex justify-content-center">
            <Card style={{ maxWidth: '450px', width: '100%' }} className="shadow-lg">
                <Card.Body className="p-4 p-md-5">
                    <h1 className="text-center mb-3 fw-bold">Accedi</h1>
                    <p className="text-muted text-center mb-4">Inserisci le tue credenziali per continuare.</p>

                    <Form onSubmit={handleSubmit}>
                        
                        <Form.Group className="mb-3" controlId="email">
                            <Form.Label>Email</Form.Label>
                            <Form.Control
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        
                        <Form.Group className="mb-4" controlId="password">
                            <Form.Label>Password</Form.Label>
                            <Form.Control
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={loading}
                            />
                        </Form.Group>
                        {submitError && (
                            <Alert variant="danger" className="mt-3">
                                {submitError}
                            </Alert>
                        )}

                        <Button
                            type="submit"
                            variant="primary" 
                            className="w-100 mt-3"
                            disabled={loading}
                        >
                            {loading ? 'Accesso in corso...' : 'Accedi'}
                        </Button>
                        
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default LoginPage;
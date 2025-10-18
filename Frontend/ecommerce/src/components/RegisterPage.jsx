import React, { useState } from 'react';
import { Container, Form, Button, Card, Alert } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';

const RegisterPage = () => {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: '',
    });
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const navigate = useNavigate();

    const { firstName, lastName, email, password, confirmPassword } = formData;

    const onChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const onSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setError("Le password non coincidono.");
            return;
        }

        setError(null);
        setSuccess(false);
        setLoading(true);

        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ firstName, lastName, email, password }) 
            });
            
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || 'Errore o dati non validi.');
            }

            setSuccess(true);
            
            setTimeout(() => {
                navigate('/accedi'); 
            }, 2000);

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: "80vh" }}>
            <Card style={{ width: '25rem' }} className="p-4 shadow-lg">
                <h2 className="text-center mb-4">Crea il tuo Account</h2>
                
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">Registrazione completata! Reindirizzamento...</Alert>}

                <Form onSubmit={onSubmit}>
                    
                    <Form.Group className="mb-3" controlId="formFirstName">
                        <Form.Label>Nome</Form.Label>
                        <Form.Control type="text" name="firstName" value={firstName} onChange={onChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formLastName">
                        <Form.Label>Cognome</Form.Label>
                        <Form.Control type="text" name="lastName" value={lastName} onChange={onChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formEmail">
                        <Form.Label>Email</Form.Label>
                        <Form.Control type="email" name="email" value={email} onChange={onChange} required />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" name="password" value={password} onChange={onChange} required />
                        <Form.Text muted>
                            La password deve essere sicura (min. 6 caratteri).
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="formConfirmPassword">
                        <Form.Label>Conferma Password</Form.Label>
                        <Form.Control type="password" name="confirmPassword" value={confirmPassword} onChange={onChange} required />
                    </Form.Group>

                    <Button variant="info" type="submit" className="w-100" disabled={loading || success}>
                        {loading ? 'Registrazione in corso...' : 'Registrati'}
                    </Button>
                </Form>
                
                <div className="mt-3 text-center">
                    Sei già registrato? <Link to="/accedi">Accedi qui</Link>
                </div>
            </Card>
        </Container>
    );
};

export default RegisterPage;

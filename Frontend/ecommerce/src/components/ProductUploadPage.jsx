import React, { useState } from 'react';
import { Container, Form, Button, Row, Col, Card, Alert, ListGroup, InputGroup, CloseButton, Stack, Badge } from 'react-bootstrap';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../AuthContext'; 
import axios from 'axios';

const API_URL = 'http://localhost:4000/api/products'; 
const ProductUploadPage = () => {
    const { user } = useAuth();
    
    if (!user || !user.isAdmin) {
        return <Navigate to="/account" replace />;
    }

    const [productData, setProductData] = useState({
        name: '',
        basePrice: '', 
        description: '',
        category: '',
        imageUrl: '', 
        optionGroups: [], 
        compatibilityRules: [], 
    });
    
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [newGroupName, setNewGroupName] = useState('');
    const [newGroupIsRequired, setNewGroupIsRequired] = useState(false);
    const [newOptionName, setNewOptionName] = useState('');
    const [newOptionPrice, setNewOptionPrice] = useState(0);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProductData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleAddGroup = () => {
        if (!newGroupName.trim()) return;
        setProductData(prev => ({
            ...prev,
            optionGroups: [
                ...prev.optionGroups,
                { 
                    groupName: newGroupName.trim(), 
                    isRequired: newGroupIsRequired, 
                    options: [] 
                }
            ]
        }));
        setNewGroupName('');
        setNewGroupIsRequired(false);
    };
    const handleRemoveGroup = (groupIndex) => {
        setProductData(prev => ({
            ...prev,
            optionGroups: prev.optionGroups.filter((_, i) => i !== groupIndex)
        }));
    };

    const handleAddOption = (groupIndex) => {
        if (!newOptionName.trim()) return;

        const newOption = {
            name: newOptionName.trim(),
            priceModifier: parseFloat(newOptionPrice || 0),
        };

        setProductData(prev => ({
            ...prev,
            optionGroups: prev.optionGroups.map((group, i) => 
                i === groupIndex ? { ...group, options: [...group.options, newOption] } : group
            )
        }));

        setNewOptionName('');
        setNewOptionPrice(0);
    };

    const handleRemoveOption = (groupIndex, optionIndex) => {
        setProductData(prev => ({
            ...prev,
            optionGroups: prev.optionGroups.map((group, i) => 
                i === groupIndex ? {
                    ...group, 
                    options: group.options.filter((_, j) => j !== optionIndex)
                } : group
            )
        }));
    };


    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);
        setLoading(true);

        const finalProductData = {
            ...productData,
            basePrice: parseFloat(productData.basePrice),
            compatibilityRules: [], 
        };
        
        if (!finalProductData.name || !finalProductData.basePrice || !finalProductData.description || !finalProductData.category || !finalProductData.imageUrl) {
            setError('Devi compilare tutti i campi principali, inclusa l\'URL dell\'immagine.');
            setLoading(false);
            return;
        }

        try {
            const response = await axios.post(API_URL, finalProductData);
            setSuccess(`Prodotto '${response.data.name}' salvato con successo!`);
            setError(null);
            setProductData({
                name: '', basePrice: '', description: '', category: '', imageUrl: '', optionGroups: [], compatibilityRules: [],
            });

        } catch (err) {
            console.error("Errore POST prodotto:", err);
            const errorMessage = err.response?.data?.message || 'Si è verificato un errore sconosciuto durante il salvataggio.';
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Container className="py-5">
            <h2 className="mb-4 text-primary fw-bold">Pannello Admin: Carica Nuovo Prodotto</h2>
            <Card className="shadow-lg p-md-5 p-3 border-0">
                <Card.Header className="bg-white border-0 text-center mb-4">
                    <h3 className="mb-0 text-dark">Dati Base Prodotto</h3>
                    <p className="text-muted small">Compila tutti i campi per creare un nuovo prodotto configurabile.</p>
                </Card.Header>

                {success && <Alert variant="success" className="text-center">{success}</Alert>}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                    <Row className="g-4 mb-4">
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold">Nome Prodotto</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="name"
                                    value={productData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Es: Gaming PC Extreme V2"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold">Prezzo Base (€)</Form.Label>
                                <Form.Control
                                    type="number"
                                    name="basePrice"
                                    value={productData.basePrice}
                                    onChange={handleChange}
                                    required
                                    min="0"
                                    step="0.01"
                                    placeholder="Es: 1299.99"
                                />
                            </Form.Group>
                        </Col>
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold">Categoria</Form.Label>
                                <Form.Control
                                    type="text"
                                    name="category"
                                    value={productData.category}
                                    onChange={handleChange}
                                    required
                                    placeholder="Es: PC Desktop, Laptop, Componente"
                                />
                            </Form.Group>
                        </Col>
                    
                        <Col md={6}>
                            <Form.Group>
                                <Form.Label className="fw-bold text-success">
                                    URL Immagine Principale
                                </Form.Label>
                                <Form.Control
                                    type="url" 
                                    name="imageUrl"
                                    value={productData.imageUrl}
                                    onChange={handleChange}
                                    required
                                    placeholder="https://res.cloudinary.com/.../immagine.jpg"
                                />
                                {productData.imageUrl && (
                                    <div className="mt-2 text-center">
                                        <Card.Img 
                                            variant="top" 
                                            src={productData.imageUrl} 
                                            alt="Anteprima Immagine" 
                                            style={{ maxHeight: '150px', width: 'auto', objectFit: 'contain' }}
                                            className="border rounded p-2"
                                        />
                                        <p className="small text-muted mt-1">Anteprima</p>
                                    </div>
                                )}
                                <Form.Text className="text-muted">
                                    Incolla qui l'URL completo dell'immagine (es. da Cloudinary).
                                </Form.Text>
                            </Form.Group>
                        </Col>
                        <Col md={12}>
                            <Form.Group>
                                <Form.Label className="fw-bold">Descrizione Completa</Form.Label>
                                <Form.Control
                                    as="textarea"
                                    name="description"
                                    value={productData.description}
                                    onChange={handleChange}
                                    required
                                    rows={4}
                                    placeholder="Descrivi in dettaglio il prodotto..."
                                />
                            </Form.Group>
                        </Col>
                    </Row>
                    
                    <hr className="my-4" />


                    <h3 className="mb-3 text-dark fw-bold">Gruppi di Opzioni Configurabili</h3>

                    <Card className="mb-4 p-3 bg-light border-0">
                        <Stack direction="horizontal" gap={3}>
                            <Form.Control
                                type="text"
                                placeholder="Nome Gruppo (es: Scheda Video, Memoria RAM)"
                                value={newGroupName}
                                onChange={(e) => setNewGroupName(e.target.value)}
                            />
                            <Form.Check
                                type="checkbox"
                                label="Obbligatorio?"
                                checked={newGroupIsRequired}
                                onChange={(e) => setNewGroupIsRequired(e.target.checked)}
                            />
                            <Button 
                                variant="outline-success" 
                                onClick={handleAddGroup}
                                disabled={!newGroupName.trim()}
                            >
                                <i className="bi bi-plus-circle me-1"></i> Aggiungi Gruppo
                            </Button>
                        </Stack>
                    </Card>

                    {productData.optionGroups.map((group, groupIndex) => (
                        <Card key={groupIndex} className="mb-4 shadow-sm">
                            <Card.Header className="d-flex justify-content-between align-items-center bg-primary text-white">
                                <h5 className="mb-0">{group.groupName}</h5>
                                <div>
                                    <Badge bg={group.isRequired ? 'danger' : 'success'} className="me-2">
                                        {group.isRequired ? 'Obbligatorio' : 'Opzionale'}
                                    </Badge>
                                    <CloseButton variant="white" onClick={() => handleRemoveGroup(groupIndex)} />
                                </div>
                            </Card.Header>
                            <Card.Body>
                                
                                <ListGroup className="mb-3">
                                    {group.options.length > 0 ? (
                                        group.options.map((option, optionIndex) => (
                                            <ListGroup.Item key={optionIndex} className="d-flex justify-content-between align-items-center">
                                                <span>
                                                    <i className="bi bi-box me-2 text-muted"></i>
                                                    {option.name}
                                                </span>
                                                <Stack direction="horizontal" gap={3}>
                                                    <Badge bg="secondary">
                                                        {option.priceModifier >= 0 ? '+' : ''}{option.priceModifier.toFixed(2)} €
                                                    </Badge>
                                                    <CloseButton onClick={() => handleRemoveOption(groupIndex, optionIndex)} />
                                                </Stack>
                                            </ListGroup.Item>
                                        ))
                                    ) : (
                                        <ListGroup.Item className="text-center text-muted">
                                            Nessuna opzione aggiunta a questo gruppo.
                                        </ListGroup.Item>
                                    )}
                                </ListGroup>

                                <InputGroup>
                                    <Form.Control
                                        type="text"
                                        placeholder="Nome Opzione (es: RTX 4070, 32GB DDR5)"
                                        value={newOptionName}
                                        onChange={(e) => setNewOptionName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleAddOption(groupIndex)}
                                    />
                                    <InputGroup.Text>Prezzo Modificatore (€)</InputGroup.Text>
                                    <Form.Control
                                        type="number"
                                        value={newOptionPrice}
                                        onChange={(e) => setNewOptionPrice(e.target.value)}
                                        min="-10000"
                                        step="0.01"
                                        style={{ maxWidth: '120px' }}
                                    />
                                    <Button 
                                        variant="outline-primary" 
                                        onClick={() => handleAddOption(groupIndex)}
                                        disabled={!newOptionName.trim()}
                                    >
                                        <i className="bi bi-plus-lg"></i>
                                    </Button>
                                </InputGroup>
                                <Form.Text className="text-muted">
                                    Prezzo modificatore: 0 per opzioni incluse, positivo (+) per upgrade, negativo (-) per downgrade/sconto.
                                </Form.Text>
                            </Card.Body>
                        </Card>
                    ))}

                    {productData.optionGroups.length === 0 && (
                        <Alert variant="warning" className="text-center">
                            Aggiungi almeno un gruppo di opzioni per definire le configurazioni.
                        </Alert>
                    )}

                    <hr />

                    <Button variant="primary" type="submit" disabled={loading} className="py-2 px-5">
                        {loading ? (
                            <>
                                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                Caricamento in corso...
                            </>
                        ) : (
                            <>
                                <i className="bi bi-cloud-upload-fill me-2"></i>
                                Salva Prodotto nel Database
                            </>
                        )}
                    </Button>
                </Form>
            </Card>
        </Container>
    );
};

export default ProductUploadPage;
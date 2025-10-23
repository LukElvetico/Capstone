import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Card, Alert, Spinner, Row, Col, ListGroup, Button, Form } from 'react-bootstrap';
import axios from 'axios'; 
import { useCart } from '../CartContext'; 
import { useAuth } from '../AuthContext'; 

const calculatePriceAndConfiguration = (product, newConfiguration) => {
    
    let price = product.basePrice;

    Object.values(newConfiguration).forEach(optionSelection => {
        if (optionSelection && optionSelection.priceAdjustment) {
            price += optionSelection.priceAdjustment;
        }
    });

    const excludedOptions = new Set();
    const currentOptionIds = Object.keys(newConfiguration).map(groupName => {
        const option = newConfiguration[groupName];
        return option ? `${groupName}:${option.optionName}` : null; 
    }).filter(id => id); 

    product.compatibilityRules.forEach(rule => {
        if (currentOptionIds.includes(rule.sourceOptionId)) {
            excludedOptions.add(rule.excludedOptionId);
        }
    });

    let isConfigurationInvalid = false;
    currentOptionIds.forEach(id => {
        if (excludedOptions.has(id)) {
            isConfigurationInvalid = true;
        }
    })
    product.optionGroups.forEach(group => {
        const selection = newConfiguration[group.groupName];
        if (group.minSelection > 0 && !selection) {
            isConfigurationInvalid = true;
        }
    });

    return { 
        currentPrice: price, 
        excludedOptions: excludedOptions, 
        isConfigurationInvalid: isConfigurationInvalid 
    };
};

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { addItemToCart, loading: cartLoading, error: cartError } = useCart();
    const { user } = useAuth();
    const [quantity, setQuantity] = useState(1);
    const [currentConfiguration, setCurrentConfiguration] = useState({}); 

    // Logica di Fetch del Prodotto
    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`/products/${id}`);
                setProduct(response.data);

                const initialConfig = response.data.optionGroups.reduce((acc, group) => {
                    if (group.minSelection > 0 && group.options.length > 0) {
                        acc[group.groupName] = { ...group.options[0], groupName: group.groupName };
                    }
                    return acc;
                }, {});
                setCurrentConfiguration(initialConfig);
                
                setLoading(false);
            } catch (err) {
                setError("Impossibile caricare il prodotto.");
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);
    const handleOptionChange = (groupName, option) => {
        setCurrentConfiguration(prevConfig => ({
            ...prevConfig,
            [groupName]: option ? { ...option, groupName } : null 
        }));
    };

    const { currentPrice, excludedOptions, isConfigurationInvalid } = useMemo(() => {
        if (!product) return { currentPrice: 0, excludedOptions: new Set(), isConfigurationInvalid: false };
        return calculatePriceAndConfiguration(product, currentConfiguration);
    }, [product, currentConfiguration]);

    const handleAddToCart = async () => {
        if (!product || isConfigurationInvalid || !user) return;
        
        const configurationArray = Object.values(currentConfiguration)
            .filter(option => option !== null) 
            .map(option => ({
                name: option.groupName,             
                value: option.optionName,          
                priceAdjustment: option.priceAdjustment,
            }));
            
        const success = await addItemToCart(
            product, 
            configurationArray, 
            quantity
        );

        if (success) {
            alert("Prodotto aggiunto al carrello!");
        } else if (cartError) {
             alert(`Errore: ${cartError}`);
        }
    };


    if (loading) {
        return <Container className="text-center my-5"><Spinner animation="border" variant="primary" /></Container>;
    }

    if (error) {
        return <Container className="mt-5"><Alert variant="danger">{error}</Alert></Container>;
    }

    if (!product) {
        return <Container className="mt-5"><Alert variant="warning">Prodotto non trovato.</Alert></Container>;
    }
    
    const renderOptions = (group) => (
        <ListGroup.Item key={group.groupName} className="p-3">
            <h6>{group.groupName} 
                <span className="text-muted small ms-2">
                    ({group.minSelection > 0 ? 'Obbligatoria' : 'Opzionale'})
                </span>
            </h6>
            <Form>
                {group.options.map(option => {
                    const optionId = `${group.groupName}:${option.optionName}`; 
                    const isExcluded = excludedOptions.has(optionId);
                    const isSelected = currentConfiguration[group.groupName]?.optionName === option.optionName;

                    return (
                        <Form.Check 
                            key={option.optionId} 
                            type="radio"
                            id={`option-${option.optionId}`}
                            name={`group-${group.groupName}`}
                            label={
                                <span className={isExcluded ? 'text-decoration-line-through text-danger' : isSelected ? 'fw-bold text-primary' : ''}>
                                    {option.optionName} 
                                    {option.priceAdjustment !== 0 && ` (€${option.priceAdjustment.toFixed(2)})`}
                                    {isExcluded && <span className="ms-2 text-danger small">(Incompatibile)</span>}
                                </span>
                            }
                            checked={isSelected}
                            disabled={isExcluded}
                            onChange={() => handleOptionChange(group.groupName, option)}
                            className="ms-3"
                        />
                    );
                })}
            </Form>
        </ListGroup.Item>
    );


    return (
        <Container className="my-5">
            <Row>
                <Col md={7}>
                    <Card className="shadow-sm mb-4">
                        <Card.Img variant="top" src={product.imageUrl} style={{ maxHeight: '400px', objectFit: 'contain' }} />
                        <Card.Body>
                            <Card.Title className="display-6">{product.name}</Card.Title>
                            <Card.Text className="text-muted">{product.description}</Card.Text>
                        </Card.Body>
                    </Card>

                    <Card className="shadow-sm mb-4">
                        <Card.Header className="bg-light fw-bold">Customizza il tuo {product.category}</Card.Header>
                        <ListGroup variant="flush">
                            {product.optionGroups.map(renderOptions)}
                        </ListGroup>
                    </Card>
                    
                    {cartError && <Alert variant="danger" className="mt-3">{cartError}</Alert>}
                </Col>

                <Col className="position-relative z-0" md={5}>
                    <Card className="shadow-lg sticky-top" style={{ top: '100px' }}>
                        <Card.Header className="bg-primary text-white text-center">
                            Riepilogo Configurazione
                        </Card.Header>
                        <Card.Body>
                            <h5 className="text-muted mb-3">{product.name}</h5>

                            <ListGroup variant="flush" className="mb-4 small">
                                <ListGroup.Item className="d-flex justify-content-between">
                                    <span>Prezzo Base</span>
                                    <span className="fw-bold">€{product.basePrice.toFixed(2)}</span>
                                </ListGroup.Item>
                                {Object.keys(currentConfiguration).map(groupName => {
                                    const option = currentConfiguration[groupName];
                                    if (!option) return null;
                                    return (
                                        <ListGroup.Item key={groupName} className="d-flex justify-content-between">
                                            <span className="text-primary">{groupName}:</span>
                                            <span className="fw-bold">{option.optionName}</span>
                                            <span className="text-muted">+{option.priceAdjustment.toFixed(2)}€</span>
                                        </ListGroup.Item>
                                    );
                                })}
                            </ListGroup>

                            <div className="d-flex justify-content-between align-items-center mb-4 border-top pt-3">
                                <h4 className="m-0 text-success">Totale:</h4>
                                <h4 className="m-0 fw-bolder text-success">€{currentPrice.toFixed(2)}</h4>
                            </div>

                            <Form.Group className="mb-3">
                                <Form.Label className="fw-bold">Quantità:</Form.Label>
                                <Form.Control 
                                    type="number"
                                    min="1"
                                    value={quantity}
                                    onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                                />
                            </Form.Group>

                            <Button 
                                variant="success" 
                                size="lg" 
                                className="w-100 py-2" 
                                onClick={handleAddToCart}
                                disabled={!user || isConfigurationInvalid || cartLoading} 
                            >
                                {cartLoading ? (
                                    <>
                                        <Spinner animation="border" size="sm" className="me-2" /> 
                                        Aggiunta...
                                    </>
                                ) : (
                                    <>
                                        <i className="bi bi-cart-plus-fill me-2"></i>
                                        Aggiungi al Carrello
                                    </>
                                )}
                            </Button>
                            
                            {isConfigurationInvalid && (
                                <Alert variant="warning" className="mt-2 p-2 small text-center">
                                    Correggi la configurazione: la selezione attuale non è compatibile!
                                </Alert>
                            )}
                            {!user && (
                                <Alert variant="info" className="mt-2 p-2 small text-center">
                                    <i className="bi bi-info-circle me-1"></i> Effettua il login per procedere con l'acquisto.
                                </Alert>
                            )}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>
        </Container>
    );
};

export default ProductDetailPage;
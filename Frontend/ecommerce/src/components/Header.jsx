import React from 'react';
import { LinkContainer } from 'react-router-bootstrap';
import { Navbar, Container, Nav, NavDropdown, Form, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
 
const Header = () => {
    const isLoggedIn = false; 
    const isAdmin = false; 
    const handleLogout = () => {
        console.log('Eseguendo Logout.');
    }

    return (
        <Navbar bg="dark" variant="dark" expand="lg" collapseOnSelect>
            <Container fluid>
                
                {/*Logo)*/}
                <Navbar.Brand as={Link} to="/">EpiCommerce</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    
                    {/*Menù*/}
                    <Nav className="me-auto">
                        
                        {/* Link Home */}
                        <Nav.Link as={Link} to="/">Home</Nav.Link>
                        
                        {/* Shop*/}
                        <Nav.Link as={Link} to="/shop">Shop</Nav.Link>

                        {/*Post*/}
                        <Nav.Link as={Link} to="/community">Community</Nav.Link>
                        
                        {/*Elenco Prodotti*/}
                        <NavDropdown title="Altro" id="basic-nav-dropdown">
                            <NavDropdown.Item as={Link} to="/novita">Ultime Novità</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/revisionati">Revisionati</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item as={Link} to="/custom">Custom (Su Misura)</NavDropdown.Item>
                        </NavDropdown>
                        
                        {/* ADMIN, visibile solo se: isAdmin è true) */}
                        {isAdmin && (
                            <Nav.Link as={Link} to="/admin/dashboard" className="text-warning">
                                Admin
                            </Nav.Link>
                        )}
                    </Nav>
                    
                    {/* Search Bar */}
                    <Form className="d-flex me-4">
                        <Form.Control
                            type="search"
                            placeholder="Cerca Prodotti..."
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light">Cerca</Button>
                    </Form>

                    {/* Links di Autenticazione e Carrello */}
                    <Nav>
                        {/*Icona*/}
                        <Nav.Link as={Link} to="/carrello">
                               <i className="fas fa-shopping-cart"></i> Carrello
                        </Nav.Link>
                        
                        {isLoggedIn ? (
                            <NavDropdown title="Profilo" id="user-nav-dropdown">
                                <NavDropdown.Item as={Link} to="/profilo">Il mio Profilo</NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/ordini">I miei Ordini</NavDropdown.Item>
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout}>
                                    Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                {/*ACCEDI*/}
                                <Button 
                                    as={Link} 
                                    to="/accedi"
                                    variant="outline-info" 
                                    className="me-2"
                                >
                                    Accedi
                                </Button>
                                
                                {/*REGISTRATI */}
                                <Button 
                                    as={Link} 
                                    to="/registrati"
                                    variant="info"
                                >
                                    Registrati
                                </Button>
                            </>
                        )}
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;

import React from 'react';
import { Navbar, Container, Nav, NavDropdown, Form, Button } from 'react-bootstrap';

const Header = () => {
    return (
        <Navbar bg="dark" variant="dark" expand="lg" className="header-overlay">
            <Container fluid>
                
                {/* Logo */}
                <Navbar.Brand href="#home">EpiCommerce</Navbar.Brand>
                
                {/* mobile toggler */}
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                
                {}
                <Navbar.Collapse id="basic-navbar-nav">
                    
                    {/*menù */}
                    <Nav className="me-auto">
                        <Nav.Link href="#home">Home</Nav.Link>
                        
                        {/* Elenco Prodotti (Menu a tendina) */}
                        <NavDropdown title="Elenco Prodotti" id="basic-nav-dropdown">
                            <NavDropdown.Item href="#novita">Ultime Novità</NavDropdown.Item>
                            <NavDropdown.Item href="#revisionati">Revisionati</NavDropdown.Item>
                            <NavDropdown.Divider />
                            <NavDropdown.Item href="#custom">Custom (Su Misura)</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                    
                    {/* Search Bar (Form) */}
                    <Form className="d-flex me-4">
                        <Form.Control
                            type="search"
                            placeholder="Cerca Prodotti..."
                            className="me-2"
                            aria-label="Search"
                        />
                        <Button variant="outline-light">Cerca</Button>
                    </Form>

                    <Nav>
                        <Nav.Link href="#login">Accedi / Registrati</Nav.Link>
                    </Nav>

                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;

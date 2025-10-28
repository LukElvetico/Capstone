import React from 'react';
import { Navbar, Nav, Container, NavDropdown, Badge } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext.jsx';
import { useCart } from '../CartContext.jsx';
import '../Index.css';

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { cartCount } = useCart(); 

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Navbar bg="blue" variant="dark" expand="lg" sticky="top" className="text-black shadow-lg zindex">
            <Container>
                <Navbar.Brand as={Link} to="/" className="fw-bold">
                    Epi<span className="text-info fst-italic">Commerce</span>
                </Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto">
                        <Nav.Link as={Link} to="/shop"><i className="bi bi-shop me-1"></i>Shop</Nav.Link>
                        <Nav.Link as={Link} to="/community"><i className="bi bi-people me-1"></i>Community</Nav.Link>
                    </Nav>
                    <Nav>
                        <Nav.Link as={Link} to="/carrello" className='d-flex align-items-center'>
                            <i className="bi bi-cart-fill me-1"></i> Carrello 
                            {cartCount > 0 && <Badge pill bg="info" className="ms-1">{cartCount}</Badge>}
                        </Nav.Link>
                        {user ? (
                            <NavDropdown 
                                title={<><i className="bi bi-person-fill z-3 me-1"></i> Account</>} 
                                id="basic-nav-dropdown"
                                align="end"
                            >
                                <NavDropdown.Item as={Link} to="/account">
                                    Ciao, {user.firstName || user.email}!
                                </NavDropdown.Item>
                                <NavDropdown.Item as={Link} to="/ordini">
                                    I Miei Ordini
                                </NavDropdown.Item>
                                {user.isAdmin && (
                                    <NavDropdown.Item as={Link} to="/admin/upload" className='text-success'>
                                        <i className="bi bi-tools me-1"></i> Dashboard Admin
                                    </NavDropdown.Item>
                                )}
                                <NavDropdown.Divider />
                                <NavDropdown.Item onClick={handleLogout} className="text-danger">
                                    <i className="bi bi-box-arrow-right me-1"></i> Logout
                                </NavDropdown.Item>
                            </NavDropdown>
                        ) : (
                            <>
                                <Nav.Link as={Link} to="/login">Accedi</Nav.Link>
                                <Nav.Link as={Link} to="/register">Registrati</Nav.Link>
                            </>
                        )}
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;
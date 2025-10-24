import React from 'react'; 
import { Routes, Route, Navigate, Outlet, Link, useLocation, useParams } from 'react-router-dom';
// react-bootstrap
import Container from 'react-bootstrap/Container'; 
import Spinner from 'react-bootstrap/Spinner';
import Alert from 'react-bootstrap/Alert';
import Badge from 'react-bootstrap/Badge';
// contexts
import { AuthProvider, useAuth } from './AuthContext'; 
import { CartProvider } from './CartContext'; 
// components
import Header from './components/Header';
import Footer from './components/Footer';
import HomePage from './components/HomePage'; 
import ShopPage from './components/ShopPage';
import ProductDetailPage from './components/ProductDetailPage'; 
import LoginPage from './components/LoginPage';
import RegisterPage from './components/RegisterPage';
import CartPage from './components/CartPage';
import CommunityPage from './components/CommunityPage';
// protected pages
import AccountPage from './components/AccountPage';
import OrdersPage from './components/OrdersPage'; 
// protected admin page
import ProductUploadPage from './components/ProductUploadPage';

// placeholder component for OrderDetailPage
const OrderDetailPage = () => <Container className="my-5"><Alert variant="info">Pagina **Dettaglio Ordine** (ID: {useParams().id}) in costruzione.</Alert></Container>; 

const ProtectedRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <Container className="text-center my-5 p-5"><Spinner animation="border" /></Container>;
    return user ? <Outlet /> : <Navigate to="/login" replace />;
};

const AdminRoute = () => {
    const { user, loading } = useAuth();
    if (loading) return <Container className="text-center my-5 p-5"><Spinner animation="border" /></Container>;
    return user && user.isAdmin ? <Outlet /> : <Navigate to={user ? "/account" : "/login"} replace />;
};

function App() {
    return (
        <AuthProvider>
            <CartProvider>
                <div className="d-flex flex-column min-vh-100">
                    
                    <Header />
                    
                    <main className="flex-grow-1">
                        <Container>
                            <Routes>
                                <Route path="/" element={<HomePage />} />
                                <Route path="/shop" element={<ShopPage />} />
                                <Route path="/shop/:id" element={<ProductDetailPage />} />
                                <Route path="/carrello" element={<CartPage />} />
                                <Route path="/community" element={<CommunityPage />} />
                                <Route path="/login" element={<ProtectedRedirect element={<LoginPage />} redirectTo="/account" />} />
                                <Route path="/register" element={<ProtectedRedirect element={<RegisterPage />} redirectTo="/account" />} />
                                <Route element={<ProtectedRoute />}>
                                    <Route path="/account/*" element={<AccountPage />} /> 
                                    <Route path="/ordini" element={<OrdersPage />} />
                                    <Route path="/ordini/:id" element={<OrderDetailPage />} />
                                    
                                </Route>
                                <Route element={<AdminRoute />}>
                                    <Route path="/admin/upload" element={<ProductUploadPage />} /> 
                                </Route>
                                <Route path="*" element={
                                    <Container className="mt-5 text-center p-5 bg-white rounded shadow-sm">
                                        <h1 className="display-1 fw-bolder text-primary">404</h1>
                                        <p className="lead">Pagina non trovata!</p>
                                        <Link to="/" className="btn btn-outline-primary mt-3">Torna alla Home</Link>
                                    </Container>
                                } />
                                
                            </Routes>
                        </Container>
                    </main>
                    
                    <Footer /> 

                </div>
            </CartProvider>
        </AuthProvider>
    );
}

const ProtectedRedirect = ({ element, redirectTo = "/" }) => {
    const { user, loading } = useAuth();
    if (loading) return <Container className="text-center my-5 p-5"><Spinner animation="border" /></Container>;
    return user ? <Navigate to={redirectTo} replace /> : element;
};

export default App;

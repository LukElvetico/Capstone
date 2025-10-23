import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 
import { useAuth } from './AuthContext.jsx'; 

const CartContext = createContext(null); 

export const useCart = () => {
    const context = useContext(CartContext);
    if (context === null) {
        throw new Error("useCart deve essere utilizzato all'interno di un CartProvider");
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const { user, loading: authLoading } = useAuth();
    
    const [cart, setCart] = useState(null); 
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const fetchCart = useCallback(async () => {
        if (!user || authLoading) {
            setCart(null); 
            return;
        }

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.get('/cart');
            setCart(response.data.cart);
        } catch (err) {
            console.error("Errore recupero carrello:", err);
        } finally {
            setLoading(false);
        }
    }, [user, authLoading]);

    useEffect(() => {
        fetchCart();
    }, [fetchCart]);

    const addItemToCart = useCallback(async (product, configuration, quantity) => {
        if (!user) {
            setError("Devi effettuare il login per aggiungere articoli al carrello.");
            return false;
        }

        setLoading(true);
        setError(null);
        
        const payload = {
            productId: product._id,
            quantity: quantity,
            configuration: configuration, 
        };
        
        try {
            const response = await axios.post('/cart', payload); 

            setCart(response.data.cart); 
            return true;
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || `Errore aggiunta carrello: ${err.message}`;
            setError(errorMessage);
            console.error("Errore aggiunta carrello:", err); 
            return false;
        } finally {
            setLoading(false);
        }
    }, [user]);

    const updateItemQuantity = useCallback(async (itemId, newQuantity) => {
        if (!user || !cart) return false;

        setLoading(true);
        setError(null);

        try {
            const response = await axios.put(`/cart/${itemId}`, { quantity: newQuantity });

            setCart(response.data.cart);
            return true;
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Impossibile aggiornare la quantità.";
            setError(errorMessage);
            console.error("Errore update quantità:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [user, cart]);

    const removeItemFromCart = useCallback(async (itemId) => {
        if (!user || !cart) return false;

        setLoading(true);
        setError(null);
        
        try {
            const response = await axios.delete(`/cart/${itemId}`);

            setCart(response.data.cart);
            return true;
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || "Impossibile rimuovere l'articolo.";
            setError(errorMessage);
            console.error("Errore rimozione carrello:", err);
            return false;
        } finally {
            setLoading(false);
        }
    }, [user, cart]);

    const cartCount = cart?.items.reduce((total, item) => total + item.quantity, 0) || 0; 
    const cartTotal = cart?.totalPrice || 0;

    const contextValue = {
        cart,
        cartCount,
        cartTotal,
        loading,
        error,
        addItemToCart,
        updateItemQuantity,
        removeItemFromCart,
        fetchCart,
    };

    return (
        <CartContext.Provider value={contextValue}>
            {children}
        </CartContext.Provider>
    );
};
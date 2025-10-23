import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios'; 

const API_URL = 'http://localhost:4000/api'; 
axios.defaults.baseURL = API_URL;

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth deve essere utilizzato all'interno di un AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); 
    const [loading, setLoading] = useState(true); 
    const [error, setError] = useState(null);
    const saveAuthData = (userData, token) => {
        const userDataToSave = {
            _id: userData._id,
            email: userData.email,
            firstName: userData.firstName,
            lastName: userData.lastName,
            isAdmin: userData.isAdmin, 
            hasPurchased: userData.hasPurchased,
            token: token,
        };
        setUser(userDataToSave);
        localStorage.setItem('user', JSON.stringify(userDataToSave));
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    };

    const clearAuthData = () => {
        setUser(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        delete axios.defaults.headers.common['Authorization'];
    };
    
    useEffect(() => {
        const userJson = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        
        if (userJson && token) {
            const userData = JSON.parse(userJson);
          
            setUser({ ...userData, token }); 
            axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        }
        setLoading(false);
    }, []);


    const login = useCallback(async (email, password) => {
        setLoading(true);
        setError(null);
        try {
            const response = await axios.post('/login', { email, password });
            const { token, ...userData } = response.data;
            
            saveAuthData(userData, token);
            
            return { success: true };
            
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Login fallito. Verifica le credenziali.';
            setError(errorMessage);
            clearAuthData();
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [saveAuthData]);

    const register = useCallback(async (firstName, lastName, email, password) => {
        setLoading(true);
        setError(null);
        try {
            const registrationData = { firstName, lastName, email, password };
            const response = await axios.post('/register', registrationData);
            const { token, ...userData } = response.data;
            
            saveAuthData(userData, token);
            
            return { success: true };
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Registrazione fallita. Email forse già in uso.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    }, [saveAuthData]);
    
    
    const updateProfile = async (profileData) => {
        setLoading(true);
        setError(null);

        try {
            const response = await axios.put('/users/me', profileData);
            const updatedUserData = response.data; 
            const existingToken = localStorage.getItem('token'); 
            
            saveAuthData(updatedUserData, existingToken); 

            return { success: true, message: "Profilo aggiornato con successo." };

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Aggiornamento fallito. Riprova.';
            setError(errorMessage);
            return { success: false, error: errorMessage };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        clearAuthData();
        console.log('Logout effettuato.');
    };

    const value = {
        user,
        loading,
        error,
        login,
        logout,
        register,
        updateProfile,
    };

    if (loading) {
        return <div className="flex items-center justify-center min-h-screen">Caricamento autenticazione...</div>;
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
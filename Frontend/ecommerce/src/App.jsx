import { useState, useEffect } from 'react'; 
import { Routes, Route, Link } from 'react-router-dom'; 

const Header = () => {
    return (
        <header className="bg-gray-800 text-white shadow-lg p-4">
            <div className="container mx-auto flex justify-between items-center">
                <Link to="/" className="text-2xl font-bold text-yellow-400 hover:text-yellow-300 transition duration-300">
                    EpiCommerce
                </Link>
                <nav className="space-x-4">
                    <Link to="/shop" className="hover:text-yellow-400">Shop</Link>
                    <Link to="/community" className="hover:text-yellow-400">Community</Link>
                    <Link to="/carrello" className="hover:text-yellow-400">Carrello</Link>
                </nav>
                <div className="space-x-3">
                    {/*Autenticazione */}
                    <Link 
                        to="/registrati" 
                        className="bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Registrati
                    </Link>
                    <Link 
                        to="/accedi" 
                        className="border border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-gray-900 font-semibold py-2 px-4 rounded-lg transition duration-300"
                    >
                        Accedi
                    </Link>
                </div>
            </div>
        </header>
    );
};


const RegisterPage = () => {
    const [formData, setFormData] = useState({ 
        firstName: '', 
        lastName: '', 
        email: '', 
        password: '', 
        confirmPassword: '' 
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Dati di registrazione inviati:', formData);
        alert('Simulazione ok'); 
    };

    return (
        <div className="min-h-screen flex items-start justify-center pt-12 bg-gray-100 p-4">
            <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-lg">
                <h1 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Crea il tuo Account</h1>
                <p className="text-center text-gray-600 mb-8">Unisciti alla community di EpiCommerce in pochi passi.</p>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Nome */}
                        <input 
                            type="text" 
                            name="firstName" 
                            placeholder="Nome"
                            value={formData.firstName}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                        />
                        {}
                        <input 
                            type="text" 
                            name="lastName" 
                            placeholder="Cognome"
                            value={formData.lastName}
                            onChange={handleChange}
                            required
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                        />
                    </div>

                    {/* Email */}
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    />

                    {/* Password */}
                    <input 
                        type="password" 
                        name="password" 
                        placeholder="Password (min 8 caratteri)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        minLength="8"
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    />

                    {/* Conferma Password */}
                    <input 
                        type="password" 
                        name="confirmPassword" 
                        placeholder="Conferma Password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        className="w-full p-3 border border-gray-300 rounded-lg focus:ring-yellow-500 focus:border-yellow-500"
                    />

                    {/* Pulsante di Registrazione */}
                    <button 
                        type="submit"
                        className="w-full bg-yellow-500 hover:bg-yellow-600 text-gray-900 font-bold py-3 px-4 rounded-lg transition duration-300 text-lg shadow-md hover:shadow-lg"
                    >
                        Registrati
                    </button>
                </form>

                <p className="text-center text-sm text-gray-500 mt-6">
                    Hai già un account? <Link to="/accedi" className="text-yellow-600 font-semibold hover:underline">Accedi qui</Link>
                </p>
            </div>
        </div>
    );
};


// Placeholder
const HomePage = ({ message }) => (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h2 className="text-2xl font-bold mb-4">Stato Backend</h2>
        <p className="p-3 bg-blue-100 text-blue-800 rounded-lg font-mono">{message}</p>
        <hr className="my-6"/>
        <h1 className="text-4xl font-extrabold text-gray-800">Benvenuto in EpiCommerce!</h1>
        <p className="text-gray-600 mt-2">Inizia esplorando lo shop.</p>
    </div>
);
const LoginPage = () => (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Pagina di Accesso (Da Implementare)</h1>
    </div>
);
const ShopPage = () => (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Shop (Placeholder)</h1>
    </div>
);
const CommunityPage = () => (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Community (Placeholder)</h1>
    </div>
);
const CartPage = () => (
    <div className="container mx-auto mt-8 p-6 bg-white rounded-xl shadow-lg">
        <h1 className="text-3xl font-extrabold text-center text-gray-800">Carrello (Placeholder)</h1>
    </div>
);


const App = () => {
    //Tailwind CSS > apprfondisci
    useEffect(() => {
        const script = document.createElement('script');
        script.src = "https://cdn.tailwindcss.com";
        document.head.appendChild(script);
    }, []);

    const [backendMessage, setBackendMessage] = useState('Verifica connessione in corso...');

    useEffect(() => {
        fetch('http://localhost:4000/') 
            .then(response => response.json())
            .then(data => setBackendMessage(data.message))
            .catch(error => setBackendMessage('❌ Errore: Impossibile connettersi al backend (Node.js).'));
    }, []);

    return (
        <div className="App min-h-screen bg-gray-50">
            {/* Header visualizzato su tutte le pagine */}
            <Header /> 
            
            <main className="container mx-auto p-4">
                <Routes>
                    
                    {/* Rotta Home */}
                    <Route 
                        path="/" 
                        element={<HomePage message={backendMessage} />} 
                    />
                    
                    {/* Rotte Navigazione */}
                    <Route path="/shop" element={<ShopPage />} />
                    <Route path="/community" element={<CommunityPage />} />
                    <Route path="/carrello" element={<CartPage />} />

                    {/* Rotte Autenticazione */}
                    <Route path="/registrati" element={<RegisterPage />} /> 
                    <Route path="/accedi" element={<LoginPage />} /> 
                    
                </Routes>
            </main>
        </div>
    );
}

export default App;
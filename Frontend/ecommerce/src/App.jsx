import { useState, useEffect } from 'react'; 
import './App.css'; 
import Header from './components/Header.jsx';
import reactLogo from './assets/react.svg'; 
import viteLogo from '/vite.svg';


const App = () => {
    const [message, setMessage] = useState('Loading...');

    useEffect(() => {
        fetch('http://localhost:4000/') 
            .then(response => response.json())
            .then(data => setMessage(data.message))
            .catch(error => setMessage('Error connecting to backend: ' + error.message));
    }, []);

    return (
        <div>
            <Header /> 
            <div style={{ padding: '20px' }}>
                <h1>Frontend Status:</h1>
                <p>{message}</p>
                {/* Logo ecc*/}
            </div>
        </div>
    );
}

export default App;
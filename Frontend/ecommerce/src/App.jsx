import { useState,useEffect} from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [message, setMessage] = useState('Loading...');

  useEffect(() => {
    // chiama il backend
    fetch('http://localhost:4000/') 
      .then(response => response.json())
      .then(data => setMessage(data.message))
      .catch(error => setMessage('Error connecting to backend: ' + error.message));
  }, []);

  return (
    <div>
      <h1>Frontend Status:</h1>
      <p>{message}</p>
    </div>
  );
}

export default App

import express from 'express';
import cors from 'cors';
// da finire gli import

const app = express();

// CORS
const corsOptions = {
    // origine
    origin: 'http://localhost:5173', 
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // per cookie/headers di autenticazione
    optionsSuccessStatus: 204
};

// middlewares
app.use(cors(corsOptions));

app.use(express.json()); 
// da finire

// Rotte
app.get('/', (req, res) => {
    res.json({ message: "Backend is running!" });
});

// Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
    console.log(`Il server è online alla porta ${PORT}`);
});
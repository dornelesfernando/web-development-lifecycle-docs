import express from 'express';
import cors from 'cors'
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares 
app.use(express.json());
app.use(cors());


// Rota de teste
app.get('/', (req, res) => {
    res.send('Hello, World. Está funcional');
});

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
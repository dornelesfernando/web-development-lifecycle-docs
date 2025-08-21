import express from 'express';
import cors from 'cors';
import 'express-async-errors';

// Routes
import employeeRoutes from './routes/employeeRoutes';

// Middleware
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();

// Middlewares 
app.use(cors());
app.use(express.json());

// Rota de teste
app.get('/', (req, res) => {
    res.send('Hello, World. Está funcional');
});

app.use('/employees', employeeRoutes);

app.use(errorMiddleware);

export default app;
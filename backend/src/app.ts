import express from 'express';
import cors from 'cors';
import 'express-async-errors';

// Routes
import mainRouter from './routes/index';

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

app.use('/api', mainRouter);

app.use(errorMiddleware);

export default app;
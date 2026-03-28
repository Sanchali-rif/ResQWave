import express from 'express';
import cors from 'cors';
import sosRoutes from './routes/sosRoutes.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/sos', sosRoutes);

// Error Handling Middleware
app.use(errorHandler);

export default app;

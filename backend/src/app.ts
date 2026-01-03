import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import config from './shared/config';
import routes from './routes';
import { errorHandler } from './shared/middlewares/errorHandler';

const app: Application = express();

// Middleware
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (_req, res) => {
    res.status(200).json({ status: 'OK', message: 'Server is running' });
});

// API Routes
app.use('/api', routes);

// Error handling middleware (should be last)
app.use(errorHandler);

export default app;

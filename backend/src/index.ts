import 'dotenv/config';
import express from 'express';
import { z } from 'zod';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import listingRoutes from './routes/listings';
import roomRoutes from './routes/rooms';
import bookingRoutes from './routes/bookings';
import paymentRoutes from './routes/payments';

dotenv.config();

const app = express();
if (process.env.NODE_ENV === 'production') app.set('trust proxy', 1);
const port = process.env.PORT || 5000;

app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/listings', listingRoutes);
app.use('/api/v1', roomRoutes);
app.use('/api/v1/bookings', bookingRoutes);
app.use('/api/v1/payments', paymentRoutes);

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Central error handler
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error(err);
  if (err instanceof z.ZodError) {
    return res.status(400).json({ message: 'Validation error', errors: err.errors });
  }
  if (err?.code === 'P2025') {
    return res.status(404).json({ message: 'Not found' });
  }
  if (err?.code === 'P2002') {
    return res.status(409).json({ message: 'Conflict' });
  }
  if (err?.code === 'P2003') {
    return res.status(409).json({ message: 'cannot delete: related records exist' });
  }
  return res.status(500).json({ message: 'Internal server error' });
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});




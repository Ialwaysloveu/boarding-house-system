import express from 'express';
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

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

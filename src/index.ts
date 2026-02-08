import express, { Express } from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import connectDB from './config/db';
import authRoutes from './routes/userRouter';
import deviceRoutes from './routes/deviceRouter';
import ticketsRoutes from './routes/ticketRouter';
import paymentCardRoutes from './routes/paymentCardRouter';

dotenv.config();

const app: Express = express();
const PORT = process.env.PORT || 3000;

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: 'Too many requests, please try again later.' },
});
app.use(limiter);

app.use(
  cors({
    origin: '*',
    methods: 'GET,POST,PUT,DELETE',
  }),
);
app.use(express.json({ limit: '10mb' }));
app.use('/api/auth', authRoutes);
app.use('/api/devices', deviceRoutes);
app.use('/api/tickets', ticketsRoutes);
app.use('/api/paymentCards', paymentCardRoutes);

const startServer = async () => {
  try {
    await connectDB();
    console.log('MongoDB connected');

    app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
  } catch (error) {
    console.error('Database connection error', error);
    process.exit(1);
  }
};

startServer();

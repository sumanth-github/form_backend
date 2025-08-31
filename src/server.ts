// ✅ Load environment variables FIRST, before any other imports
import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import reportRoutes from './routes/reportRoutes';

import aiRoutes from './routes/aiRoutes';
import productRoutes from './routes/productRoutes';

const app = express();

app.use(cors({
  origin: "https://form-frontend-ochre.vercel.app/",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));

const PORT = process.env.PORT || 5000;

// ✅ Middleware to parse JSON
app.use(express.json());
app.use('/api/reports', reportRoutes);

// ✅ Mount routes
app.use('/api/ai', aiRoutes);
app.use('/api/products', productRoutes);

app.get('/', (req, res) => {
  res.send('API is running...');
});

async function startServer() {
  try {
    await mongoose.connect(process.env.MONGO_URI as string);
    console.log('✅ MongoDB Connected');
    app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
  } catch (err) {
    console.error('❌ MongoDB Connection Failed:', err);
    process.exit(1);
  }
}

startServer();

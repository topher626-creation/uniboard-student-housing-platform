import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import propertyRoutes from './routes/properties';
import adminRoutes from './routes/admin';
import searchRoutes from './routes/search';
import landlordRoutes from './routes/landlord';
import uploadRoutes from './routes/upload';
import path from 'path';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/properties', propertyRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/search', searchRoutes);
app.use('/api/landlord', landlordRoutes);
app.use('/api/upload', uploadRoutes);

app.get('/api/health', (req, res) => {

  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.listen(PORT, () => {
  console.log(`🚀 UniBoard API running on http://localhost:${PORT}`);
});

export default app;


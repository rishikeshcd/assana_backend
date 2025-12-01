import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import connectDB, { checkConnection } from './db.js';
import homeRoutes from './routes/homeRoutes.js';
import aboutRoutes from './routes/aboutRoutes.js';
import servicesRoutes from './routes/servicesRoutes.js';
import contactRoutes from './routes/contactRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';
import analFistulaRoutes from './routes/analFistulaRoutes.js';
import pelvicFloorRoutes from './routes/pelvicFloorRoutes.js';
import pilesRoutes from './routes/pilesRoutes.js';
import productRoutes from './routes/productRoutes.js';
import commonRoutes from './routes/commonRoutes.js';

dotenv.config();

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API Routes
app.use('/api/home', homeRoutes);
app.use('/api/about', aboutRoutes);
app.use('/api/services', servicesRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/uploads', uploadRoutes);
app.use('/api/anal-fistula', analFistulaRoutes);
app.use('/api/pelvic-floor', pelvicFloorRoutes);
app.use('/api/piles', pilesRoutes);
app.use('/api/product', productRoutes);
app.use('/api/common', commonRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  const dbStatus = checkConnection();
  res.json({ 
    status: 'OK', 
    message: 'Assaana CMS Backend is running',
    database: {
      connected: dbStatus.isConnected,
      state: dbStatus.state,
      readyState: dbStatus.readyState
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!', message: err.message });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

// Connect to MongoDB and start server
const startServer = async () => {
  try {
    console.log('🚀 Starting server...');
    await connectDB();
    
    // Verify connection before starting server
    const dbStatus = checkConnection();
    if (!dbStatus.isConnected) {
      throw new Error('Database connection failed - server not started');
    }
    
    app.listen(PORT, () => {
      console.log('\n✅ Server started successfully!');
      console.log(`   Server running on port ${PORT}`);
      console.log(`   API base URL: http://localhost:${PORT}/api`);
      console.log(`   Health check: http://localhost:${PORT}/api/health`);
      console.log(`   Uploads served at: http://localhost:${PORT}/uploads`);
      console.log(`   Database status: ${dbStatus.state}\n`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    console.error('   Full error:', error);
    process.exit(1);
  }
};

startServer();

/* 
  AUTHENTICATION MIDDLEWARE (Add when implementing auth)
  
  import jwt from 'jsonwebtoken';
  
  const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ error: 'Access token required' });
    }
    
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ error: 'Invalid or expired token' });
      }
      req.user = user;
      next();
    });
  };
  
  // Apply to PUT routes:
  router.put('/banner', authenticateToken, async (req, res) => { ... });
*/


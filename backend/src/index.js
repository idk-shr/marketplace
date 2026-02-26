import express from 'express';
import helmet from 'helmet';
import dotenv from 'dotenv';
import corsMiddleware from './middleware/cors.js';
import marketplaceRoutes from './routes/marketplace.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(corsMiddleware);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'marketplace-backend'
  });
});

// API routes
app.use('/api/marketplace', marketplaceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Kapogian Farm Marketplace API',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      marketplace: '/api/marketplace',
      inventory: '/api/marketplace/inventory/:address',
      admin: '/api/marketplace/admin/:address',
      mint: 'POST /api/marketplace/mint',
      list: 'POST /api/marketplace/list',
      buy: 'POST /api/marketplace/buy',
      cancel: 'POST /api/marketplace/cancel'
    }
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Kapogian Farm Marketplace API running on port ${PORT}`);
  console.log(`📖 API documentation: http://localhost:${PORT}`);
  console.log(`🔍 Health check: http://localhost:${PORT}/health`);
});

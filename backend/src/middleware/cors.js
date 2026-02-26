import cors from 'cors';

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests from your frontend
    const allowedOrigins = [
      'http://localhost:5173',  // Vite default port
      'http://localhost:3000',  // Common React port
      'http://127.0.0.1:5173',
      'http://127.0.0.1:3000'
    ];
    
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200
};

export default cors(corsOptions);

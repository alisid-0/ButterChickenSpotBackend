import cors from 'cors';

const corsOptions = {
  origin: '*', // Be more restrictive in production
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

export const corsMiddleware = cors(corsOptions); 
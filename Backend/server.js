import express from 'express';
import dotenv from 'dotenv';
import mySqlConnection from './Config/db.js';
import router from './routes/route.js';
import adminRouter from './routes/adminRoute.js'; // Make sure this import path is correct
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config();

const port = process.env.PORT || 5000;

const app = express();
app.use(cookieParser());

// CORS configuration
app.use(cors({
  origin: 'http://localhost:5173',
  credentials: true
}));

// Middleware for parsing request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Main application routes
app.use('/api', router);

// Admin routes - mounted under /api/admin
app.use('/api/admin', adminRouter);

// Error handling middleware (add this after all routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

// Server startup
app.listen(port, async () => {
  try {
    await mySqlConnection.query('SELECT 1');
    console.log(`Server is running on port ${port} and DB is connected`);
  } catch (error) {
    console.error('DB connection failed:', error.message);
  }
});
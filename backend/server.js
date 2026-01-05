import 'dotenv/config';
import cors from 'cors';
import express from 'express';
import { connectDB } from './repository/db/db_connection.js';
import authRoutes from './routes/auth.js';

const PORT = process.env.SERVER_PORT || 3001;

// Connect to the database
await connectDB();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
// app.use('/api/messages', messageRoutes);
// app.use('/api/users', userRoutes);
app.use('/api/auth', authRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'Backend server is running successfully!',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    message: `The route ${req.originalUrl} does not exist on this server`
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    error: 'Something went wrong!',
    message: err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import connectDB from '../config/db';

const app = express();
connectDB();

app.get('/api/auth/test', (req, res) => {
  res.status(200).json({ message: 'Auth API is working!' });
});

export default app;

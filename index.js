const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ─── Middleware ───────────────────────────────────────────────
app.use(cors({ origin: '*' }));                  // Allow requests from your frontend
app.use(express.json());               // Parse JSON bodies

// ─── Routes ──────────────────────────────────────────────────
const scoresRouter = require('./routes/scores');
app.use('/api/scores', scoresRouter);

// Health check
app.get('/', (req, res) => {
  res.json({ message: '🚀 SnapQuiz API is running!' });
});

// ─── Connect to MongoDB & Start Server ───────────────────────
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('✅ MongoDB connected');
    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  });

const express = require('express');
const router = express.Router();
const Score = require('../models/Score');

// POST /api/scores — Save a new score
router.post('/', async (req, res) => {
  try {
    const { name, score, total } = req.body;

    // Basic validation
    if (!name || score === undefined || !total) {
      return res.status(400).json({ error: 'name, score and total are required' });
    }

    const accuracy = Math.round((score / total) * 100);

    const newScore = new Score({ name, score, total, accuracy });
    await newScore.save();

    res.status(201).json({ message: 'Score saved!', data: newScore });
  } catch (err) {
    console.error('POST /api/scores error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/scores — Get top 10 scores (leaderboard)
router.get('/', async (req, res) => {
  try {
    const scores = await Score.find()
      .sort({ score: -1, createdAt: 1 }) // highest score first, earlier date breaks ties
      .limit(10)
      .select('name score total accuracy createdAt');

    res.status(200).json({ data: scores });
  } catch (err) {
    console.error('GET /api/scores error:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;

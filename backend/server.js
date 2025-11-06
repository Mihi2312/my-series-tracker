// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const Series = require('./models/Series');

const app = express();
app.use(cors());
app.use(express.json());

// ✅ Connect to MongoDB Atlas
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Connected to MongoDB Atlas'))
.catch(err => console.error('❌ MongoDB connection error:', err));

// -------------------- API ROUTES --------------------

// Get all series (supports filters)
app.get('/api/series', async (req, res) => {
  try {
    const { platform, status } = req.query;
    const query = {};
    if (platform) query.platform = platform;
    if (status) query.status = status;
    const series = await Series.find(query).sort({ _id: -1 });
    res.json(series);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Add new series
app.post('/api/series', async (req, res) => {
  try {
    const { name, platform, status } = req.body;
    if (!name) return res.status(400).json({ error: 'Series name required' });
    const newSeries = new Series({ name, platform, status });
    await newSeries.save();
    res.status(201).json(newSeries);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update series status
app.put('/api/series/:id', async (req, res) => {
  try {
    const { status } = req.body;
    const updated = await Series.findByIdAndUpdate(req.params.id, { status }, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete a series
app.delete('/api/series/:id', async (req, res) => {
  try {
    await Series.findByIdAndDelete(req.params.id);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// -----------------------------------------------------

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
app.get("/", (req, res) => {
    res.send("Backend is working!");
});
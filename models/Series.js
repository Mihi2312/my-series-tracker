// backend/models/Series.js
const mongoose = require('mongoose');

const SeriesSchema = new mongoose.Schema({
  name: { type: String, required: true },
  platform: { type: String, required: true },
  status: { type: String, required: true },
  dateAdded: { type: String, default: () => new Date().toLocaleDateString() }
});

module.exports = mongoose.model('Series', SeriesSchema);

// backend/server.js
const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3000;

const words = require('./words.json');

app.use(cors());

// Endpoint to get today's word
app.get('/word/today', (req, res) => {
  res.json(words[0]); // just return the first word for now
});

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});

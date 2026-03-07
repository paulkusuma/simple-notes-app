const express = require('express');
const cors = require('cors');
const { initDB } = require('./db');
const notesRouter = require('./routes/notes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/notes', notesRouter);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'Simple Notes Backend' });
});

initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Backend berjalan di http://localhost:${PORT}`);
  });
});

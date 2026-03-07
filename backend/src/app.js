const express = require('express');
const cors = require('cors');
const itemRoutes = require('./routes/itemRoutes');
const { initDB } = require('./models/database');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Mengizinkan request dari frontend
app.use(express.json()); // Untuk membaca body JSON

// Routes
app.use('/api', itemRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'Backend service is running' });
});

// Inisialisasi database dan jalankan server
initDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server berjalan di http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Gagal menginisialisasi database', err);
  process.exit(1);
});

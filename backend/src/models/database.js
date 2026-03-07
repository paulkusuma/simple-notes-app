const { Pool } = require('pg');

// Konfigurasi koneksi database
// Sesuaikan dengan konfigurasi PostgreSQL lokal Anda
const pool = new Pool({
  host: 'localhost',
  port: 5432,
  database: 'appdb',
  user: 'appuser',
  password: 'apppassword',
});

// Fungsi untuk membuat tabel jika belum ada
const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS items (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    console.log('Database dan tabel berhasil diinisialisasi');
    return true;
  } catch (error) {
    console.error('Error saat menginisialisasi database:', error);
    return false;
  }
};

// Fungsi helper untuk menjalankan query
const query = async (text, params) => {
  const start = Date.now();
  try {
    const res = await pool.query(text, params);
    const duration = Date.now() - start;
    console.log('Query dieksekusi', { text, duration, rows: res.rowCount });
    return res;
  } catch (error) {
    console.error('Error saat mengeksekusi query', { text, error });
    throw error;
  }
};

module.exports = {
  query,
  initDB
};

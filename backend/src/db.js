const { Pool } = require('pg');

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME || 'notesdb',
  user: process.env.DB_USER || 'notesuser',
  password: process.env.DB_PASSWORD || 'notespassword',
});

const initDB = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS notes (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        content TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('Tabel "notes" berhasil diinisialisasi atau sudah ada.');
  } catch (error) {
    console.error('Gagal menginisialisasi database:', error);
  }
};

module.exports = { pool, initDB };

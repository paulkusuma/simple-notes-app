const express = require('express');
const db = require('../db'); // Mengimpor modul db.js yang berisi fungsi query

const router = express.Router();

// GET semua notes
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM notes ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    console.error("DEBUG ERROR GET ALL:", err);
    res.status(500).json({ error: 'Gagal mengambil data', details: err.message });
  }
});

// GET note berdasarkan ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('SELECT * FROM notes WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DEBUG ERROR GET BY ID:", err);
    res.status(500).json({ error: 'Gagal mengambil data', details: err.message });
  }
});

// POST (buat) note baru
router.post('/', async (req, res) => {
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title wajib diisi' });
  }

  try {
    const result = await db.query(
      'INSERT INTO notes (title, content) VALUES ($1, $2) RETURNING *',
      [title, content]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("DEBUG ERROR POST:", err);
    res.status(500).json({ error: 'Gagal membuat note', details: err.message });
  }
});

// PUT (update) note
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Title wajib diisi' });
  }

  try {
    const result = await db.query(
      'UPDATE notes SET title = $1, content = $2 WHERE id = $3 RETURNING *',
      [title, content, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note tidak ditemukan' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("DEBUG ERROR PUT:", err);
    res.status(500).json({ error: 'Gagal mengupdate note', details: err.message });
  }
});

// DELETE note
router.delete('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query('DELETE FROM notes WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Note tidak ditemukan' });
    }
    res.json({ message: 'Note berhasil dihapus' });
  } catch (err) {
    console.error("DEBUG ERROR DELETE:", err);
    res.status(500).json({ error: 'Gagal menghapus note', details: err.message });
  }
});

module.exports = router;

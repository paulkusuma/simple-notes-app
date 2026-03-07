const express = require('express');
const router = express.Router();
const { query } = require('../models/database');

// GET semua item
router.get('/items', async (req, res) => {
  try {
    const result = await query('SELECT * FROM items ORDER BY created_at DESC');
    res.status(200).json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// GET item berdasarkan ID
router.get('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('SELECT * FROM items WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item tidak ditemukan' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// POST (buat) item baru
router.post('/items', async (req, res) => {
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nama item harus diisi' });
  }
  try {
    const result = await query(
      'INSERT INTO items (name, description) VALUES ($1, $2) RETURNING *',
      [name, description]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// PUT (update) item
router.put('/items/:id', async (req, res) => {
  const { id } = req.params;
  const { name, description } = req.body;
  if (!name) {
    return res.status(400).json({ error: 'Nama item harus diisi' });
  }
  try {
    const result = await query(
      'UPDATE items SET name = $1, description = $2 WHERE id = $3 RETURNING *',
      [name, description, id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item tidak ditemukan' });
    }
    res.status(200).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

// DELETE item
router.delete('/items/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await query('DELETE FROM items WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item tidak ditemukan' });
    }
    res.status(200).json({ message: 'Item berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
});

module.exports = router;

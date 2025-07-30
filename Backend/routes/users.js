const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE user
router.post('/', (req, res) => {
  const {
    userId, name, email, phoneNumber, gender,
    role, supervisor, creationTime, lastSignInTime
  } = req.body;

  const query = `
    INSERT INTO users (userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [userId, name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'User created' });
  });
});

// GET all users
router.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET user by ID
router.get('/:userId', (req, res) => {
  db.query('SELECT * FROM users WHERE userId = ?', [req.params.userId], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// UPDATE user
router.put('/:userId', (req, res) => {
  const {
    name, email, phoneNumber, gender, role,
    supervisor, creationTime, lastSignInTime
  } = req.body;

  const query = `
    UPDATE users
    SET name=?, email=?, phoneNumber=?, gender=?, role=?, supervisor=?, creationTime=?, lastSignInTime=?
    WHERE userId=?
  `;

  db.query(query, [name, email, phoneNumber, gender, role, supervisor, creationTime, lastSignInTime, req.params.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User updated' });
  });
});

// DELETE user
router.delete('/:userId', (req, res) => {
  db.query('DELETE FROM users WHERE userId=?', [req.params.userId], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'User deleted' });
  });
});

module.exports = router;

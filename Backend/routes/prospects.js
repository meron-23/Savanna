const express = require('express');
const router = express.Router();
const db = require('../db');

// CREATE prospect
router.post('/', (req, res) => {
  const {
    name, phoneNumber, phoneNumber_normalized,
    interest, method, site, comment, remark,
    periodTime, date, dateNow, userId
  } = req.body;

  const query = `
    INSERT INTO prospects (
      name, phoneNumber, phoneNumber_normalized,
      interest, method, site, comment, remark,
      periodTime, date, dateNow, userId
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  db.query(query, [
    name, phoneNumber, phoneNumber_normalized,
    interest, method, site, comment, remark,
    periodTime, date, dateNow, userId
  ], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.status(201).json({ message: 'Prospect created' });
  });
});

// GET all prospects
router.get('/', (req, res) => {
  db.query('SELECT * FROM prospects', (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results);
  });
});

// GET prospect by ID
router.get('/:id', (req, res) => {
  db.query('SELECT * FROM prospects WHERE id = ?', [req.params.id], (err, results) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(results[0]);
  });
});

// UPDATE prospect
router.put('/:id', (req, res) => {
  const {
    name, phoneNumber, phoneNumber_normalized,
    interest, method, site, comment, remark,
    periodTime, date, dateNow, userId
  } = req.body;

  const query = `
    UPDATE prospects
    SET name=?, phoneNumber=?, phoneNumber_normalized=?,
        interest=?, method=?, site=?, comment=?, remark=?,
        periodTime=?, date=?, dateNow=?, userId=?
    WHERE id=?
  `;

  db.query(query, [
    name, phoneNumber, phoneNumber_normalized,
    interest, method, site, comment, remark,
    periodTime, date, dateNow, userId, req.params.id
  ], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Prospect updated' });
  });
});

// DELETE prospect
router.delete('/:id', (req, res) => {
  db.query('DELETE FROM prospects WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ message: 'Prospect deleted' });
  });
});

module.exports = router;

const db = require('../db/db');

// Create a new member
exports.createMember = (req, res) => {
  const { name, email, phone, address, membershipType } = req.body;
  const sql = 'INSERT INTO members (name, email, phone, address, membershipType) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, address, membershipType], (err, result) => {
    if (err) throw err;
    res.status(201).json({ message: 'Member created', id: result.insertId });
  });
};

// Get all members
exports.getAllMembers = (req, res) => {
  const sql = 'SELECT * FROM members';
  db.query(sql, (err, results) => {
    if (err) throw err;
    res.status(200).json(results);
  });
};

// Update a member
exports.updateMember = (req, res) => {
  const { id } = req.params;
  const { name, email, phone, address, membershipType } = req.body;
  const sql = 'UPDATE members SET name = ?, email = ?, phone = ?, address = ?, membershipType = ? WHERE id = ?';
  db.query(sql, [name, email, phone, address, membershipType, id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'Member updated' });
  });
};

// Delete a member
exports.deleteMember = (req, res) => {
  const { id } = req.params;
  const sql = 'DELETE FROM members WHERE id = ?';
  db.query(sql, [id], (err, result) => {
    if (err) throw err;
    res.status(200).json({ message: 'Member deleted' });
  });
};
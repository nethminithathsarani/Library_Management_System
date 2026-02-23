import db from './db.js';

export const createMember = (req, res, next) => {
  const { name, email, phone, address, membershipType } = req.body;
  const sql = 'INSERT INTO members (name, email, phone, address, membershipType) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [name, email, phone, address, membershipType], (err, result) => {
    if (err) {
      next(err);
      return;
    }
    res.status(201).json({ message: 'Member created', id: result.insertId });
  });
};

export const getAllMembers = (req, res, next) => {
  const sql = 'SELECT * FROM members';
  db.query(sql, (err, results) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json(results);
  });
};

export const updateMember = (req, res, next) => {
  const { id } = req.params;
  const { name, email, phone, address, membershipType } = req.body;
  const sql = 'UPDATE members SET name = ?, email = ?, phone = ?, address = ?, membershipType = ? WHERE id = ?';
  db.query(sql, [name, email, phone, address, membershipType, id], (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({ message: 'Member updated' });
  });
};

export const deleteMember = (req, res, next) => {
  const { id } = req.params;
  const sql = 'DELETE FROM members WHERE id = ?';
  db.query(sql, [id], (err) => {
    if (err) {
      next(err);
      return;
    }
    res.status(200).json({ message: 'Member deleted' });
  });
};
import db from './db.js';

export const createMember = (req, res, next) => {
  const {
    name,
    email,
    phone,
    address,
    membershipType,
    password,
  } = req.body;

  if (!name || !email) {
    res.status(400).json({ message: 'Name and email are required' });
    return;
  }

  // Some DB schemas require members.password as NOT NULL.
  const effectivePassword = password || 'Temp@1234';
  const effectiveMembershipType = membershipType || 'standard';
  const sql =
    'INSERT INTO members (name, email, password, phone, address, membershipType) VALUES (?, ?, ?, ?, ?, ?)';

  db.query(sql, [name, email, effectivePassword, phone, address, effectiveMembershipType], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }
      if (err.code === 'ER_NO_DEFAULT_FOR_FIELD') {
        res.status(400).json({ message: `Missing required database field: ${err.sqlMessage}` });
        return;
      }
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
  db.query(sql, [name, email, phone, address, membershipType, id], (err, result) => {
    if (err) {
      if (err.code === 'ER_DUP_ENTRY') {
        res.status(409).json({ message: 'Email already exists' });
        return;
      }
      next(err);
      return;
    }

    if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Member not found' });
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
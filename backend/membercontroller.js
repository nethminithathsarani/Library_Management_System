import db from './db.js';
import bcrypt from 'bcryptjs';

export const createMember = (req, res, next) => {
  const {
    userId,
    user_id,
    createUserAccount,
    username,
    name,
    email,
    password,
    phone,
    address,
    membership,
    membershipType,
    memberCode,
    member_code,
  } = req.body;

  const effectiveName = (name || username || '').trim();
  const effectiveEmail = (email || '').trim().toLowerCase();
  const effectiveMembership = membership || membershipType || 'standard';
  const linkedUserId = Number(userId || user_id) || null;
  const shouldCreateUser = Boolean(createUserAccount) || !linkedUserId;
  const effectiveMemberCode = (memberCode || member_code || '').trim() || null;

  if (!effectiveName || !effectiveEmail) {
    res.status(400).json({ message: 'Name and email are required' });
    return;
  }

  if (shouldCreateUser && !password) {
    res.status(400).json({ message: 'Password is required when creating a linked user account' });
    return;
  }

  db.beginTransaction(async (txErr) => {
    if (txErr) {
      next(txErr);
      return;
    }

    const rollback = (error, status = 500, message = 'Failed to create member') => {
      db.rollback(() => {
        if (error && status === 500) {
          next(error);
          return;
        }
        res.status(status).json({ message });
      });
    };

    const insertMember = (resolvedUserId) => {
      const memberInsertSql =
        'INSERT INTO members (user_id, name, email, phone, address, membership, member_code) VALUES (?, ?, ?, ?, ?, ?, ?)';

      db.query(
        memberInsertSql,
        [
          resolvedUserId,
          effectiveName,
          effectiveEmail,
          phone || null,
          address || null,
          effectiveMembership,
          effectiveMemberCode,
        ],
        (insertMemberErr, memberResult) => {
          if (insertMemberErr) {
            if (insertMemberErr.code === 'ER_DUP_ENTRY') {
              rollback(null, 409, 'Member already exists for this email or user account');
              return;
            }
            rollback(insertMemberErr);
            return;
          }

          db.commit((commitErr) => {
            if (commitErr) {
              rollback(commitErr);
              return;
            }

            res.status(201).json({
              message: 'Member created and linked to user account',
              id: memberResult.insertId,
              userId: resolvedUserId,
            });
          });
        },
      );
    };

    if (shouldCreateUser) {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const insertUserSql =
          'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';

        db.query(insertUserSql, [effectiveName, effectiveEmail, hashedPassword, 'user'], (insertUserErr, userResult) => {
          if (insertUserErr) {
            if (insertUserErr.code === 'ER_DUP_ENTRY') {
              rollback(null, 409, 'User with this email already exists');
              return;
            }
            rollback(insertUserErr);
            return;
          }

          insertMember(userResult.insertId);
        });
      } catch (error) {
        rollback(error);
      }
      return;
    }

    const verifyUserSql = 'SELECT id, role FROM users WHERE id = ? LIMIT 1';
    db.query(verifyUserSql, [linkedUserId], (verifyErr, userRows) => {
      if (verifyErr) {
        rollback(verifyErr);
        return;
      }

      if (!userRows.length) {
        rollback(null, 404, 'Linked user not found');
        return;
      }

      if (userRows[0].role === 'admin') {
        rollback(null, 400, 'Admin user cannot be linked to members table');
        return;
      }

      insertMember(linkedUserId);
    });
  });
};

export const getAllMembers = (req, res, next) => {
  const sql = `
    SELECT
      m.id,
      m.user_id,
      m.name,
      m.email,
      m.phone,
      m.address,
      m.membership,
      m.member_code,
      u.role,
      u.created_at AS user_created_at
    FROM members m
    INNER JOIN users u ON u.id = m.user_id
    ORDER BY m.id DESC
  `;

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
  const {
    name,
    email,
    phone,
    address,
    membership,
    membershipType,
    memberCode,
    member_code,
  } = req.body;

  const sql = `
    UPDATE members
    SET
      name = ?,
      email = ?,
      phone = ?,
      address = ?,
      membership = ?,
      member_code = ?
    WHERE id = ?
  `;

  db.query(
    sql,
    [
      (name || '').trim(),
      (email || '').trim().toLowerCase(),
      phone || null,
      address || null,
      membership || membershipType || 'standard',
      (memberCode || member_code || '').trim() || null,
      id,
    ],
    (err, result) => {
      if (err) {
        if (err.code === 'ER_DUP_ENTRY') {
          res.status(409).json({ message: 'Email or member code already exists' });
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
    },
  );
};

export const deleteMember = (req, res, next) => {
  const { id } = req.params;

  db.beginTransaction((txErr) => {
    if (txErr) {
      next(txErr);
      return;
    }

    const findSql = 'SELECT user_id FROM members WHERE id = ? LIMIT 1';
    db.query(findSql, [id], (findErr, memberRows) => {
      if (findErr) {
        db.rollback(() => next(findErr));
        return;
      }

      if (!memberRows.length) {
        db.rollback(() => {
          res.status(404).json({ message: 'Member not found' });
        });
        return;
      }

      const userIdToDelete = memberRows[0].user_id;

      db.query('DELETE FROM members WHERE id = ?', [id], (deleteMemberErr) => {
        if (deleteMemberErr) {
          db.rollback(() => next(deleteMemberErr));
          return;
        }

        db.query('DELETE FROM users WHERE id = ? AND role = ?', [userIdToDelete, 'user'], (deleteUserErr) => {
          if (deleteUserErr) {
            db.rollback(() => next(deleteUserErr));
            return;
          }

          db.commit((commitErr) => {
            if (commitErr) {
              db.rollback(() => next(commitErr));
              return;
            }

            res.status(200).json({ message: 'Member and linked user deleted' });
          });
        });
      });
    });
  });
};
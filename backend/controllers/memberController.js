import db from '../db.js';
import bcrypt from 'bcryptjs';
import { sendSuccess, sendError, sendServerError } from '../utils/responseHandler.js';
import { validateMemberData, validatePassword, normalizeNumber } from '../utils/validation.js';

/**
 * Create a new member with optional linked user account
 */
export const createMember = async (req, res, next) => {
  try {
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

    // Normalize inputs
    const effectiveName = (name || username || '').trim();
    const effectiveEmail = (email || '').trim().toLowerCase();
    const effectiveMembership = membership || membershipType || 'standard';
    const linkedUserId = normalizeNumber(userId || user_id);
    const shouldCreateUser = Boolean(createUserAccount) || !linkedUserId;
    const effectiveMemberCode = (memberCode || member_code || '').trim() || null;

    // Validate member data
    const memberValidation = validateMemberData({
      name: effectiveName,
      email: effectiveEmail,
    });
    if (!memberValidation.valid) {
      sendError(res, 400, `Missing required fields: ${memberValidation.missing.join(', ')}`);
      return;
    }

    // Validate password if creating user account
    if (shouldCreateUser && !password) {
      sendError(res, 400, 'Password is required when creating a linked user account');
      return;
    }

    if (shouldCreateUser) {
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.valid) {
        sendError(res, 400, passwordValidation.message);
        return;
      }
    }

    db.beginTransaction((txErr) => {
      if (txErr) {
        sendServerError(res, txErr, 'Failed to create member');
        return;
      }

      const rollbackTransaction = (error, status = 500, message = 'Failed to create member') => {
        db.rollback(() => {
          if (error && status === 500) {
            sendServerError(res, error, message);
            return;
          }
          sendError(res, status, message);
        });
      };

      // Helper: Insert member record
      const insertMember = (resolvedUserId) => {
        const sql = `INSERT INTO members 
                     (user_id, name, email, phone, address, membership, member_code) 
                     VALUES (?, ?, ?, ?, ?, ?, ?)`;

        db.query(
          sql,
          [
            resolvedUserId,
            effectiveName,
            effectiveEmail,
            phone || null,
            address || null,
            effectiveMembership,
            effectiveMemberCode,
          ],
          (err, result) => {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') {
                rollbackTransaction(null, 409, 'Member already exists for this email or user account');
                return;
              }
              rollbackTransaction(err);
              return;
            }

            db.commit((commitErr) => {
              if (commitErr) {
                rollbackTransaction(commitErr);
                return;
              }

              sendSuccess(res, 201, 'Member created successfully', {
                id: result.insertId,
                userId: resolvedUserId,
              });
            });
          }
        );
      };

      // Create user account if needed
      if (shouldCreateUser) {
        bcrypt.hash(password, 10).then((hashedPassword) => {
          const sql = 'INSERT INTO users (name, email, password_hash, role) VALUES (?, ?, ?, ?)';

          db.query(sql, [effectiveName, effectiveEmail, hashedPassword, 'user'], (err, userResult) => {
            if (err) {
              if (err.code === 'ER_DUP_ENTRY') {
                rollbackTransaction(null, 409, 'User with this email already exists');
                return;
              }
              rollbackTransaction(err);
              return;
            }

            insertMember(userResult.insertId);
          });
        }).catch((error) => {
          rollbackTransaction(error);
        });
        return;
      }

      // Link to existing user
      const verifySql = 'SELECT id, role FROM users WHERE id = ? LIMIT 1';
      db.query(verifySql, [linkedUserId], (err, userRows) => {
        if (err) {
          rollbackTransaction(err);
          return;
        }

        if (!userRows.length) {
          rollbackTransaction(null, 404, 'Linked user not found');
          return;
        }

        if (userRows[0].role === 'admin') {
          rollbackTransaction(null, 400, 'Admin users cannot be linked to members');
          return;
        }

        insertMember(linkedUserId);
      });
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to create member');
  }
};

/**
 * Get all members with linked user information
 */
export const getAllMembers = (req, res, next) => {
  try {
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
        sendServerError(res, err, 'Failed to fetch members');
        return;
      }
      sendSuccess(res, 200, 'Members retrieved successfully', results);
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to fetch members');
  }
};

/**
 * Update a member by ID
 */
export const updateMember = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      sendError(res, 400, 'Invalid member ID');
      return;
    }

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

    // Validate required fields
    if (!name || !email) {
      sendError(res, 400, 'Name and email are required');
      return;
    }

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
        name.trim(),
        email.trim().toLowerCase(),
        phone || null,
        address || null,
        membership || membershipType || 'standard',
        (memberCode || member_code || '').trim() || null,
        id,
      ],
      (err, result) => {
        if (err) {
          if (err.code === 'ER_DUP_ENTRY') {
            sendError(res, 409, 'Email or member code already exists');
            return;
          }
          sendServerError(res, err, 'Failed to update member');
          return;
        }

        if (result.affectedRows === 0) {
          sendError(res, 404, 'Member not found');
          return;
        }

        sendSuccess(res, 200, 'Member updated successfully');
      }
    );
  } catch (error) {
    sendServerError(res, error, 'Failed to update member');
  }
};

/**
 * Delete a member and linked user account
 * Transactions ensure data consistency
 */
export const deleteMember = (req, res, next) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      sendError(res, 400, 'Invalid member ID');
      return;
    }

    db.beginTransaction((txErr) => {
      if (txErr) {
        sendServerError(res, txErr, 'Failed to delete member');
        return;
      }

      // Get member's linked user ID
      const findSql = 'SELECT user_id FROM members WHERE id = ? LIMIT 1';
      db.query(findSql, [id], (err, memberRows) => {
        if (err) {
          db.rollback(() => sendServerError(res, err, 'Failed to delete member'));
          return;
        }

        if (!memberRows.length) {
          db.rollback(() => sendError(res, 404, 'Member not found'));
          return;
        }

        const userIdToDelete = memberRows[0].user_id;

        // Delete member
        db.query('DELETE FROM members WHERE id = ?', [id], (err) => {
          if (err) {
            db.rollback(() => sendServerError(res, err, 'Failed to delete member'));
            return;
          }

          // Delete linked user (only if role is 'user')
          db.query('DELETE FROM users WHERE id = ? AND role = ?', [userIdToDelete, 'user'], (err) => {
            if (err) {
              db.rollback(() => sendServerError(res, err, 'Failed to delete member'));
              return;
            }

            db.commit((commitErr) => {
              if (commitErr) {
                db.rollback(() => sendServerError(res, commitErr, 'Failed to delete member'));
                return;
              }

              sendSuccess(res, 200, 'Member deleted successfully');
            });
          });
        });
      });
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to delete member');
  }
};

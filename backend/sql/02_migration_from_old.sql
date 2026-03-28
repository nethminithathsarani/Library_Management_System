USE library_management_system;

-- 1) Backup before migration
-- mysqldump --single-transaction library_management_system > backup_before_migration.sql

START TRANSACTION;

-- 2) users table preparation
ALTER TABLE users
  ADD COLUMN IF NOT EXISTS role ENUM('admin', 'user') NOT NULL DEFAULT 'user';

ALTER TABLE users
  ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255) NULL;

-- If old schema used users.password, move it into password_hash if needed.
UPDATE users
SET password_hash = password
WHERE (password_hash IS NULL OR password_hash = '')
  AND (password IS NOT NULL AND password <> '');

-- 3) members table preparation
ALTER TABLE members
  ADD COLUMN IF NOT EXISTS user_id BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS membership ENUM('standard', 'premium', 'student') NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS member_code VARCHAR(30) NULL;

-- Optional old-column compatibility updates
UPDATE members SET membership = membershipType
WHERE membershipType IS NOT NULL AND membership IS NULL;

-- 4) Create missing users for existing members (role=user)
INSERT INTO users (name, email, password_hash, role)
SELECT m.name, m.email, COALESCE(NULLIF(m.password, ''), '$2b$10$temp_hash_change_me'), 'user'
FROM members m
LEFT JOIN users u ON u.email = m.email
WHERE u.id IS NULL;

-- 5) Link members to users via email
UPDATE members m
INNER JOIN users u ON u.email = m.email
SET m.user_id = u.id
WHERE m.user_id IS NULL;

-- 6) Fill member_code for missing rows
UPDATE members
SET member_code = CONCAT('MEM-', LPAD(id, 4, '0'))
WHERE member_code IS NULL OR member_code = '';

-- 7) Normalize borrowings table to member_id/book_id snake_case columns
ALTER TABLE borrowings
  ADD COLUMN IF NOT EXISTS member_id BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS book_id BIGINT UNSIGNED NULL,
  ADD COLUMN IF NOT EXISTS borrow_date DATE NULL,
  ADD COLUMN IF NOT EXISTS due_date DATE NULL,
  ADD COLUMN IF NOT EXISTS return_date DATE NULL;

-- Copy data from old camelCase columns if present.
UPDATE borrowings SET member_id = memberId WHERE member_id IS NULL AND memberId IS NOT NULL;
UPDATE borrowings SET book_id = bookId WHERE book_id IS NULL AND bookId IS NOT NULL;
UPDATE borrowings SET borrow_date = borrowDate WHERE borrow_date IS NULL AND borrowDate IS NOT NULL;
UPDATE borrowings SET due_date = dueDate WHERE due_date IS NULL AND dueDate IS NOT NULL;
UPDATE borrowings SET return_date = returnDate WHERE return_date IS NULL AND returnDate IS NOT NULL;

-- 8) Enforce one-to-one + foreign keys
ALTER TABLE members
  MODIFY user_id BIGINT UNSIGNED NOT NULL,
  ADD UNIQUE KEY uq_members_user_id (user_id),
  ADD UNIQUE KEY uq_members_member_code (member_code);

ALTER TABLE members
  ADD CONSTRAINT fk_members_user
  FOREIGN KEY (user_id) REFERENCES users(id)
  ON UPDATE CASCADE ON DELETE CASCADE;

ALTER TABLE borrowings
  MODIFY member_id BIGINT UNSIGNED NOT NULL,
  MODIFY book_id BIGINT UNSIGNED NOT NULL,
  MODIFY borrow_date DATE NOT NULL,
  MODIFY due_date DATE NOT NULL,
  MODIFY status ENUM('borrowed', 'returned', 'overdue', 'lost') NOT NULL DEFAULT 'borrowed';

ALTER TABLE borrowings
  ADD CONSTRAINT fk_borrowings_member
  FOREIGN KEY (member_id) REFERENCES members(id)
  ON UPDATE CASCADE ON DELETE RESTRICT,
  ADD CONSTRAINT fk_borrowings_book
  FOREIGN KEY (book_id) REFERENCES books(id)
  ON UPDATE CASCADE ON DELETE RESTRICT;

COMMIT;

-- 9) Optional cleanup after code fully switched to new columns
-- ALTER TABLE members DROP COLUMN password;
-- ALTER TABLE members DROP COLUMN membershipType;
-- ALTER TABLE borrowings DROP COLUMN memberId;
-- ALTER TABLE borrowings DROP COLUMN bookId;
-- ALTER TABLE borrowings DROP COLUMN borrowDate;
-- ALTER TABLE borrowings DROP COLUMN dueDate;
-- ALTER TABLE borrowings DROP COLUMN returnDate;
-- ALTER TABLE borrowings DROP COLUMN userName;
-- ALTER TABLE borrowings DROP COLUMN bookName;

CREATE DATABASE IF NOT EXISTS library_management_system
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_0900_ai_ci;

USE library_management_system;

CREATE TABLE IF NOT EXISTS users (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') NOT NULL DEFAULT 'user',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS members (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL,
  phone VARCHAR(25) NULL,
  address VARCHAR(255) NULL,
  membership ENUM('standard', 'premium', 'student') NOT NULL DEFAULT 'standard',
  member_code VARCHAR(30) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_members_user_id (user_id),
  UNIQUE KEY uq_members_email (email),
  UNIQUE KEY uq_members_member_code (member_code),
  CONSTRAINT fk_members_user
    FOREIGN KEY (user_id) REFERENCES users(id)
    ON UPDATE CASCADE
    ON DELETE CASCADE
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS books (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(180) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  isbn VARCHAR(20) NOT NULL,
  publicationDate DATE NOT NULL,
  category VARCHAR(100) NULL,
  published_year INT NULL,
  available TINYINT(1) NOT NULL DEFAULT 1,
  coverImageUrl VARCHAR(500) NULL,
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_books_isbn (isbn)
) ENGINE=InnoDB;

CREATE TABLE IF NOT EXISTS borrowings (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  member_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE NULL,
  status ENUM('borrowed', 'returned', 'overdue', 'lost') NOT NULL DEFAULT 'borrowed',
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_borrowings_member_id (member_id),
  KEY idx_borrowings_book_id (book_id),
  KEY idx_borrowings_status (status),
  CONSTRAINT fk_borrowings_member
    FOREIGN KEY (member_id) REFERENCES members(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CONSTRAINT fk_borrowings_book
    FOREIGN KEY (book_id) REFERENCES books(id)
    ON UPDATE CASCADE
    ON DELETE RESTRICT,
  CHECK (due_date >= borrow_date),
  CHECK (return_date IS NULL OR return_date >= borrow_date)
) ENGINE=InnoDB;

-- Sample data
INSERT INTO users (name, email, password_hash, role)
VALUES ('Library Admin', 'admin@library.com', '$2b$10$replace_admin_hash', 'admin')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO users (name, email, password_hash, role)
VALUES ('Normal User', 'user1@library.com', '$2b$10$replace_user_hash', 'user')
ON DUPLICATE KEY UPDATE name = VALUES(name);

INSERT INTO members (user_id, name, email, phone, address, membership, member_code)
SELECT u.id, 'Normal User', 'user1@library.com', '+94771234567', 'Galle', 'standard', 'MEM-0001'
FROM users u
WHERE u.email = 'user1@library.com'
ON DUPLICATE KEY UPDATE name = VALUES(name), membership = VALUES(membership);

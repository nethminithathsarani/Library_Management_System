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

-- ============================================
-- SAMPLE DATA
-- ============================================

-- Sample Users (with hashed passwords)
-- Password: admin123 → $2b$10$JBvh//EemKOQ41TcyJvhEeNkr/KZzwc7nh8eJxf9PBTqheSYM0L8y
-- Password: user123 → $2b$10$P1V92D/WC2uf7LLP.tqO9O2GFzJ2v60.s3vD/9ZIjtUDete3B8n3O

INSERT INTO users (name, email, password_hash, role) VALUES
('Library Admin', 'admin@library.com', '$2b$10$JBvh//EemKOQ41TcyJvhEeNkr/KZzwc7nh8eJxf9PBTqheSYM0L8y', 'admin'),
('John Doe', 'john@example.com', '$2b$10$P1V92D/WC2uf7LLP.tqO9O2GFzJ2v60.s3vD/9ZIjtUDete3B8n3O', 'user'),
('Jane Smith', 'jane@example.com', '$2b$10$P1V92D/WC2uf7LLP.tqO9O2GFzJ2v60.s3vD/9ZIjtUDete3B8n3O', 'user'),
('Michael Johnson', 'michael@example.com', '$2b$10$P1V92D/WC2uf7LLP.tqO9O2GFzJ2v60.s3vD/9ZIjtUDete3B8n3O', 'user'),
('Sarah Williams', 'sarah@example.com', '$2b$10$P1V92D/WC2uf7LLP.tqO9O2GFzJ2v60.s3vD/9ZIjtUDete3B8n3O', 'user'),
('Emily Brown', 'emily@example.com', '$2b$10$P1V92D/WC2uf7LLP.tqO9O2GFzJ2v60.s3vD/9ZIjtUDete3B8n3O', 'user')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Sample Members (linked to users)
INSERT INTO members (user_id, name, email, phone, address, membership, member_code) VALUES
((SELECT id FROM users WHERE email = 'john@example.com'), 'John Doe', 'john@example.com', '+94771001234', '123 Main St, Colombo', 'standard', 'MEM-0001'),
((SELECT id FROM users WHERE email = 'jane@example.com'), 'Jane Smith', 'jane@example.com', '+94771002345', '456 Oak Ave, Kandy', 'premium', 'MEM-0002'),
((SELECT id FROM users WHERE email = 'michael@example.com'), 'Michael Johnson', 'michael@example.com', '+94771003456', '789 Pine Rd, Galle', 'student', 'MEM-0003'),
((SELECT id FROM users WHERE email = 'sarah@example.com'), 'Sarah Williams', 'sarah@example.com', '+94771004567', '321 Oak Lane, Negombo', 'premium', 'MEM-0004'),
((SELECT id FROM users WHERE email = 'emily@example.com'), 'Emily Brown', 'emily@example.com', '+94771005678', '654 Elm St, Matara', 'standard', 'MEM-0005')
ON DUPLICATE KEY UPDATE name = VALUES(name), membership = VALUES(membership);

-- Sample Books
INSERT INTO books (title, author, genre, isbn, publicationDate, category, published_year, available) VALUES
('The Great Gatsby', 'F. Scott Fitzgerald', 'Fiction', '978-0-7432-7356-5', '1925-04-10', 'Classic', 1925, 1),
('To Kill a Mockingbird', 'Harper Lee', 'Fiction', '978-0-06-112008-4', '1960-07-11', 'Classic', 1960, 1),
('1984', 'George Orwell', 'Dystopian', '978-0-451-52493-2', '1949-06-08', 'Sci-Fi', 1949, 1),
('Pride and Prejudice', 'Jane Austen', 'Romance', '978-0-14-143951-8', '1813-01-28', 'Classic', 1813, 1),
('The Catcher in the Rye', 'J.D. Salinger', 'Fiction', '978-0-316-76948-0', '1951-07-16', 'Classic', 1951, 1),
('Dune', 'Frank Herbert', 'Science Fiction', '978-0-441-13959-0', '1965-06-01', 'Sci-Fi', 1965, 1),
('The Hobbit', 'J.R.R. Tolkien', 'Fantasy', '978-0-547-92832-8', '1937-09-21', 'Fantasy', 1937, 1),
('Harry Potter and the Sorcerer''s Stone', 'J.K. Rowling', 'Fantasy', '978-0-439-13959-0', '1998-09-01', 'Fantasy', 1998, 1),
('The Lord of the Rings', 'J.R.R. Tolkien', 'Fantasy', '978-0-544-92832-8', '1954-07-29', 'Fantasy', 1954, 1),
('Brave New World', 'Aldous Huxley', 'Dystopian', '978-0-06-085052-4', '1932-08-30', 'Sci-Fi', 1932, 1),
('The Odyssey', 'Homer', 'Fantasy', '978-0-14-026886-5', '1997-01-01', 'Classic', -800, 1),
('Moby Dick', 'Herman Melville', 'Adventure', '978-0-14-018956-3', '1851-10-18', 'Classic', 1851, 1),
('Jane Eyre', 'Charlotte Brontë', 'Romance', '978-0-14-143955-6', '1847-10-19', 'Classic', 1847, 1),
('Wuthering Heights', 'Emily Brontë', 'Romance', '978-0-14-043206-8', '1847-12-19', 'Classic', 1847, 1),
('The Dark Tower: The Gunslinger', 'Stephen King', 'Fantasy', '978-0-451-52493-5', '1982-05-28', 'Fantasy', 1982, 1)
ON DUPLICATE KEY UPDATE title = VALUES(title);

-- Sample Borrowings (past, current, and overdue)
-- Get member and book IDs without hardcoding
INSERT INTO borrowings (member_id, book_id, borrow_date, due_date, return_date, status) VALUES
-- John (member 1) - current borrowing
((SELECT id FROM members WHERE email = 'john@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-7432-7356-5'), 
 DATE_SUB(CURDATE(), INTERVAL 5 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 2 DAY), 
 NULL, 
 'borrowed'),
-- John - returned book
((SELECT id FROM members WHERE email = 'john@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-06-112008-4'), 
 DATE_SUB(CURDATE(), INTERVAL 20 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 13 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 12 DAY), 
 'returned'),
-- Jane (member 2) - current borrowing
((SELECT id FROM members WHERE email = 'jane@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-451-52493-2'), 
 DATE_SUB(CURDATE(), INTERVAL 3 DAY), 
 DATE_ADD(CURDATE(), INTERVAL 7 DAY), 
 NULL, 
 'borrowed'),
-- Jane - overdue book
((SELECT id FROM members WHERE email = 'jane@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-14-143951-8'), 
 DATE_SUB(CURDATE(), INTERVAL 30 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 2 DAY), 
 NULL, 
 'overdue'),
-- Michael (member 3) - returned book
((SELECT id FROM members WHERE email = 'michael@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-316-76948-0'), 
 DATE_SUB(CURDATE(), INTERVAL 14 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 7 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 6 DAY), 
 'returned'),
-- Michael - current borrowing
((SELECT id FROM members WHERE email = 'michael@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-441-13959-0'), 
 DATE_SUB(CURDATE(), INTERVAL 1 DAY), 
 DATE_ADD(CURDATE(), INTERVAL 13 DAY), 
 NULL, 
 'borrowed'),
-- Sarah (member 4) - multiple books
((SELECT id FROM members WHERE email = 'sarah@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-547-92832-8'), 
 DATE_SUB(CURDATE(), INTERVAL 2 DAY), 
 DATE_ADD(CURDATE(), INTERVAL 12 DAY), 
 NULL, 
 'borrowed'),
((SELECT id FROM members WHERE email = 'sarah@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-439-13959-0'), 
 DATE_SUB(CURDATE(), INTERVAL 10 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 3 DAY), 
 NULL, 
 'overdue'),
-- Emily (member 5) - recently returned
((SELECT id FROM members WHERE email = 'emily@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-544-92832-8'), 
 DATE_SUB(CURDATE(), INTERVAL 25 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 18 DAY), 
 DATE_SUB(CURDATE(), INTERVAL 17 DAY), 
 'returned'),
((SELECT id FROM members WHERE email = 'emily@example.com'), 
 (SELECT id FROM books WHERE isbn = '978-0-06-085052-4'), 
 DATE_SUB(CURDATE(), INTERVAL 8 DAY), 
 DATE_ADD(CURDATE(), INTERVAL 6 DAY), 
 NULL, 
 'borrowed')
ON DUPLICATE KEY UPDATE status = VALUES(status);

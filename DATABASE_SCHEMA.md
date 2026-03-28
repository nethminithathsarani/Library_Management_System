# Library Management System - Database Schema & Sample Data

## Database Schema Overview

### 1. USERS Table
Stores authentication credentials and user roles.

```sql
CREATE TABLE users (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('admin', 'user') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Sample Users:**
| id | name | email | password | role |
|---|---|---|---|---|
| 1 | Library Admin | admin@library.com | admin123 | admin |
| 2 | John Doe | john@example.com | user123 | user |
| 3 | Jane Smith | jane@example.com | user123 | user |
| 4 | Michael Johnson | michael@example.com | user123 | user |
| 5 | Sarah Williams | sarah@example.com | user123 | user |
| 6 | Emily Brown | emily@example.com | user123 | user |

---

### 2. MEMBERS Table
Stores library member profiles, linked one-to-one with users table.

```sql
CREATE TABLE members (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  user_id BIGINT UNSIGNED NOT NULL UNIQUE,
  name VARCHAR(120) NOT NULL,
  email VARCHAR(190) NOT NULL UNIQUE,
  phone VARCHAR(25),
  address VARCHAR(255),
  membership ENUM('standard', 'premium', 'student') DEFAULT 'standard',
  member_code VARCHAR(30) UNIQUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
```

**Sample Members (linked to users):**
| id | user_id | name | email | phone | address | membership | member_code |
|---|---|---|---|---|---|---|---|
| 1 | 2 | John Doe | john@example.com | +94771001234 | 123 Main St, Colombo | standard | MEM-0001 |
| 2 | 3 | Jane Smith | jane@example.com | +94771002345 | 456 Oak Ave, Kandy | premium | MEM-0002 |
| 3 | 4 | Michael Johnson | michael@example.com | +94771003456 | 789 Pine Rd, Galle | student | MEM-0003 |
| 4 | 5 | Sarah Williams | sarah@example.com | +94771004567 | 321 Oak Lane, Negombo | premium | MEM-0004 |
| 5 | 6 | Emily Brown | emily@example.com | +94771005678 | 654 Elm St, Matara | standard | MEM-0005 |

---

### 3. BOOKS Table
Stores library book catalog.

```sql
CREATE TABLE books (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  title VARCHAR(255) NOT NULL,
  author VARCHAR(180) NOT NULL,
  genre VARCHAR(100) NOT NULL,
  isbn VARCHAR(20) NOT NULL UNIQUE,
  publicationDate DATE NOT NULL,
  category VARCHAR(100),
  published_year INT,
  available TINYINT(1) DEFAULT 1,
  coverImageUrl VARCHAR(500),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

**Sample Books (15 titles):**
| id | title | author | genre | isbn | published_year | category |
|---|---|---|---|---|---|---|
| 1 | The Great Gatsby | F. Scott Fitzgerald | Fiction | 978-0-7432-7356-5 | 1925 | Classic |
| 2 | To Kill a Mockingbird | Harper Lee | Fiction | 978-0-06-112008-4 | 1960 | Classic |
| 3 | 1984 | George Orwell | Dystopian | 978-0-451-52493-2 | 1949 | Sci-Fi |
| 4 | Pride and Prejudice | Jane Austen | Romance | 978-0-14-143951-8 | 1813 | Classic |
| 5 | The Catcher in the Rye | J.D. Salinger | Fiction | 978-0-316-76948-0 | 1951 | Classic |
| 6 | Dune | Frank Herbert | Science Fiction | 978-0-441-13959-0 | 1965 | Sci-Fi |
| 7 | The Hobbit | J.R.R. Tolkien | Fantasy | 978-0-547-92832-8 | 1937 | Fantasy |
| 8 | Harry Potter and the Sorcerer's Stone | J.K. Rowling | Fantasy | 978-0-439-13959-0 | 1998 | Fantasy |
| 9 | The Lord of the Rings | J.R.R. Tolkien | Fantasy | 978-0-544-92832-8 | 1954 | Fantasy |
| 10 | Brave New World | Aldous Huxley | Dystopian | 978-0-06-085052-4 | 1932 | Sci-Fi |
| 11 | The Odyssey | Homer | Fantasy | 978-0-14-026886-5 | -800 | Classic |
| 12 | Moby Dick | Herman Melville | Adventure | 978-0-14-018956-3 | 1851 | Classic |
| 13 | Jane Eyre | Charlotte Brontë | Romance | 978-0-14-143955-6 | 1847 | Classic |
| 14 | Wuthering Heights | Emily Brontë | Romance | 978-0-14-043206-8 | 1847 | Classic |
| 15 | The Dark Tower: The Gunslinger | Stephen King | Fantasy | 978-0-451-52493-5 | 1982 | Fantasy |

---

### 4. BORROWINGS Table
Tracks book borrowing transactions between members and books.

```sql
CREATE TABLE borrowings (
  id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
  member_id BIGINT UNSIGNED NOT NULL,
  book_id BIGINT UNSIGNED NOT NULL,
  borrow_date DATE NOT NULL,
  due_date DATE NOT NULL,
  return_date DATE,
  status ENUM('borrowed', 'returned', 'overdue', 'lost') DEFAULT 'borrowed',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (member_id) REFERENCES members(id) ON DELETE RESTRICT,
  FOREIGN KEY (book_id) REFERENCES books(id) ON DELETE RESTRICT,
  CHECK (due_date >= borrow_date),
  CHECK (return_date IS NULL OR return_date >= borrow_date)
);
```

**Sample Borrowing Records (10 records with mixed statuses):**

| id | member_id | book_id | borrow_date | due_date | return_date | status | notes |
|---|---|---|---|---|---|---|---|
| 1 | 1 (John) | 1 (Gatsby) | 5 days ago | 2 days ago | NULL | borrowed | **OVERDUE** |
| 2 | 1 (John) | 2 (Mockingbird) | 20 days ago | 13 days ago | 12 days ago | returned | ✓ On time |
| 3 | 2 (Jane) | 3 (1984) | 3 days ago | 7 days from now | NULL | borrowed | Current loan |
| 4 | 2 (Jane) | 4 (Pride & Prejudice) | 30 days ago | 2 days ago | NULL | overdue | **OVERDUE** |
| 5 | 3 (Michael) | 5 (Catcher in Rye) | 14 days ago | 7 days ago | 6 days ago | returned | ✓ On time |
| 6 | 3 (Michael) | 6 (Dune) | 1 day ago | 13 days from now | NULL | borrowed | Current loan |
| 7 | 4 (Sarah) | 7 (The Hobbit) | 2 days ago | 12 days from now | NULL | borrowed | Current loan |
| 8 | 4 (Sarah) | 8 (Harry Potter) | 10 days ago | 3 days ago | NULL | overdue | **OVERDUE** |
| 9 | 5 (Emily) | 9 (LOTR) | 25 days ago | 18 days ago | 17 days ago | returned | ✓ On time |
| 10 | 5 (Emily) | 10 (Brave New World) | 8 days ago | 6 days from now | NULL | borrowed | Current loan |

---

## Data Relationships

```
users (1) ←→ (1) members
  │
  └─ Admin users have NO member profile
  └─ Regular users have ONE member profile

members (many) ←→ (many) books  [through borrowings]
  │
  └─ One member can borrow many books (via borrowings)
  └─ One book can be borrowed by many members (via borrowings)
```

---

## Key Statistics - Current Sample Data

📊 **Users:**
- Total: 6 users (1 admin, 5 regular)

📚 **Members:**
- Total: 5 members (all linked to regular users)

📖 **Books:**
- Total: 15 books
- All available for borrowing

📋 **Borrowings:**
- Total: 10 borrowing records
- **Current (borrowed):** 5 books
- **Returned:** 3 books
- **Overdue:** 2 books
- **Lost:** 0 books

---

## Test Credentials

### Admin Login
- Email: `admin@library.com`
- Password: `admin123`
- Access: Full system administration

### User Login (5 accounts available)
All have password: `user123`

| Email | Name | Membership | Member Code |
|---|---|---|---|
| john@example.com | John Doe | Standard | MEM-0001 |
| jane@example.com | Jane Smith | Premium | MEM-0002 |
| michael@example.com | Michael Johnson | Student | MEM-0003 |
| sarah@example.com | Sarah Williams | Premium | MEM-0004 |
| emily@example.com | Emily Brown | Standard | MEM-0005 |

---

## Sample Queries

### 1. Get all borrowings for a specific member
```sql
SELECT 
  b.id,
  bk.title,
  bk.author,
  b.borrow_date,
  b.due_date,
  b.status
FROM borrowings b
JOIN books bk ON bk.id = b.book_id
WHERE b.member_id = 1
ORDER BY b.borrow_date DESC;
```

### 2. Find overdue books
```sql
SELECT 
  b.id,
  m.name as member_name,
  bk.title as book_title,
  b.due_date,
  DATEDIFF(CURDATE(), b.due_date) as days_overdue
FROM borrowings b
JOIN members m ON m.id = b.member_id
JOIN books bk ON bk.id = b.book_id
WHERE b.status = 'overdue'
ORDER BY b.due_date ASC;
```

### 3. Get borrowing history for a user
```sql
SELECT 
  b.id,
  bk.title,
  bk.author,
  b.borrow_date,
  b.return_date,
  DATEDIFF(b.return_date, b.borrow_date) as days_borrowed
FROM borrowings b
JOIN members m ON m.id = b.member_id
JOIN users u ON u.id = m.user_id
JOIN books bk ON bk.id = b.book_id
WHERE u.id = 2
ORDER BY b.borrow_date DESC;
```

### 4. Get member profile with linked user
```sql
SELECT 
  m.id,
  m.name,
  m.member_code,
  m.membership,
  m.phone,
  m.address,
  u.email,
  u.role
FROM members m
JOIN users u ON u.id = m.user_id
WHERE m.id = 1;
```

### 5. Count active borrowings per member
```sql
SELECT 
  m.name,
  m.member_code,
  COUNT(*) as active_borrowings
FROM borrowings b
JOIN members m ON m.id = b.member_id
WHERE b.status = 'borrowed'
GROUP BY b.member_id, m.name, m.member_code;
```

---

## Database Constraints

✓ **Primary Keys:** All tables have unique identifiers
✓ **Foreign Keys:** members→users, borrowings→members, borrowings→books
✓ **Unique Constraints:** email (users, members), isbn (books), user_id (members), member_code (members)
✓ **Check Constraints:** due_date ≥ borrow_date, return_date ≥ borrow_date
✓ **Date Constraints:** Automatic timestamps (created_at, updated_at)
✓ **Referential Integrity:** RESTRICT on delete for borrowings (prevents deletion of referenced books/members)

---

## Indexes

- `uq_users_email`: Fast login lookups
- `uq_members_user_id`: Fast user→member lookup
- `uq_members_email`: Prevent duplicate member emails
- `uq_books_isbn`: Fast ISBN lookups
- `idx_borrowings_member_id`: Fast member borrowing query
- `idx_borrowings_book_id`: Fast book borrowing query
- `idx_borrowings_status`: Fast status-based queries

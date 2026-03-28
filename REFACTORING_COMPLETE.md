# Library Management System - Refactoring Complete ✓

## Overview

Your Library Management System has been successfully refactored with a proper relational database design, JWT authentication, and role-based access control. The system now cleanly separates user authentication (users table) from library member profiles (members table) with secure one-to-one linking.

## System Architecture

### Database Design

```
users (1) ←→ members (1)
  - users: stores login credentials, role (admin/user)
  - members: stores library profile, linked to user via user_id FK

borrowings (many) → members + books
  - borrowings: tracks book loans using member_id and book_id FKs
```

**Key Features:**
- Relational integrity with foreign key constraints
- One-to-one members↔users linking via UNIQUE FK
- Admin users exist only in users table (role='admin')
- Normal users have both users row (role='user') and linked members row
- Cascading deletes: removing a user removes their member profile
- Referential integrity: cannot delete books/members with active borrowings

### Authentication Flow

1. **Signup** → Creates `users` row with role='user', password_hash
2. **Login** → Verifies credentials, returns JWT with userId + role + email
3. **JWT Token** → Sent in `Authorization: Bearer <token>` header
4. **Verification** → authMiddleware extracts claims, populates req.user
5. **Authorization** → roleMiddleware checks req.user.role against endpoint requirements

### Access Control

```
Public Endpoints:
  - GET /api/books (read-only)
  - POST /api/auth/signup
  - POST /api/auth/login

User-Only (role='user'):
  - GET /api/borrowings/me (filtered by userId)
  - Frontend: /my-borrowings page

Admin-Only (role='admin'):
  - GET /api/borrowings/admin (all records)
  - POST/PATCH /api/borrowings (manage loans)
  - GET/POST/PUT/DELETE /api/members
  - POST/PUT/DELETE /api/books
  - Frontend: /Borrowings, /AddBooks, /EditBooks, /Addmember, /EditMember
```

## Testing

All authentication and authorization tests pass:

```bash
✓ User signup
✓ User login with JWT generation
✓ JWT contains userId and role claims
✓ Public endpoints accessible without auth
✓ Protected endpoints reject requests without JWT (401)
✓ Wrong role rejected (403 Forbidden)
✓ Users can only access their own borrowings (/borrowings/me)
✓ Admin can access all data (/borrowings/admin, /members)
✓ Role-based endpoint enforcement working correctly
```

## Sample Credentials

Use these accounts to test the system:

**Admin Account:**
- Email: `admin@library.com`
- Password: `admin123`
- Access: Full admin panel, member management, borrowing control

**Regular User Account:**
- Email: `user1@library.com`
- Password: `user123`
- Access: View own borrowing history only

**Create New User:**
- Sign up at /signup page
- Will be created with role='user'
- Admin must create member profile after signup

## Quick Start

### 1. Database Migration

The database has been initialized with the schema. To reinitialize or check status:

```bash
cd backend
node sql/runMigration.js
```

### 2. Start Backend Server

```bash
cd backend
npm run dev
# Server runs on http://localhost:5000
```

### 3. Start Frontend Development

```bash
cd frontend
npm run dev
# Frontend runs on http://localhost:5173
```

### 4. Login Flow

1. Navigate to `/login`
2. Use sample credentials (admin@library.com / admin123 for admin)
3. Admin → redirected to /Borrowings (admin dashboard)
4. User → redirected to /my-borrowings (personal dashboard)

## File Structure

### Backend

```
backend/
├── authController.js          # Login/signup with JWT
├── membercontroller.js        # Member CRUD with user linking
├── borrowingController.js      # Borrowing ops with relational IDs
├── bookController.js          # Book management
├── authRoutes.js, memberRoutes.js, borrowingRoutes.js, bookRoutes.js
├── middleware/
│   ├── authMiddleware.js      # JWT verification
│   └── roleMiddleware.js      # Role-based access control
├── sql/
│   ├── 01_schema_v2.sql       # Complete relational schema
│   └── runMigration.js        # Migration automation script
├── db.js                      # MySQL connection
└── index.js                   # Express server entry point
```

### Frontend

```
frontend/src/
├── utils/
│   └── auth.js                # JWT storage, getAuthHeaders()
├── Components/
│   ├── ProtectedRoute.jsx     # Role-based route guard
│   └── Navigation.jsx         # Admin/user conditional menu
├── Pages/
│   ├── Login.jsx              # Updated JWT handling
│   ├── MyBorrowingActivities.jsx  # NEW: User borrowing view
│   ├── Borrowings.jsx         # Refactored admin view
│   ├── Addmember.jsx          # Create user+member atomic
│   ├── EditMember.jsx         # Manage members
│   ├── AddBooks.jsx, EditBooks.jsx
│   └── Home.jsx, Information.jsx
├── App.jsx                    # Routing with ProtectedRoute
└── main.jsx                   # Entry point
```

## Key Implementation Details

### Atomic Transactions

When creating a member with a user account, the system uses MySQL transactions to ensure consistency:

```javascript
// If either user or member creation fails, both are rolled back
membercontroller.js → createMember with createUserAccount=true
```

### User-Specific Data Filtering

Normal users only see their own borrowings via automatic database filtering:

```javascript
// In borrowingController.js getMyBorrowings:
WHERE u.id = ?  // req.user.id from JWT
```

### Password Hashing

All passwords use bcryptjs (10 salt rounds) for security:

```javascript
const hash = await bcrypt.hash(password, 10);
const valid = await bcrypt.compare(inputPassword, hash);
```

### JWT Claims

Tokens include essential info to avoid repeated database queries:

```json
{
  "userId": 1,
  "role": "admin",
  "email": "admin@library.com",
  "iat": 1234567890,
  "exp": 1234654290
}
```

## Common Tasks

### Create a Member Account

1. **Signup** - User signs up at `/signup` (creates users table row)
2. **Admin Creates Member** - Admin goes to `/Addmember`, fills form with name/email/phone/address/password
3. **System Links** - Creates user account if needed, links to members table via user_id

### Check User Borrowings

**As Regular User:**
- Login → Redirected to `/my-borrowings`
- See only own borrowing history with returned/pending status

**As Admin:**
- Login → Redirected to `/Borrowings`
- See all borrowings, can create/return loans via dropdown members

### Add Books

1. Login as admin
2. Navigate to `/AddBooks`
3. Fill form: title, author, genre, ISBN, publication date
4. System creates 10 copies available for borrowing

## API Examples

### Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@library.com","password":"admin123"}'
```

Response includes JWT token and user object.

### Get Your Borrowings (User)
```bash
curl http://localhost:5000/api/borrowings/me \
  -H "Authorization: Bearer <jwt_token>"
```

### Get All Borrowings (Admin)
```bash
curl http://localhost:5000/api/borrowings/admin \
  -H "Authorization: Bearer <jwt_token>"
```

## Security Notes

- ✓ Passwords hashed with bcryptjs (10 rounds)
- ✓ JWT tokens have 1-day expiration (86400 seconds)
- ✓ Role checks enforced on backend AND frontend
- ✓ User IDs from JWT claims prevent data access escalation
- ⚠️ JWT_SECRET in .env should be changed for production
- ⚠️ HTTPS required for production
- ⚠️ CORS should be configured for production

## Troubleshooting

**Admin login fails**
- Check database has users table with admin@library.com record
- Run: `node sql/runMigration.js` to reset to known good state

**JWT not working**
- Verify JWT_SECRET in .env matches what's in authController.js
- Check Authorization header format: `Bearer <token>` (space required)
- Verify token hasn't expired (max 86400 seconds old)

**Member creation fails**
- Ensure user_id doesn't already have a linked member
- Check members.user_id has UNIQUE constraint
- Verify email is unique in members table

**ProtectedRoute always redirects**
- Check localStorage has 'authToken' and 'authUser' after login
- Verify token format is correct in getAuthToken()
- Check allowedRoles parameter matches user.role

## Next Steps

1. **Configure JWT_SECRET** in .env (change from default)
2. **Update CORS** in backend/index.js for production domains
3. **Add HTTPS** certificates for production deployment
4. **Update password requirements** in authController.js if needed
5. **Configure email notifications** for overdue books
6. **Add book search/filtering** to member borrowing page
7. **Implement book return deadline enforcement**

## Support

This refactoring implements industry-standard patterns:
- Relational database design with proper normalization
- JWT stateless authentication
- Role-based access control (RBAC)
- Atomic transactions for data consistency
- Separation of concerns (auth, routing, controllers)

For questions about specific features, check implementation in:
- Database: `/backend/sql/01_schema_v2.sql`
- Routes: `/backend/*Routes.js`
- Controllers: `/backend/*Controller.js`
- Frontend: `/frontend/src/Pages/` and `/frontend/src/Components/`

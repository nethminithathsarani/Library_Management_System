# Frontend Refactoring Guide - Complete These Pages

This guide shows you how to refactor the remaining frontend pages to use the new centralized API service.

## Pattern: Replace Fetch Calls with API Service

### Standard Template

**Step 1: Update Imports**
```javascript
// Remove
import { getAuthHeaders } from '../utils/auth';

// Add
import { booksAPI, membersAPI, borrowingsAPI, authAPI } from '../utils/api';
```

**Step 2: Replace Fetch Calls**

**Before:**
```javascript
const response = await fetch('http://localhost:5000/api/books', {
  method: 'GET',
  headers: getAuthHeaders(),
});

if (!response.ok) {
  throw new Error('Failed to fetch');
}

const data = await response.json();
```

**After:**
```javascript
try {
  const data = await booksAPI.getAll();
  setBooks(data);
} catch (error) {
  setError(error.message);
}
```

---

## 📄 Pages to Update

### 1. Borrowings.jsx (High Priority)
**Uses:** GET /api/borrowings/admin, PATCH /api/borrowings/:id/return

**Changes Needed:**
1. Import: `import { borrowingsAPI } from '../utils/api';`
2. Replace fetch for getting admin borrowings
3. Replace fetch for returning books

**Example Updates:**
```javascript
// Old
const response = await fetch('http://localhost:5000/api/borrowings/admin', {
  method: 'GET',
  headers: getAuthHeaders(),
});
const data = await response.json();
setAllBorrowings(data);

// New
try {
  const data = await borrowingsAPI.getAllAdmin();
  setAllBorrowings(data);
} catch (error) {
  console.error('Failed to fetch borrowings:', error);
}
```

### 2. MyBorrowingActivities.jsx (High Priority)
**Uses:** GET /api/borrowings/me

**Changes Needed:**
1. Import: `import { borrowingsAPI } from '../utils/api';`
2. Replace fetch for getting user's borrowings

**Example Update:**
```javascript
// Old
const response = await fetch('http://localhost:5000/api/borrowings/me', {
  method: 'GET',
  headers: getAuthHeaders(),
});
const data = await response.json();
setMyBorrowings(data);

// New
try {
  const data = await borrowingsAPI.getMy();
  setMyBorrowings(data);
} catch (error) {
  console.error('Failed to fetch your borrowings:', error);
}
```

### 3. signup.jsx (Medium Priority)
**Uses:** POST /api/auth/signup

**Changes Needed:**
1. Import: `import { authAPI } from '../utils/api';`
2. Replace fetch for user signup

**Example Update:**
```javascript
// Old
const response = await fetch('http://localhost:5000/api/auth/signup', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData),
});

if (!response.ok) {
  const error = await response.json();
  throw new Error(error.message);
}

// New
try {
  await authAPI.signup(formData);
  // Handle success
} catch (error) {
  setError(error.message || 'Signup failed');
}
```

### 4. Addmember.jsx (Medium Priority)
**Uses:** POST /api/members

**Changes Needed:**
1. Import: `import { membersAPI } from '../utils/api';`
2. Replace fetch for creating member

**Example Update:**
```javascript
// Old
const response = await fetch('http://localhost:5000/api/members', {
  method: 'POST',
  headers: getAuthHeaders(),
  body: JSON.stringify(memberData),
});

if (!response.ok) throw new Error('Failed to create member');

// New
try {
  await membersAPI.create(memberData);
  // Handle success
} catch (error) {
  setError(error.message || 'Failed to create member');
}
```

### 5. EditMember.jsx (Medium Priority)
**Uses:** PUT /api/members/:id, GET /api/members

**Changes Needed:**
1. Import: `import { membersAPI } from '../utils/api';`
2. Replace fetch for getting members
3. Replace fetch for updating member

### 6. EditBooks.jsx (Medium Priority)
**Uses:** PUT /api/books/:id, DELETE /api/books/:id, GET /api/books

**Changes Needed:**
1. Import: `import { booksAPI } from '../utils/api';`
2. Replace fetch for getting books
3. Replace fetch for updating book
4. Replace fetch for deleting book

**Example Update (Update):**
```javascript
// Old
const response = await fetch(`http://localhost:5000/api/books/${id}`, {
  method: 'PUT',
  headers: getAuthHeaders(),
  body: JSON.stringify(bookData),
});

if (!response.ok) throw new Error('Failed to update');

// New
try {
  await booksAPI.update(id, bookData);
  // Handle success
} catch (error) {
  setError(error.message || 'Failed to update book');
}
```

### 7. Information.jsx (Low Priority)
**Uses:** Possibly GET /api/books or other APIs

**Changes Needed:**
- Check what APIs are used
- Follow the same pattern above

### 8. Navigation.jsx (Low Priority)
**Uses:** Check if any API calls exist

---

## ✨ Additional Improvements (Optional)

After replacing fetch calls, consider:

### 1. Add Loading States
```javascript
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await booksAPI.getAll();
      setBooks(data);
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };
  
  fetchData();
}, []);

// In JSX
{loading && <p>Loading...</p>}
```

### 2. Add Error Display
```javascript
{error && (
  <div className="error-message">
    <p>{error}</p>
    <button onClick={() => setError('')}>Dismiss</button>
  </div>
)}
```

### 3. Add Success Messages
```javascript
const [success, setSuccess] = useState('');

try {
  await booksAPI.create(bookData);
  setSuccess('Book created successfully!');
  setTimeout(() => setSuccess(''), 3000);
} catch (error) {
  setError(error.message);
}
```

---

## 🔍 Testing Your Changes

After refactoring each page:

1. **Clear localStorage** (to prevent auth issues)
   ```javascript
   localStorage.clear();
   ```

2. **Log in again** with test credentials:
   - Email: `admin@library.com`
   - Password: `admin123`

3. **Reload the page** and verify:
   - Data loads correctly
   - No console errors
   - No "fetch is not defined" errors
   - API calls show in Network tab with new response format

4. **Test error handling:**
   - Try invalid inputs
   - Check error messages display
   - Verify refresh works properly

---

## 📋 Refactoring Checklist

- [ ] Borrowings.jsx - Admin view
- [ ] MyBorrowingActivities.jsx - User view
- [ ] signup.jsx - User registration
- [ ] Addmember.jsx - Create member
- [ ] EditMember.jsx - Update member
- [ ] EditBooks.jsx - Update/delete books
- [ ] Information.jsx - Info page
- [ ] Navigation.jsx - Check for API calls

---

## 🆘 If You Get Stuck

### Common Issues & Solutions

**Issue:** `getAuthHeaders is not defined`
- ✅ Replace with `import { booksAPI } from '../utils/api';`
- The API service handles auth headers automatically

**Issue:** `Cannot read property 'data' of undefined`
- ✅ The API service returns the data directly
- Use `const books = await booksAPI.getAll();`
- Not `const books = response.data.books;`

**Issue:** Response format has changed
- ✅ The new backend returns `{ success, message, data }`
- The API service extracts the `data` automatically
- Your components get clean data directly

**Issue:** Token not being sent with requests
- ✅ The API service automatically includes tokens
- No need to use `getAuthHeaders()` anymore
- Verify localStorage has 'authToken' key

---

## 💡 Pro Tips

1. **Use VS Code Find & Replace**
   - Search: `http://localhost:5000/api/`
   - This shows all fetch calls to replace

2. **One Page at a Time**
   - Refactor one page completely
   - Test it works
   - Move to next page

3. **Keep Error Messages**
   - Keep user-friendly error messages
   - Display them in the UI

4. **Test with Admin Account**
   - Admin can access all features
   - Easier to test all APIs

5. **Check Network Tab**
   - Open DevTools (F12)
   - Go to Network tab
   - Watch API calls and responses
   - Verify new response format

---

## 📚 Reference

### API Service Reference

```javascript
import { authAPI, booksAPI, membersAPI, borrowingsAPI } from '../utils/api';

// Auth
await authAPI.signup({ name, email, password })
await authAPI.login(email, password)

// Books
await booksAPI.getAll()
await booksAPI.create(bookData)
await booksAPI.update(id, bookData)
await booksAPI.delete(id)

// Members
await membersAPI.getAll()
await membersAPI.create(memberData)
await membersAPI.update(id, memberData)
await membersAPI.delete(id)

// Borrowings
await borrowingsAPI.getAllAdmin()
await borrowingsAPI.getMy()
await borrowingsAPI.create(borrowData)
await borrowingsAPI.return(borrowingId)
```

### Key Points
- All functions are async
- They return the data directly (not wrapped in response)
- Errors throw exceptions (use try/catch)
- Auth token is automatically included
- API base is http://localhost:5000

---

**Happy Refactoring! 🚀**

You've got this! The pattern is simple and consistent across all pages.

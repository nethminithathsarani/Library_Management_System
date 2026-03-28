# Quick Start Guide - After Refactoring

## 🚀 Getting Started with Refactored Code

### Step 1: Start the Servers

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
# Server running on http://localhost:5000
```

**Terminal 2 - Frontend:**
```bash
cd frontend  
npm run dev
# Server running on http://localhost:5174
```

### Step 2: Verify Everything Works

1. Open http://localhost:5174 in your browser
2. Click "Login"
3. Use credentials:
   - Email: `admin@library.com`
   - Password: `admin123`
4. Should see admin dashboard
5. Check books page - should load

### Step 3: Check Console for Errors

Open DevTools:
- Press F12
- Go to Console tab
- No errors should appear
- Check Network tab
- API calls should show new response format

---

## 📂 Where to Find Things

### Backend Code Location
```
backend/
├── controllers/authController.js       ✨ Auth logic
├── controllers/bookController.js       ✨ Book logic
├── controllers/memberController.js     ✨ Member logic
├── controllers/borrowingController.js  ✨ Borrowing logic
├── routes/                             ✨ Route definitions
├── utils/responseHandler.js            ✨ Standardized responses
├── utils/validation.js                 ✨ Input validation
├── utils/dateHelper.js                 ✨ Date utilities
├── middleware/                         ✏️ Auth/role checks
└── index.js                            ✏️ Main server file
```

### Frontend Code Location
```
frontend/src/
├── utils/api.js                        ✨ API service for backend
├── Pages/Login.jsx                     ✅ Updated - uses API service
├── Pages/Home.jsx                      ✅ Updated - uses API service
├── Pages/AddBooks.jsx                  ✅ Updated - uses API service
├── Pages/*.jsx                         📋 Ready for same updates
└── Components/                         ✏️ UI components
```

---

## 🔨 Common Tasks

### Add a New API Endpoint

**1. Create controller function** (`backend/controllers/bookController.js`)
```javascript
export const getBookById = (req, res, next) => {
  try {
    const { id } = req.params;
    const sql = 'SELECT * FROM books WHERE id = ? LIMIT 1';
    
    db.query(sql, [id], (err, results) => {
      if (err) {
        sendServerError(res, err, 'Failed to fetch book');
        return;
      }
      
      if (!results.length) {
        sendError(res, 404, 'Book not found');
        return;
      }
      
      sendSuccess(res, 200, 'Book retrieved', results[0]);
    });
  } catch (error) {
    sendServerError(res, error, 'Failed to fetch book');
  }
};
```

**2. Add route** (`backend/routes/bookRoutes.js`)
```javascript
router.get('/:id', getBookById);
```

**3. Add API service method** (`frontend/src/utils/api.js`)
```javascript
getById: async (id) => {
  const response = await request(`/books/${id}`);
  return response.data;
},
```

**4. Use in component**
```javascript
import { booksAPI } from '../utils/api';

const book = await booksAPI.getById(id);
```

### Fix a Bug

1. Find the issue in code
2. Make changes
3. Server auto-reloads (dev mode)
4. Refresh browser
5. Check console for errors

### Add Validation

1. Add to `backend/utils/validation.js`
2. Use in controller
3. Test with API call

### Change a Response Message

Update in controller, then update frontend to handle if needed. The API service extracts messages automatically.

---

## 🧪 Testing Checklist

### Backend Tests
- [ ] `npm run dev` starts without errors
- [ ] MySQL connection successful
- [ ] GET /api/books returns books with new format
- [ ] POST /api/auth/login works
- [ ] Protected routes need Bearer token
- [ ] Admin routes blocked for non-admin
- [ ] Create/update/delete operations work

### Frontend Tests
- [ ] http://localhost:5174 loads
- [ ] Can login successfully
- [ ] Home page shows books
- [ ] Can add books (admin)
- [ ] Can borrow books
- [ ] Can view borrowing history
- [ ] Navigation works
- [ ] Logout works

### Integration Tests
- [ ] Login → Redirects to correct page
- [ ] Create book → Shows in list
- [ ] Borrow book → Shows in borrowing
- [ ] Return book → Status updates
- [ ] Edit member → Changes saved
- [ ] Delete item → Removed from list

---

## 📊 API Response Format

### Success Response
```json
{
  "success": true,
  "message": "Operation successful",
  "data": { /* your data */ }
}
```

### Error Response
```json
{
  "success": false,
  "message": "Error description"
}
```

### Examples

**GET /api/books (Success)**
```json
{
  "success": true,
  "message": "Books retrieved successfully",
  "data": [
    { "id": 1, "title": "Book 1", "author": "Author 1" },
    { "id": 2, "title": "Book 2", "author": "Author 2" }
  ]
}
```

**POST /api/books (Error - Validation)**
```json
{
  "success": false,
  "message": "Missing required fields: title, author"
}
```

**POST /api/auth/login (Success)**
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": 1,
      "name": "Admin User",
      "email": "admin@library.com",
      "role": "admin"
    }
  }
}
```

---

## 🛠️ Troubleshooting

### "Cannot find module" Error
- **Cause:** Wrong import path
- **Fix:** Check import paths match new folder structure
- **Example:** Change `from './bookController.js'` to `from '../controllers/bookController.js'`

### "Undefined is not a function" Error
- **Cause:** Using old getAuthHeaders() 
- **Fix:** Use API service instead, which handles auth automatically

### CORS Error
- **Cause:** Frontend and backend not running on expected ports
- **Fix:** Verify backend on 5000, frontend on 5174
- **Check:** `api.js` has correct `API_BASE = 'http://localhost:5000/api'`

### "API still shows old response format"
- **Cause:** Browser cache
- **Fix:** Hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

### Token Expired / Not Sending
- **Cause:** localStorage issue
- **Fix:** Check DevTools → Application → localStorage for authToken
- **Check:** Network tab shows Authorization header

### Port Already in Use
- **Cause:** Server already running
- **Fix:** Kill process on port or use different port
- **Command:** `lsof -ti :5000 | xargs kill -9` (Mac/Linux)

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| **PROJECT_SUMMARY.md** | Overview of everything done |
| **CODE_REFACTORING_SUMMARY.md** | Detailed before/after |
| **BACKEND_REFACTORING.md** | Backend changes explained |
| **FRONTEND_REFACTORING_GUIDE.md** | How to finish frontend |
| **TESTING_REPORT.md** | Verification status |

---

## 💡 Tips & Tricks

### VS Code Extensions Helpful
- REST Client - Test API calls in editor
- Thunder Client - Like Postman in VS Code
- Prettier - Format code automatically
- ESLint - Find code issues

### Test API Calls
**With REST Client:**
```
POST http://localhost:5000/api/auth/login
Content-Type: application/json

{
  "email": "admin@library.com",
  "password": "admin123"
}
```

### Debug Code
**Frontend:**
```javascript
console.log('Debug:', variable);
// Then check DevTools Console
```

**Backend:**
```javascript
console.log('Debug:', data);
// Output appears in terminal
```

### Check Database
```sql
-- In MySQL CLI
SELECT * FROM books;
SELECT * FROM members;
SELECT * FROM borrowings;
```

---

## 🎯 Next Development Steps

1. **Complete Frontend Refactoring**
   - Update 7 remaining pages
   - Follow `FRONTEND_REFACTORING_GUIDE.md`
   - ~2-3 hours work

2. **Add Feature: Search/Filter**
   - Add search input on Home page
   - Filter books by title, author, genre

3. **Add Feature: Pagination**
   - Show 10 books per page
   - Add Next/Previous buttons

4. **Improve UX**
   - Add loading spinners
   - Add success/error notifications
   - Confirm before delete

5. **Polish UI**
   - Improve styling
   - Better error messages
   - Mobile responsive

---

## ✅ After You Complete Refactoring

The project will be:
- ✅ Well-organized
- ✅ Easy to maintain
- ✅ Easy to extend
- ✅ Follows best practices
- ✅ Production-ready
- ✅ Ready for features

---

## 🆘 Need Help?

### Check These Files First
1. Relevant documentation file (see table above)
2. Code comments in the refactored files
3. Error message console
4. Network tab in DevTools

### Common Questions
**Q: Where do I add new features?**
A: Follow the pattern:
- Controller logic → Backend
- UI → Frontend component
- API comm → Use api.js service

**Q: How do I test my changes?**
A: Use REST Client or postman,check console for errors, verify in browser

**Q: Can I use the old code still?**
A: Yes! Old files are preserved. But use new structure for any changes.

**Q: What if something breaks?**
A: Check the error message, search that in documentation, read the guide for that page

---

## 📞 Quick Reference Card

### Start Dev Servers
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd frontend && npm run dev
```

### Key URLs
- **Frontend:** http://localhost:5174
- **Backend:** http://localhost:5000
- **API Base:** http://localhost:5000/api

### Default Test Credentials
- **Admin Email:** admin@library.com
- **Admin Password:** admin123
- **User Email:** user1@library.com
- **User Password:** user123

### Important Folders
- **Backend Controllers:** `backend/controllers/`
- **Backend Routes:** `backend/routes/`
- **Frontend Pages:** `frontend/src/Pages/`
- **API Service:** `frontend/src/utils/api.js`

### Common Commands
```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Format code
npm run lint

# Run tests (if set up)
npm test
```

---

**You're all set! Happy coding! 🚀**

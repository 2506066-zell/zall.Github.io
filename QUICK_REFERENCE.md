# 🚀 Quick Reference Guide - Digital Library IPM

## Login Credentials

### Demo Accounts (Auto-created on first load)
```
Admin Account:
  URL: /index.html
  Username: admin
  Password: admin123
  Role: Admin
  
Regular User:
  URL: /index.html
  Username: user
  Password: user123
  Role: User
```

### Register New Account
```
URL: /register.html
Steps:
  1. Enter fullname
  2. Enter password (min 6 chars)
  3. Confirm password
  4. Select ranting type (Ranting Sekolah / Ranting Masjid)
  5. Enter ranting name
  6. Submit
  → Auto-login after successful registration
```

---

## Page Navigation

### For Regular Users
```
/index.html (Login)
    ↓
/dashboard.html (Home)
├─ /books.html (View Books)
├─ /borrow.html (Borrow & Return Books)
├─ /return.html (Return Books)
└─ [Admin links hidden]
```

### For Admin Users
```
/index.html (Login)
    ↓
/admin.html (Admin Dashboard)
├─ Tab 1: Manajemen Anggota
│  ├─ View all users
│  ├─ Search & filter
│  ├─ View user details
│  ├─ Toggle user status
│  └─ Delete users
├─ Tab 2: Riwayat Peminjaman
│  ├─ View all borrows
│  ├─ Identify late returns
│  └─ View borrow details
└─ + All user features
```

---

## Main Features

### 1. User Registration
- ✅ 2-step form (Personal + Ranting)
- ✅ Username auto-generated
- ✅ Password validation (min 6 chars)
- ✅ Auto-login after registration
- ✅ Auto-redirect to dashboard

### 2. Login System
- ✅ Validates against registered users
- ✅ Role-based access (User/Admin)
- ✅ Session management
- ✅ Logout confirmation

### 3. Book Management
- ✅ View available books in table
- ✅ Add new books
- ✅ Book status tracking
- 6 default books included

### 4. Borrow System
- ✅ Visual book selection
- ✅ Choose duration (7/14/21/30 days)
- ✅ Add notes/remarks
- ✅ View borrow history
- ✅ Extend borrow (add 7 days)
- ✅ Mark as returned
- ✅ Late detection & highlighting

### 5. Admin Features
- ✅ Manage all users
- ✅ View user statistics
- ✅ Search & filter users
- ✅ View user details (modal)
- ✅ Toggle user active/inactive
- ✅ Delete users
- ✅ View all borrow history
- ✅ Identify late returns
- ✅ Borrow statistics
- ✅ Search & filter borrows

---

## Key Functions in script.js

### Global
```javascript
openModal(modalId)           // Open modal
closeModal(modalId)          // Close modal
logout()                     // Logout & redirect
```

### Dashboard
```javascript
loadDashboardData()          // Load user info
```

### Books
```javascript
getBooks()                   // Get books from localStorage
saveBooks(books)             // Save books
loadBooks()                  // Populate books table
addBook()                    // Add new book
```

### Borrow
```javascript
getBorrows()                 // Get borrows
saveBorrows(borrows)         // Save borrows
loadBorrowHistory()          // Display borrow history
viewBorrowDetail(borrowId)   // Show detail modal
searchBorrowHistory()        // Search & filter
```

### Admin
```javascript
getUsers()                   // Get all users
saveUsers(users)             // Save users
loadUsers()                  // Load & display users
displayUsers(users)          // Populate users table
searchUsers()                // Search & filter users
viewUserDetail(userId)       // Show user detail modal
toggleUserStatus(id, name)   // Enable/disable user
confirmDeleteUser(id, name)  // Delete user
updateBorrowStats()          // Calculate stats
switchAdminTab(tabName)      // Switch tabs
```

---

## Data Structure

### User Object
```javascript
{
  id: 1,
  username: "john_doe",
  fullname: "John Doe",
  password: "secret123",
  rantingName: "SMA Muhammadiyah",
  rantingType: "Ranting Sekolah",
  role: "user",              // "user" or "admin"
  status: "active",          // "active" or "inactive"
  createdAt: "2024-01-15T..."
}
```

### Borrow Object
```javascript
{
  id: 1,
  username: "john_doe",
  bookId: 1,
  book: "Pemrograman JavaScript",
  author: "Kyle Simpson",
  borrowDate: "15/01/2024",
  dueDate: "22/01/2024",
  status: "Aktif",           // "Aktif" or "Dikembalikan"
  notes: "Untuk project"     // optional
}
```

### Book Object
```javascript
{
  id: 1,
  title: "Pemrograman JavaScript",
  author: "Kyle Simpson",
  category: "Teknologi",
  status: "tersedia"         // "tersedia" or "borrowed"
}
```

---

## Storage Keys (localStorage)

```javascript
localStorage.getItem('users')              // Array of users
localStorage.getItem('currentUser')        // Logged-in user
localStorage.getItem('userBorrows')        // Array of borrows
localStorage.getItem('books')              // Array of books
localStorage.getItem('logs')               // Optional: activity logs
```

---

## Common Tasks

### Register New User
1. Go to `/register.html`
2. Fill in fullname, password
3. Select ranting type and name
4. Click "Daftar Sekarang"
5. Auto-redirected to dashboard

### Borrow a Book
1. Go to `/borrow.html`
2. Click book card
3. Select duration
4. Add optional notes
5. Click "Konfirmasi Peminjaman"
6. View in riwayat peminjaman

### Return a Book
1. Go to `/borrow.html`
2. Find book in riwayat
3. Click "Kembalikan" button
4. Status changes to "Dikembalikan"

### Admin: Manage Users
1. Login as admin
2. Go to `/admin.html`
3. Tab 1 "Manajemen Anggota"
4. Search, view, delete, or toggle users

### Admin: View Borrows
1. Login as admin
2. Go to `/admin.html`
3. Tab 2 "Riwayat Peminjaman"
4. See all users' borrows with status
5. Identify late returns (highlighted)

---

## Troubleshooting

### Problem: Can't login
**Solution**: 
- Check username/password spelling
- Make sure role matches (admin/user)
- Try demo accounts first: admin/admin123

### Problem: Registration not saving
**Solution**:
- Check browser's localStorage is enabled
- Look at browser console for errors
- Try different browser if issue persists

### Problem: Admin dashboard won't load
**Solution**:
- Must be logged in as admin role
- Try login as admin user first
- Check browser console for JS errors

### Problem: Borrow history empty
**Solution**:
- Only shows borrows for logged-in user
- Admin sees all borrows in Tab 2
- Try adding a new borrow record

### Problem: Late books not showing
**Solution**:
- Duedate must be in past
- Status must be "Aktif"
- Check system date/time

---

## Browser Requirements

- Modern browser (Chrome, Firefox, Safari, Edge)
- JavaScript enabled
- localStorage enabled
- Cookies enabled (optional)

---

## Performance Tips

- Clear localStorage if app behaves strangely: `localStorage.clear()`
- Refresh page: `F5` or `Ctrl+R`
- Hard refresh: `Ctrl+Shift+R`

---

## For Developers

### Access Console
```
Press: F12 or Ctrl+Shift+I
Check: Console tab for errors
```

### Inspect Storage
```
DevTools → Application → LocalStorage
View all keys and values
```

### Debug Functions
```javascript
// In console:
JSON.parse(localStorage.getItem('users'))        // View all users
JSON.parse(localStorage.getItem('currentUser'))  // View logged-in user
JSON.parse(localStorage.getItem('userBorrows'))  // View all borrows
```

### Clear Data (Reset)
```javascript
// In console:
localStorage.clear()  // Clear all
// Then refresh page to reinitialize
```

---

## Support Files

- **SYSTEM_OVERVIEW.md**: Complete system documentation
- **PERBAIKAN_RINGKASAN.md**: Summary of improvements
- **script.js**: All core functionality (450 lines)
- **style.css**: Styling and themes

---

**Version**: 2.0
**Status**: Stable & Tested
**Last Updated**: 2024

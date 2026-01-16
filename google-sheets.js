// google-sheets.js
// Integrasi Google Sheets untuk menyimpan data registrasi user

// PENTING: Ganti URL di bawah dengan URL Web App dari Google Apps Script Anda
// Lihat instruksi di GOOGLE_SHEETS_SETUP.md
const GOOGLE_SHEETS_WEB_APP_URL = 'https://script.google.com/macros/d/YOUR_DEPLOYMENT_ID/usep'; // GANTI DENGAN URL ANDA

// ==================== GOOGLE SHEETS INTEGRATION ====================

/**
 * Mengirim data registrasi user ke Google Sheets
 * @param {Object} userData - Data user yang akan disimpan
 * @param {string} userData.username - Username user
 * @param {string} userData.password - Password user (jangan lupa hash di production)
 * @param {string} userData.email - Email user
 * @param {string} userData.fullname - Nama lengkap user
 * @param {string} userData.school - Sekolah/Kampus user
 * @param {string} userData.rantingName - Nama ranting IPM
 * @param {string} userData.rantingType - Tipe ranting (Inti/Biasa)
 * @param {string} userData.role - Role user (user/admin)
 * @returns {Promise<Object>} Hasil dari Google Sheets (success/error)
 */
async function sendUserToGoogleSheets(userData) {
    try {
        // Validasi URL Web App
        if (!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL.includes('YOUR_DEPLOYMENT_ID')) {
            console.warn('⚠️ Google Sheets Web App URL belum dikonfigurasi');
            return { 
                success: false, 
                warning: true,
                message: 'Google Sheets belum dikonfigurasi. Hanya tersimpan di localStorage.'
            };
        }
        
        // Prepare data
        const timestamp = new Date().toLocaleString('id-ID');
        const payload = {
            action: 'addUser',
            data: {
                timestamp: timestamp,
                username: userData.username,
                password: userData.password,
                email: userData.email || '',
                fullname: userData.fullname || '',
                school: userData.school || '',
                rantingName: userData.rantingName || '',
                rantingType: userData.rantingType || '',
                role: userData.role || 'user',
                status: 'active',
                createdAt: new Date().toISOString()
            }
        };
        
        // Send to Google Sheets Web App
        const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',  // Important untuk menghindari CORS issues
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('✓ Data berhasil dikirim ke Google Sheets');
        return { 
            success: true, 
            message: 'Data berhasil tersimpan ke Google Sheets'
        };
        
    } catch (error) {
        console.error('Error sending to Google Sheets:', error);
        return { 
            success: false, 
            error: error.message,
            message: 'Gagal mengirim ke Google Sheets, tapi data tersimpan di localStorage'
        };
    }
}

/**
 * Kirim data buku ke Google Sheets
 */
async function sendBookToGoogleSheets(bookData) {
    try {
        if (!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL.includes('YOUR_DEPLOYMENT_ID')) {
            console.warn('⚠️ Google Sheets Web App URL belum dikonfigurasi');
            return { success: false, warning: true };
        }
        
        const timestamp = new Date().toLocaleString('id-ID');
        const payload = {
            action: 'addBook',
            data: {
                timestamp: timestamp,
                id: bookData.id,
                title: bookData.title,
                author: bookData.author,
                category: bookData.category,
                status: bookData.status || 'tersedia',
                createdAt: new Date().toISOString()
            }
        };
        
        const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('✓ Data buku berhasil dikirim ke Google Sheets');
        return { success: true };
        
    } catch (error) {
        console.error('Error sending book to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}

/**
 * Kirim data peminjaman ke Google Sheets
 */
async function sendBorrowToGoogleSheets(borrowData) {
    try {
        if (!GOOGLE_SHEETS_WEB_APP_URL || GOOGLE_SHEETS_WEB_APP_URL.includes('YOUR_DEPLOYMENT_ID')) {
            console.warn('⚠️ Google Sheets Web App URL belum dikonfigurasi');
            return { success: false, warning: true };
        }
        
        const timestamp = new Date().toLocaleString('id-ID');
        const payload = {
            action: 'addBorrow',
            data: {
                timestamp: timestamp,
                id: borrowData.id,
                username: borrowData.username,
                book: borrowData.book,
                author: borrowData.author,
                borrowDate: borrowData.borrowDate,
                dueDate: borrowData.dueDate,
                status: borrowData.status,
                notes: borrowData.notes || '',
                createdAt: new Date().toISOString()
            }
        };
        
        const response = await fetch(GOOGLE_SHEETS_WEB_APP_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload)
        });
        
        console.log('✓ Data peminjaman berhasil dikirim ke Google Sheets');
        return { success: true };
        
    } catch (error) {
        console.error('Error sending borrow to Google Sheets:', error);
        return { success: false, error: error.message };
    }
}
    // First, get existing data to determine new ID
    const existingData = await fetchFromSheet(sheetName);
    const newId = existingData.length > 0 ? 
      Math.max(...existingData.map(item => parseInt(item.id) || 0)) + 1 : 1;
    
    // Add ID to data
    data.id = newId;
    data.created_at = new Date().toISOString().split('T')[0];
    
    // Convert data object to array
    const headers = Object.keys(data);
    const values = headers.map(header => data[header]);
    
    // URL for appending
    const url = `${BASE_URL}/${sheetName}!A:Z:append?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [values]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return { success: true, id: newId, data: data };
    
   catch (error) {
    console.error(`Error appending to ${sheetName}:`, error);
    return { success: false, error: error.message };
  }


async function updateInSheet(sheetName, id, updatedData) {
  try {
    // Get all data to find row number
    const allData = await fetchFromSheet(sheetName);
    const rowIndex = allData.findIndex(item => item.id == id);
    
    if (rowIndex === -1) {
      return { success: false, error: 'Data not found' };
    }
    
    // Row number in sheet (add 2 for header row and 1-based index)
    const rowNumber = rowIndex + 2;
    
    // Get headers
    const urlForHeaders = `${BASE_URL}/${sheetName}!A1:Z1?key=${API_KEY}`;
    const headersResponse = await fetch(urlForHeaders);
    const headersData = await headersResponse.json();
    const headers = headersData.values[0];
    
    // Prepare update data
    const updateData = {};
    headers.forEach(header => {
      updateData[header] = updatedData[header] || '';
    });
    updateData.id = id;
    updateData.updated_at = new Date().toISOString().split('T')[0];
    
    // Convert to array
    const values = headers.map(header => updateData[header]);
    
    // Update URL
    const updateUrl = `${BASE_URL}/${sheetName}!A${rowNumber}:Z${rowNumber}?valueInputOption=USER_ENTERED&key=${API_KEY}`;
    
    const response = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        values: [values]
      })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return { success: true, data: updateData };
    
  } catch (error) {
    console.error(`Error updating ${sheetName}:`, error);
    return { success: false, error: error.message };
  }
}

async function deleteFromSheet(sheetName, id) {
  try {
    // Note: Google Sheets API doesn't support direct row deletion via simple API
    // We'll mark as deleted instead
    const dataToUpdate = { status: 'deleted' };
    return await updateInSheet(sheetName, id, dataToUpdate);
    
  } catch (error) {
    console.error(`Error deleting from ${sheetName}:`, error);
    return { success: false, error: error.message };
  }
}

// ==================== SPECIFIC FUNCTIONS ====================
// User functions
async function loginUser(username, password) {
  const users = await fetchFromSheet(SHEET_NAMES.users);
  const user = users.find(u => u.username === username && u.password === password);
  
  if (user) {
    // Don't store password in localStorage
    const { password, ...userWithoutPassword } = user;
    localStorage.setItem('currentUser', JSON.stringify(userWithoutPassword));
    
    // Log the login
    await appendToSheet(SHEET_NAMES.logs, {
      user: username,
      action: 'login',
      details: `User ${username} logged in`,
      timestamp: new Date().toISOString()
    });
    
    return { success: true, user: userWithoutPassword };
  }
  
  return { success: false, error: 'Invalid username or password' };
}

async function registerUser(userData) {
  // Check if username exists
  const users = await fetchFromSheet(SHEET_NAMES.users);
  const existingUser = users.find(u => u.username === userData.username);
  
  if (existingUser) {
    return { success: false, error: 'Username already exists' };
  }
  
  // Add default role if not provided
  if (!userData.role) {
    userData.role = 'user';
  }
  
  return await appendToSheet(SHEET_NAMES.users, userData);
}

// Book functions
async function getAllBooks(search = '', category = '', status = '') {
  let books = await fetchFromSheet(SHEET_NAMES.books);
  
  // Filter out deleted books
  books = books.filter(book => book.status !== 'deleted');
  
  // Apply filters
  if (search) {
    books = books.filter(book => 
      book.title.toLowerCase().includes(search.toLowerCase()) ||
      book.author.toLowerCase().includes(search.toLowerCase())
    );
  }
  
  if (category) {
    books = books.filter(book => book.category === category);
  }
  
  if (status) {
    books = books.filter(book => book.status === status);
  }
  
  return books;
}

async function addBook(bookData) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser || currentUser.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }
  
  const result = await appendToSheet(SHEET_NAMES.books, bookData);
  
  if (result.success) {
    // Log the action
    await appendToSheet(SHEET_NAMES.logs, {
      user: currentUser.username,
      action: 'add_book',
      details: `Added book: ${bookData.title}`,
      timestamp: new Date().toISOString()
    });
  }
  
  return result;
}

async function updateBook(bookId, bookData) {
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  if (!currentUser || currentUser.role !== 'admin') {
    return { success: false, error: 'Unauthorized' };
  }
  
  const result = await updateInSheet(SHEET_NAMES.books, bookId, bookData);
  
  if (result.success) {
    // Log the action
    await appendToSheet(SHEET_NAMES.logs, {
      user: currentUser.username,
      action: 'update_book',
      details: `Updated book ID: ${bookId}`,
      timestamp: new Date().toISOString()
    });
  }
  
  return result;
}

async function borrowBook(bookId, userId) {
  // Check if book is available
  const books = await fetchFromSheet(SHEET_NAMES.books);
  const book = books.find(b => b.id == bookId && b.status === 'Tersedia');
  
  if (!book) {
    return { success: false, error: 'Book not available' };
  }
  
  // Create borrow record
  const borrowData = {
    user_id: userId,
    book_id: bookId,
    borrow_date: new Date().toISOString().split('T')[0],
    due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 14 days
    return_date: '',
    status: 'Dipinjam'
  };
  
  const result = await appendToSheet(SHEET_NAMES.borrows, borrowData);
  
  if (result.success) {
    // Update book status
    await updateBook(bookId, { status: 'Dipinjam' });
    
    // Log the action
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    await appendToSheet(SHEET_NAMES.logs, {
      user: currentUser.username,
      action: 'borrow_book',
      details: `Borrowed book: ${book.title}`,
      timestamp: new Date().toISOString()
    });
  }
  
  return result;
}

// ==================== EXPORT FUNCTIONS ====================
window.GoogleSheetsDB = {
  // Config
  SHEET_ID,
  SHEET_NAMES,
  
  // User functions
  loginUser,
  registerUser,
  
  // Book functions
  getAllBooks,
  addBook,
  updateBook,
  deleteBook: (bookId) => updateBook(bookId, { status: 'deleted' }),
  
  // Borrow functions
  borrowBook,
  
  // Helper functions
  fetchFromSheet,
  appendToSheet,
  updateInSheet
};
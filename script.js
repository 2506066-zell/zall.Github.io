// ==================== GLOBAL FUNCTIONS ====================

function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'flex';
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.style.display = 'none';
    }
}

function logout() {
    if (confirm('Yakin ingin logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    }
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.style.display = 'none';
    }
}

// ==================== DASHBOARD FUNCTIONS ====================

function loadDashboardData() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser) {
        document.getElementById('userName').textContent = currentUser.fullname || currentUser.username;
    }
}

// ==================== BOOK FUNCTIONS ====================

function getBooks() {
    return JSON.parse(localStorage.getItem('books')) || [
        { id: 1, title: 'Pemrograman JavaScript', author: 'Kyle Simpson', category: 'Teknologi', status: 'tersedia' },
        { id: 2, title: 'Data Science Handbook', author: 'Jake VanderPlas', category: 'Data Science', status: 'tersedia' },
        { id: 3, title: 'Machine Learning Basics', author: 'Andrew Ng', category: 'AI', status: 'tersedia' },
        { id: 4, title: 'Web Development', author: 'Jon Duckett', category: 'Web', status: 'tersedia' },
        { id: 5, title: 'Database Design', author: 'C.J. Date', category: 'Database', status: 'tersedia' },
        { id: 6, title: 'Cloud Computing', author: 'Mark Shuttleworth', category: 'Cloud', status: 'tersedia' }
    ];
}

function saveBooks(books) {
    localStorage.setItem('books', JSON.stringify(books));
}

function loadBooks() {
    const books = getBooks();
    const tbody = document.querySelector('#booksTable tbody');
    
    if (!tbody) return;
    
    if (books.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" class="no-data"><i class="fas fa-inbox"></i> Belum ada buku</td></tr>';
        return;
    }
    
    tbody.innerHTML = books.map(book => `
        <tr>
            <td>${book.id}</td>
            <td><strong>${book.title}</strong></td>
            <td>${book.author}</td>
            <td>${book.category}</td>
            <td><span class="badge ${book.status === 'tersedia' ? 'badge-available' : 'badge-borrowed'}">${book.status}</span></td>
            <td>
                <button class="btn-action btn-borrow" onclick="alert('Pinjam dari halaman Peminjaman')" title="Pinjam">
                    <i class="fas fa-hand-holding"></i>
                </button>
            </td>
        </tr>
    `).join('');
}

function loadBooksGrid() {
    const books = getBooks();
    const bookGrid = document.getElementById('bookGrid');
    
    if (!bookGrid) return;
    
    if (books.length === 0) {
        bookGrid.innerHTML = '<div style="text-align: center; padding: 40px; color: #999;"><i class="fas fa-inbox" style="font-size: 48px; margin-bottom: 10px;"></i><p>Belum ada buku</p></div>';
        return;
    }
    
    bookGrid.innerHTML = books.map(book => {
        // Generate random emoji cover
        const covers = ['📕', '📗', '📘', '📙', '📓', '📔'];
        const cover = covers[book.id % covers.length];
        
        return `
            <div class="book-card">
                <div class="book-cover">${cover}</div>
                <div class="book-info">
                    <h3>${book.title}</h3>
                    <p class="book-author"><strong>Penulis:</strong> ${book.author}</p>
                    <p class="book-category"><span class="book-category-tag">${book.category}</span></p>
                    <p style="font-size: 13px; color: #999; margin-top: 8px;">
                        <strong>Status:</strong> <span class="badge ${book.status === 'tersedia' ? 'badge-available' : 'badge-borrowed'}">${book.status}</span>
                    </p>
                    <button type="button" class="btn-action btn-borrow btn-small" onclick="alert('Pinjam dari halaman Peminjaman')" style="width: 100%; margin-top: 10px;">
                        <i class="fas fa-hand-holding"></i> Lihat Detail
                    </button>
                </div>
            </div>
        `;
    }).join('');
}

function addBook() {
    const title = document.getElementById('bookTitle')?.value.trim();
    const author = document.getElementById('bookAuthor')?.value.trim();
    const category = document.getElementById('bookCategory')?.value;
    
    // Validasi
    if (!title) {
        alert('❌ Judul buku harus diisi!');
        document.getElementById('bookTitle')?.focus();
        return false;
    }
    
    if (!author) {
        alert('❌ Nama penulis harus diisi!');
        document.getElementById('bookAuthor')?.focus();
        return false;
    }
    
    if (!category) {
        alert('❌ Kategori harus dipilih!');
        document.getElementById('bookCategory')?.focus();
        return false;
    }
    
    // Cek duplikasi judul
    const books = getBooks();
    if (books.some(b => b.title.toLowerCase() === title.toLowerCase())) {
        alert('❌ Buku dengan judul ini sudah ada!');
        return false;
    }
    
    // Buat buku baru
    const newBook = {
        id: Math.max(...books.map(b => b.id), 0) + 1,
        title,
        author,
        category,
        status: 'tersedia'
    };
    
    // Simpan
    books.push(newBook);
    saveBooks(books);
    
    // Clear form
    document.getElementById('bookTitle').value = '';
    document.getElementById('bookAuthor').value = '';
    document.getElementById('bookCategory').value = '';
    
    // Close modal
    closeModal('addBookModal');
    
    // Reload
    loadBooksGrid();
    
    // Success message
    alert('✅ Buku "' + title + '" berhasil ditambahkan!');
    return true;
}

// ==================== BORROW FUNCTIONS ====================

function getBorrows() {
    return JSON.parse(localStorage.getItem('userBorrows')) || [];
}

function saveBorrows(borrows) {
    localStorage.setItem('userBorrows', JSON.stringify(borrows));
}

function loadBorrowHistory() {
    const borrows = getBorrows();
    const tbody = document.getElementById('borrowHistoryTableBody');
    
    if (!tbody) return;
    
    if (borrows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="no-data"><i class="fas fa-inbox"></i> Belum ada riwayat peminjaman</td></tr>`;
        return;
    }
    
    const sortedBorrows = borrows.sort((a, b) => new Date(b.borrowDate) - new Date(a.borrowDate));
    
    tbody.innerHTML = sortedBorrows.map(borrow => {
        const dueDate = new Date(borrow.dueDate);
        const today = new Date();
        const isLate = today > dueDate && borrow.status === 'Aktif';
        const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
        
        let statusBadge = '';
        let statusClass = '';
        
        if (borrow.status === 'Aktif') {
            statusBadge = isLate ? '<span class="badge badge-late">TERLAMBAT</span>' : '<span class="badge badge-active">Aktif</span>';
            statusClass = isLate ? 'late' : '';
        } else {
            statusBadge = '<span class="badge" style="background: #d4edda; color: #155724;">Dikembalikan</span>';
        }
        
        return `<tr class="${statusClass}">
            <td>${borrow.id}</td>
            <td><strong>${borrow.username}</strong></td>
            <td>${borrow.book}</td>
            <td><small>${borrow.author}</small></td>
            <td>${borrow.borrowDate}</td>
            <td>${borrow.dueDate}</td>
            ${isLate && borrow.status === 'Aktif' ? `<td style="color: #d32f2f; font-weight: 600;">Terlambat ${Math.abs(daysLeft)} hari</td>` : `<td>${daysLeft} hari</td>`}
            <td>${statusBadge}</td>
            <td>
                ${borrow.bookPhoto ? `<button class="btn-action btn-borrow" onclick="viewBorrowPhoto(${borrow.id})" title="Lihat Foto"><i class="fas fa-image"></i></button>` : '<small style="color: #999;">-</small>'}
            </td>
            <td>
                <button class="btn-action btn-borrow" onclick="viewBorrowDetail(${borrow.id})" title="Lihat Detail">
                    <i class="fas fa-eye"></i>
                </button>
            </td>
        </tr>`;
    }).join('');
}

function viewBorrowDetail(borrowId) {
    const borrows = getBorrows();
    const borrow = borrows.find(b => b.id === borrowId);
    
    if (!borrow) {
        alert('Data peminjaman tidak ditemukan');
        return;
    }
    
    const dueDate = new Date(borrow.dueDate);
    const today = new Date();
    const isLate = today > dueDate && borrow.status === 'Aktif';
    const daysLeft = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));
    
    const modalContent = `
        <div style="padding: 20px;">
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4 style="color: var(--ipm-green); margin-bottom: 10px;">
                        <i class="fas fa-user"></i> Informasi Peminjam
                    </h4>
                    <p><strong>Username:</strong> ${borrow.username}</p>
                </div>
                
                <div>
                    <h4 style="color: var(--ipm-green); margin-bottom: 10px;">
                        <i class="fas fa-book"></i> Informasi Buku
                    </h4>
                    <p><strong>Judul:</strong> ${borrow.book}</p>
                    <p><strong>Penulis:</strong> ${borrow.author}</p>
                </div>
            </div>
            
            <div style="background: #f8f9fa; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="color: var(--ipm-green); margin-bottom: 10px;">
                    <i class="fas fa-calendar-alt"></i> Jadwal Peminjaman
                </h4>
                <p><strong>Tanggal Pinjam:</strong> ${borrow.borrowDate}</p>
                <p><strong>Jatuh Tempo:</strong> ${borrow.dueDate}</p>
                <p style="color: ${isLate && borrow.status === 'Aktif' ? '#d32f2f' : '#1a7d3d'}; font-weight: 600;">
                    <i class="fas fa-hourglass-end"></i> 
                    <strong>${isLate && borrow.status === 'Aktif' ? 'TERLAMBAT ' + Math.abs(daysLeft) + ' hari' : 'Sisa: ' + daysLeft + ' hari'}</strong>
                </p>
            </div>
            
            <div style="background: #e8f5e9; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                <h4 style="color: var(--ipm-green); margin-bottom: 10px;">
                    <i class="fas fa-info-circle"></i> Status
                </h4>
                <p><strong>Status Peminjaman:</strong> <span class="badge ${borrow.status === 'Aktif' ? (isLate ? 'badge-late' : 'badge-active') : 'badge-available'}">${isLate && borrow.status === 'Aktif' ? 'TERLAMBAT' : borrow.status}</span></p>
            </div>
            
            ${borrow.notes ? `
                <div style="background: #fff3cd; padding: 15px; border-radius: 10px; margin-bottom: 20px;">
                    <h4 style="color: var(--ipm-green); margin-bottom: 10px;">
                        <i class="fas fa-sticky-note"></i> Catatan
                    </h4>
                    <p>${borrow.notes}</p>
                </div>
            ` : ''}
        </div>
    `;
    
    let modal = document.getElementById('borrowDetailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'borrowDetailModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-book"></i> Detail Peminjaman</h2>
                    <button class="close-modal" onclick="closeModal('borrowDetailModal')">&times;</button>
                </div>
                <div id="borrowDetailContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('borrowDetailContent').innerHTML = modalContent;
    openModal('borrowDetailModal');
}

function searchBorrowHistory() {
    const searchTerm = document.getElementById('searchBorrowHistory').value.toLowerCase();
    const statusFilter = document.getElementById('filterBorrowStatus').value;
    let borrows = getBorrows();
    
    if (searchTerm) {
        borrows = borrows.filter(borrow => 
            borrow.username.toLowerCase().includes(searchTerm) ||
            borrow.book.toLowerCase().includes(searchTerm) ||
            borrow.author.toLowerCase().includes(searchTerm)
        );
    }
    
    if (statusFilter) {
        borrows = borrows.filter(borrow => borrow.status === statusFilter);
    }
    
    const tbody = document.getElementById('borrowHistoryTableBody');
    
    if (borrows.length === 0) {
        tbody.innerHTML = `<tr><td colspan="10" class="no-data"><i class="fas fa-search"></i> Tidak ada data yang sesuai</td></tr>`;
        return;
    }
    
    loadBorrowHistory();
}

// ==================== ADMIN FUNCTIONS ====================

function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function saveUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function loadUsers() {
    try {
        const users = getUsers();
        
        // Update stats
        document.getElementById('totalUsers').textContent = users.length;
        const uniqueRanting = [...new Set(users.map(u => u.rantingName).filter(Boolean))];
        document.getElementById('totalRanting').textContent = uniqueRanting.length;
        const activeUsers = users.filter(u => u.status === 'active').length;
        document.getElementById('activeUsers').textContent = activeUsers;
        
        // Populate filter
        const rantingFilter = document.getElementById('filterRanting');
        if (rantingFilter) {
            rantingFilter.innerHTML = '<option value="">Semua Ranting</option>';
            uniqueRanting.forEach(ranting => {
                if (ranting) rantingFilter.innerHTML += `<option value="${ranting}">${ranting}</option>`;
            });
        }
        
        displayUsers(users);
    } catch (error) {
        console.error('Error loading users:', error);
    }
}

function displayUsers(users) {
    const tbody = document.getElementById('usersTableBody');
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    
    if (!tbody) return;
    
    if (users.length === 0) {
        tbody.innerHTML = `<tr><td colspan="9" class="no-data"><i class="fas fa-user-slash"></i> Belum ada anggota</td></tr>`;
        return;
    }
    
    tbody.innerHTML = users.map(user => {
        const isCurrentUser = currentUser && currentUser.id == user.id;
        const canDelete = !isCurrentUser && user.role !== 'admin';
        
        return `<tr>
            <td>${user.id}</td>
            <td><strong>${user.username}</strong>${isCurrentUser ? '<br><small style="color: var(--ipm-yellow);">(Anda)</small>' : ''}</td>
            <td>${user.fullname || '-'}</td>
            <td><span class="badge" style="background: #e9ecef; color: #495057;">${user.rantingName || 'Tidak ada'}</span></td>
            <td>${user.school || '-'}</td>
            <td><span class="badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}">${user.role}</span></td>
            <td><span class="badge ${user.status === 'active' ? 'badge-available' : 'badge-borrowed'}">${user.status}</span></td>
            <td>${user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}</td>
            <td>
                <div class="table-actions">
                    <button class="btn-action btn-borrow" onclick="viewUserDetail(${user.id})" title="Detail"><i class="fas fa-eye"></i></button>
                    ${!isCurrentUser && user.role !== 'admin' ? `<button class="btn-action btn-return" onclick="toggleUserStatus(${user.id}, '${user.username}')"><i class="fas fa-power-off"></i></button>` : ''}
                    ${canDelete ? `<button class="btn-action btn-delete" onclick="confirmDeleteUser(${user.id}, '${user.username}', '${user.fullname}')"><i class="fas fa-trash"></i></button>` : ''}
                </div>
            </td>
        </tr>`;
    }).join('');
}

function searchUsers() {
    const searchTerm = document.getElementById('searchUsers').value.toLowerCase();
    const rantingFilter = document.getElementById('filterRanting').value;
    let users = getUsers();
    
    if (searchTerm) {
        users = users.filter(user => 
            user.username.toLowerCase().includes(searchTerm) ||
            user.fullname.toLowerCase().includes(searchTerm)
        );
    }
    
    if (rantingFilter) {
        users = users.filter(user => user.rantingName === rantingFilter);
    }
    
    displayUsers(users);
}

function viewUserDetail(userId) {
    const users = getUsers();
    const user = users.find(u => u.id === userId);
    
    if (!user) {
        alert('User tidak ditemukan');
        return;
    }
    
    const borrows = getBorrows().filter(b => b.username === user.username);
    const borrowCount = borrows.length;
    const activeBorrows = borrows.filter(b => b.status === 'Aktif').length;
    
    const modalContent = `
        <div style="padding: 20px;">
            <div style="display: flex; align-items: center; gap: 20px; margin-bottom: 20px;">
                <div style="width: 80px; height: 80px; background: linear-gradient(135deg, var(--ipm-yellow) 0%, var(--ipm-gold) 100%); 
                    border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 32px; color: var(--ipm-green); font-weight: bold;">
                    ${user.fullname ? user.fullname.charAt(0).toUpperCase() : 'U'}
                </div>
                <div>
                    <h3 style="color: var(--ipm-green); margin-bottom: 5px;">${user.fullname || '-'}</h3>
                    <p style="color: #666;">${user.username}</p>
                </div>
            </div>
            
            <div style="background: #fff3cd; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid var(--ipm-yellow);">
                <h4 style="color: var(--ipm-green); margin: 0 0 10px 0;">
                    <i class="fas fa-lock"></i> Kredensial Login
                </h4>
                <p style="margin: 8px 0;">
                    <strong>Username:</strong> 
                    <span id="usernameDisplay">${user.username}</span>
                    <button onclick="togglePasswordVisibility('usernameDisplay', '${user.username}')" style="background: none; border: none; color: var(--ipm-green); cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-copy"></i>
                    </button>
                </p>
                <p style="margin: 8px 0;">
                    <strong>Password:</strong> 
                    <span id="passwordDisplay" style="font-family: monospace; letter-spacing: 1px;">
                        <span id="passwordValue" style="display: none;">${user.password}</span>
                        <span id="passwordMask">••••••••</span>
                    </span>
                    <button onclick="togglePasswordVisibility('password', '${user.password}')" style="background: none; border: none; color: var(--ipm-green); cursor: pointer; margin-left: 10px;">
                        <i class="fas fa-eye" id="toggleIcon"></i>
                    </button>
                    <button onclick="togglePasswordVisibility('usernameCopy', '${user.password}')" style="background: none; border: none; color: var(--ipm-green); cursor: pointer; margin-left: 5px;">
                        <i class="fas fa-copy"></i>
                    </button>
                </p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                <div>
                    <h4 style="color: var(--ipm-green); margin-bottom: 10px;">
                        <i class="fas fa-id-card"></i> Keanggotaan
                    </h4>
                    <p><strong>Ranting:</strong> ${user.rantingName || '-'}</p>
                    <p><strong>Jenis:</strong> ${user.rantingType || '-'}</p>
                    <p><strong>Bergabung:</strong> ${user.createdAt ? new Date(user.createdAt).toLocaleDateString('id-ID') : '-'}</p>
                </div>
                
                <div>
                    <h4 style="color: var(--ipm-green); margin-bottom: 10px;">
                        <i class="fas fa-book"></i> Aktivitas Peminjaman
                    </h4>
                    <p><strong>Total Peminjaman:</strong> ${borrowCount}</p>
                    <p><strong>Sedang Dipinjam:</strong> ${activeBorrows}</p>
                    <p><strong>Status:</strong> <span class="badge ${user.status === 'active' ? 'badge-available' : 'badge-borrowed'}">${user.status}</span></p>
                </div>
            </div>
        </div>
    `;
    
    let modal = document.getElementById('userDetailModal');
    if (!modal) {
        modal = document.createElement('div');
        modal.id = 'userDetailModal';
        modal.className = 'modal';
        modal.innerHTML = `
            <div class="modal-content" style="max-width: 600px;">
                <div class="modal-header">
                    <h2><i class="fas fa-user"></i> Detail Anggota</h2>
                    <button class="close-modal" onclick="closeModal('userDetailModal')">&times;</button>
                </div>
                <div id="userDetailContent"></div>
            </div>
        `;
        document.body.appendChild(modal);
    }
    
    document.getElementById('userDetailContent').innerHTML = modalContent;
    openModal('userDetailModal');
}

function toggleUserStatus(userId, username) {
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id == userId);
    
    if (userIndex === -1) {
        alert('User tidak ditemukan!');
        return;
    }
    
    const user = users[userIndex];
    const newStatus = user.status === 'active' ? 'inactive' : 'active';
    const action = newStatus === 'active' ? 'mengaktifkan' : 'menonaktifkan';
    
    if (!confirm(`Apakah Anda yakin ingin ${action} user "${username}"?`)) {
        return;
    }
    
    users[userIndex].status = newStatus;
    saveUsers(users);
    
    alert(`✓ User "${username}" berhasil di${action}!`);
    loadUsers();
}

function confirmDeleteUser(userId, username, fullname) {
    if (!confirm(`Hapus user "${username}" (${fullname})?`)) {
        return;
    }
    
    const users = getUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex !== -1) {
        users.splice(userIndex, 1);
        saveUsers(users);
        alert('✓ User berhasil dihapus!');
        loadUsers();
    }
}

function updateBorrowStats() {
    const borrows = getBorrows();
    const today = new Date();
    
    const activeBorrows = borrows.filter(b => b.status === 'Aktif').length;
    const lateBorrows = borrows.filter(b => {
        const dueDate = new Date(b.dueDate);
        return b.status === 'Aktif' && today > dueDate;
    }).length;
    
    const el1 = document.getElementById('totalBorrows');
    const el2 = document.getElementById('activeBorrows');
    const el3 = document.getElementById('lateBorrows');
    
    if (el1) el1.textContent = borrows.length;
    if (el2) el2.textContent = activeBorrows;
    if (el3) el3.textContent = lateBorrows;
}

function switchAdminTab(tabName) {
    const tabContents = document.querySelectorAll('.admin-tab-content');
    tabContents.forEach(tab => tab.style.display = 'none');
    
    const tabBtns = document.querySelectorAll('.admin-tab-btn');
    tabBtns.forEach(btn => {
        btn.style.borderBottomColor = 'transparent';
        btn.style.color = '#666';
    });
    
    const selectedTab = document.getElementById(tabName);
    if (selectedTab) {
        selectedTab.style.display = 'block';
        
        const currentBtn = event.target.closest('.admin-tab-btn');
        if (currentBtn) {
            currentBtn.style.borderBottomColor = 'var(--ipm-green)';
            currentBtn.style.color = 'var(--ipm-green)';
        }
        
        if (tabName === 'borrow-section') {
            loadBorrowHistory();
            updateBorrowStats();
        }
    }
}

// ==================== PHOTO VIEWER FUNCTIONS ====================

function viewBorrowPhoto(borrowId) {
    const borrows = JSON.parse(localStorage.getItem('userBorrows')) || [];
    const borrow = borrows.find(b => b.id === borrowId);
    
    if (!borrow || !borrow.bookPhoto) {
        alert('Foto tidak tersedia');
        return;
    }
    
    document.getElementById('photoModalImage').src = borrow.bookPhoto;
    document.getElementById('photoModalInfo').innerHTML = `
        <strong>${borrow.book}</strong><br>
        <small>Dipinjam: ${borrow.borrowDate} | Jatuh Tempo: ${borrow.dueDate}</small>
    `;
    openModal('photoModal');
}

// ==================== PASSWORD VISIBILITY FUNCTIONS ====================

function togglePasswordVisibility(type, value) {
    if (type === 'password') {
        const passwordMask = document.getElementById('passwordMask');
        const passwordValue = document.getElementById('passwordValue');
        const toggleIcon = document.getElementById('toggleIcon');
        
        if (passwordMask.style.display === 'none') {
            // Hide password
            passwordMask.style.display = 'inline';
            passwordValue.style.display = 'none';
            toggleIcon.className = 'fas fa-eye';
        } else {
            // Show password
            passwordMask.style.display = 'none';
            passwordValue.style.display = 'inline';
            toggleIcon.className = 'fas fa-eye-slash';
        }
    } else if (type === 'usernameDisplay' || type === 'usernameCopy') {
        // Copy to clipboard
        const textToCopy = type === 'usernameDisplay' ? value : value;
        
        navigator.clipboard.writeText(textToCopy).then(() => {
            // Show feedback
            const originalText = type === 'usernameDisplay' ? 'Copy Username' : 'Copy Password';
            const button = event.target.closest('button');
            const originalHTML = button.innerHTML;
            
            button.innerHTML = '<i class="fas fa-check"></i> Copied!';
            button.style.color = '#28a745';
            
            setTimeout(() => {
                button.innerHTML = originalHTML;
                button.style.color = 'var(--ipm-green)';
            }, 2000);
        }).catch(err => {
            console.error('Copy failed:', err);
            alert('Gagal copy ke clipboard');
        });
    }
}
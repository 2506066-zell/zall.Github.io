# QR Validation Guide - Digital Library

## Fitur QR Scanning untuk Validasi Peminjaman Buku

### 📋 Ringkasan Fitur

Sistem peminjaman buku sekarang dilengkapi dengan validasi QR Code untuk memastikan buku yang dipinjam sesuai dengan identitas fisik buku di rak perpustakaan.

---

## 🔧 Cara Kerja QR Validation

### A. Untuk Admin - Generate QR Code Buku

1. **Login** sebagai admin
2. Buka halaman **Admin Panel**
3. Pilih tab **"QR Code Buku"** (icon QR yang baru)
4. Lihat daftar semua buku di perpustakaan
5. Klik tombol **"Generate QR"** untuk buku yang diinginkan
6. Modal akan menampilkan:
   - QR Code dengan format `BOOK_{bookId}`
   - Informasi judul buku
   - Tombol **Download QR** (simpan sebagai file PNG)
   - Tombol **Print QR** (cetak langsung)

### B. Untuk User - Peminjaman dengan QR Validation (Opsional)

1. **Login** ke akun user
2. Buka halaman **"Peminjaman"**
3. Pilih buku yang ingin dipinjam
4. Dalam modal peminjaman, ada checkbox baru: **"Scan QR Buku untuk Validasi"**
5. **Opsional**: Jika ingin validasi:
   - ✓ Centang checkbox
   - Scanner kamera akan aktif (perlu izin akses kamera)
   - Scan QR Code dari buku fisik di rak
   - Jika QR sesuai → ✅ Status "QR Valid - Buku Sesuai!"
   - Jika QR tidak sesuai → ❌ Muncul peringatan
6. Klik **"Konfirmasi Peminjaman"** untuk menyelesaikan
7. Riwayat peminjaman akan menyimpan status `qrValidated: true` jika menggunakan QR

---

## 📱 Format QR Code

Setiap QR Code buku berisi:
```
BOOK_{bookId}
```

**Contoh:**
- Buku ID 1 → `BOOK_1`
- Buku ID 2 → `BOOK_2`
- dst...

---

## 🎯 Keuntungan Sistem QR Validation

1. **Akurasi** - Memastikan buku yang dipinjam adalah buku yang benar
2. **Efisiensi** - Proses cepat dengan scanning otomatis
3. **Audit Trail** - Setiap peminjaman tercatat dengan QR validation
4. **Fleksibel** - Validasi QR bersifat opsional, user bisa tetap pinjam tanpa QR
5. **Keamanan** - Mengurangi kesalahan identifikasi buku

---

## 🛠️ Implementasi Teknis

### Library yang Digunakan:

1. **html5-qrcode** (untuk scanning QR)
   - https://cdn.jsdelivr.net/npm/html5-qrcode@2.3.4/minified/html5-qrcode.min.js
   - Digunakan di `borrow.html` untuk scan QR

2. **qrcode.js** (untuk generate QR)
   - https://cdn.jsdelivr.net/npm/qrcode@1.5.3/build/qrcode.min.js
   - Digunakan di `admin.html` untuk membuat QR

### Fungsi JavaScript:

**Di borrow.html:**
- `startQRScanner()` - Mulai scanning dengan kamera
- `stopQRScanner()` - Hentikan scanning
- `showQRStatus()` - Tampilkan status validasi QR

**Di admin.html (script.js):**
- `loadQRBooksTable()` - Load daftar buku untuk generate QR
- `generateBookQR()` - Generate QR untuk buku tertentu
- `downloadQRCode()` - Download QR sebagai PNG
- `printQRCode()` - Print QR langsung

---

## 📋 Testing Checklist

- [ ] Admin dapat membuka tab QR Code Buku
- [ ] Admin dapat generate QR untuk setiap buku
- [ ] Admin dapat download QR Code sebagai gambar
- [ ] Admin dapat print QR Code
- [ ] User dapat mengakses checkbox "Scan QR" di modal peminjaman
- [ ] User dapat scan QR Code dengan kamera
- [ ] QR validation gagal jika buku tidak sesuai
- [ ] Peminjaman berhasil jika QR valid atau tidak menggunakan QR
- [ ] Status `qrValidated` tercatat di riwayat peminjaman
- [ ] User tanpa akses kamera tetap bisa pinjam buku

---

## ⚙️ Troubleshooting

### Masalah: Kamera tidak bisa diakses saat scanning
**Solusi:**
- Beri izin akses kamera ke browser
- Pastikan menggunakan HTTPS atau localhost
- Coba browser lain yang support WebRTC

### Masalah: QR tidak terdeteksi saat scanning
**Solusi:**
- Pastikan QR Code cukup terang dan jelas
- Jarak scanning 15-30 cm dari kamera
- Hindari cahaya yang silau
- QR harus dalam frame yang ditunjukkan

### Masalah: QR Code tidak bisa di-generate di admin panel
**Solusi:**
- Refresh halaman admin
- Pastikan data buku sudah tersimpan di localStorage
- Cek console browser untuk error message

---

## 📚 File yang Dimodifikasi

1. **borrow.html**
   - Tambah library `html5-qrcode`
   - Tambah checkbox QR validation di form
   - Tambah container untuk QR scanner
   - Tambah fungsi scanning JavaScript

2. **admin.html**
   - Tambah library `qrcode.js`
   - Tambah tab "QR Code Buku"
   - Tambah tabel daftar buku untuk QR
   - Tambah QR Code modal

3. **script.js**
   - `loadQRBooksTable()` - Tampilkan daftar buku
   - `generateBookQR()` - Generate QR untuk buku
   - `downloadQRCode()` - Download QR
   - `printQRCode()` - Print QR

---

## 🚀 Next Steps

Fitur QR validation siap digunakan! Admin dapat mulai:
1. Generate QR Code untuk semua buku di perpustakaan
2. Print dan tempel QR Code di buku fisik
3. User dapat mulai pinjam buku dengan QR validation

---

**Dibuat:** January 16, 2026
**Status:** ✅ Ready to Use

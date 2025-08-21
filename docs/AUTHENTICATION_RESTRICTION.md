# Pembatasan Akses - Authentication System

## Overview
Sistem authentication telah diimplementasikan untuk membatasi akses ke halaman-halaman tertentu. Pengguna harus login terlebih dahulu untuk mengakses halaman yang dilindungi.

## Halaman yang Dilindungi
Berikut adalah halaman-halaman yang memerlukan authentication:

1. **Dashboard** (`/dashboard`) - Halaman utama dengan statistik dan overview
2. **Goal** (`/goal`) - Halaman tujuan dan objectives
3. **Permit Planning** (`/permitplanning`) - Halaman perencanaan izin kerja
4. **Site Plot Plans** (`/siteplotplans`) - Halaman visualisasi site plot
5. **Basic Principle** (`/basicprinciple`) - Halaman prinsip dasar
6. **Element** (`/element`) - Halaman elemen sistem

## Komponen Authentication

### 1. withAuth HOC (Higher Order Component)
**File**: `app/components/withAuth.js`

- Melakukan pengecekan authentication pada setiap halaman
- Menggunakan localStorage untuk menyimpan data user
- Otomatis redirect ke `/login` jika user tidak terautentikasi
- Menampilkan loading spinner selama proses pengecekan
- Memberikan data user sebagai prop ke komponen yang dibungkus

### 2. Middleware
**File**: `middleware.js`

- Memberikan lapisan keamanan tambahan di level server
- Menambahkan security headers untuk halaman yang dilindungi
- Dapat diperluas untuk pengecekan tambahan di masa depan

### 3. Login Page
**File**: `app/login/page.js`

- Halaman login yang tidak dilindungi
- Menyimpan data user ke localStorage setelah login berhasil
- Redirect ke `/dashboard` setelah login berhasil

### 4. Home Page Redirect
**File**: `app/page.js`

- Otomatis redirect ke `/login` saat mengakses root URL

## Cara Kerja Authentication

1. **Akses Halaman Dilindungi**: User mencoba mengakses halaman yang dilindungi
2. **Pengecekan Authentication**: `withAuth` HOC memeriksa localStorage untuk data user
3. **Redirect jika Tidak Login**: Jika tidak ada data user, redirect ke `/login`
4. **Render Halaman**: Jika terautentikasi, halaman akan di-render dengan data user

## Testing Authentication

### Test Case 1: Akses Tanpa Login
1. Buka browser dalam mode incognito
2. Akses `http://localhost:3001/dashboard`
3. **Expected**: Otomatis redirect ke `/login`

### Test Case 2: Akses Setelah Login
1. Login dengan kredensial yang valid
2. Akses halaman yang dilindungi
3. **Expected**: Halaman dapat diakses normal

### Test Case 3: Logout dan Akses
1. Logout atau clear localStorage
2. Coba akses halaman yang dilindungi
3. **Expected**: Redirect ke `/login`

## Security Features

1. **Client-side Authentication**: Menggunakan localStorage dan React state
2. **Security Headers**: Ditambahkan via middleware untuk halaman dilindungi
3. **Route Protection**: Semua halaman sensitif dilindungi dengan `withAuth`
4. **Automatic Redirect**: User yang tidak login otomatis diarahkan ke login

## Maintenance Notes

- Semua halaman baru yang memerlukan authentication harus dibungkus dengan `withAuth`
- Data user disimpan di localStorage dengan key `'user'`
- Untuk menambah halaman baru yang dilindungi, tambahkan route ke array `protectedRoutes` di middleware.js

## Future Enhancements

1. **JWT Token**: Implementasi JWT untuk security yang lebih baik
2. **Server-side Session**: Pindah ke server-side session management
3. **Role-based Access**: Implementasi role-based access control
4. **Session Timeout**: Automatic logout setelah periode inactive

# Database Setup Guide

## Langkah-langkah Setup Database MySQL

### 1. Install MySQL Server
```bash
# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server

# CentOS/RHEL
sudo yum install mysql-server

# macOS (dengan Homebrew)
brew install mysql
```

### 2. Konfigurasi MySQL
```bash
# Start MySQL service
sudo systemctl start mysql

# Enable auto-start
sudo systemctl enable mysql

# Secure installation
sudo mysql_secure_installation
```

### 3. Buat Database dan User
```sql
-- Login ke MySQL sebagai root
mysql -u root -p

-- Buat database
CREATE DATABASE sika_db;

-- Buat user khusus untuk aplikasi
CREATE USER 'sika_user'@'localhost' IDENTIFIED BY 'password_anda';

-- Berikan privileges
GRANT ALL PRIVILEGES ON sika_db.* TO 'sika_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit
EXIT;
```

### 4. Import Database Schema
```bash
# Import file init.sql
mysql -u sika_user -p sika_db < database/init.sql
```

### 5. Update Environment Variables
Edit file `.env.local`:
```env
DB_HOST=localhost
DB_USER=sika_user
DB_PASSWORD=password_anda
DB_NAME=sika_db
DB_PORT=3306
```

### 6. Test Koneksi Database
```bash
# Jalankan development server
npm run dev

# Test koneksi dengan mengakses:
# http://localhost:3000/api/test-db
```

## Penggunaan API

### Test Database Connection
```bash
curl http://localhost:3000/api/test-db
```

### Create User
```bash
curl -X POST http://localhost:3000/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123"}'
```

### Login
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sika.com","password":"admin123"}'
```

### Get All Users
```bash
curl http://localhost:3000/api/users
```

## Struktur Database

### Tabel Users
- `id` (PRIMARY KEY)
- `name` (VARCHAR)
- `email` (VARCHAR UNIQUE)
- `password` (VARCHAR)
- `role` (ENUM: 'admin', 'user')
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)
- `last_login` (TIMESTAMP)

### Tabel Goals
- `id` (PRIMARY KEY)
- `title` (VARCHAR)
- `description` (TEXT)
- `status` (ENUM: 'pending', 'in_progress', 'completed')
- `user_id` (FOREIGN KEY)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabel Site Plot Plans
- `id` (PRIMARY KEY)
- `name` (VARCHAR)
- `description` (TEXT)
- `file_path` (VARCHAR)
- `user_id` (FOREIGN KEY)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### Tabel Organization Structure
- `id` (PRIMARY KEY)
- `name` (VARCHAR)
- `position` (VARCHAR)
- `department` (VARCHAR)
- `parent_id` (FOREIGN KEY, nullable)
- `user_id` (FOREIGN KEY)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

## Security Best Practices

1. **Gunakan Environment Variables** untuk kredensial database
2. **Hash Password** menggunakan bcrypt sebelum menyimpan
3. **Validasi Input** pada semua API endpoints
4. **Gunakan Connection Pooling** untuk performa yang lebih baik
5. **Sanitize Database Queries** untuk mencegah SQL injection
6. **Implement Rate Limiting** pada API endpoints
7. **Log Database Errors** untuk monitoring

## Troubleshooting

### Error: "Can't connect to MySQL server"
- Pastikan MySQL service berjalan
- Periksa host, port, dan kredensial di `.env.local`
- Periksa firewall settings

### Error: "Access denied for user"
- Periksa username dan password
- Pastikan user memiliki privileges yang sesuai

### Error: "Unknown database"
- Pastikan database sudah dibuat
- Periksa nama database di `.env.local`

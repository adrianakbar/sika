-- Membuat database sika_db
CREATE DATABASE IF NOT EXISTS sika_db;
USE sika_db;

-- Tabel users
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'user') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- Tabel untuk menyimpan data goals
CREATE TABLE IF NOT EXISTS goals (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pending', 'in_progress', 'completed') DEFAULT 'pending',
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel untuk site plot plans
CREATE TABLE IF NOT EXISTS site_plot_plans (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    file_path VARCHAR(500),
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Tabel untuk organization structure
CREATE TABLE IF NOT EXISTS organization_structure (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    position VARCHAR(255),
    department VARCHAR(255),
    parent_id INT NULL,
    user_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES organization_structure(id) ON DELETE SET NULL
);

-- Insert data admin default
INSERT INTO users (name, email, password, role) VALUES 
('Administrator', 'admin@sika.com', 'admin123', 'admin'),
('User Demo', 'user@sika.com', 'user123', 'user')
ON DUPLICATE KEY UPDATE id=id;

-- Insert sample data untuk testing
INSERT INTO goals (title, description, status, user_id) VALUES 
('Implementasi Sistem SIKA', 'Mengimplementasikan sistem informasi keselamatan dan kesehatan kerja', 'in_progress', 1),
('Pelatihan K3', 'Mengadakan pelatihan keselamatan dan kesehatan kerja untuk seluruh karyawan', 'pending', 1)
ON DUPLICATE KEY UPDATE id=id;

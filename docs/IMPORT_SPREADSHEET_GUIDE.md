# Guide Import Data Site Plot Plans dari Google Spreadsheet

## Overview

Sistem SIKA mendukung import data Site Plot Plans dari Google Spreadsheet dengan beberapa metode:

1. **Import CSV Manual** - Copy-paste data CSV
2. **Import Direct dari URL** - Menggunakan public sharing link (jika tersedia)
3. **Upload File CSV** - Upload file CSV yang didownload dari spreadsheet

## Metode Import yang Tersedia

### 🔄 **Method 1: Import CSV Manual** (Recommended)

#### Step 1: Export Data dari Google Spreadsheet
1. Buka Google Spreadsheet Anda
2. Klik **File > Download > Comma Separated Values (.csv)**
3. Simpan file CSV ke komputer
4. Buka file CSV dengan text editor
5. Copy semua content CSV

#### Step 2: Import via API
```bash
curl -X POST http://localhost:3001/api/siteplotplans/import-csv \
  -H "Content-Type: application/json" \
  -d '{
    "csvData": "Name,Description,Location,Area,Type\nLayout Kantor,Denah kantor,Jakarta,Area A,Office",
    "userId": 1
  }'
```

### 🔗 **Method 2: Import Direct dari URL** (Jika Public)

#### Syarat:
- Spreadsheet harus **publicly shared**
- Link sharing: "Anyone with the link can view"

#### API Call:
```bash
curl -X POST http://localhost:3001/api/siteplotplans/import-spreadsheet \
  -H "Content-Type: application/json" \
  -d '{
    "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/YOUR_SHEET_ID/edit?usp=sharing",
    "userId": 1
  }'
```

## Format Data Spreadsheet

### 📋 **Kolom yang Didukung:**

#### **Required Fields:**
- `Name` / `Nama` / `Site Name` - **Wajib**, nama site plot plan

#### **Optional Fields:**
- `Description` / `Deskripsi` / `desc` - Deskripsi detail
- `Location` / `Lokasi` / `alamat` - Lokasi/alamat site
- `Area` / `zone` / `Zone` - Area/zona lokasi
- `Type` / `Tipe` / `category` - Kategori/jenis site
- `File Path` / `URL` / `Link` - Link file/dokumen

### 📝 **Contoh Format CSV:**
```csv
Name,Description,Location,Area,Type,File Path
Layout Kantor Utama,Denah layout kantor utama dengan area safety,Jakarta,Area A,Office Layout,/files/layout1.pdf
Rencana Lokasi Pabrik,Site plan untuk pembangunan pabrik baru,Cilacap,Area B,Factory Plan,/files/factory.dwg
Denah Gudang,Layout gudang penyimpanan material,Balikpapan,Area C,Warehouse Layout,/files/warehouse.pdf
Area Parkir,Rencana area parkir karyawan,Jakarta,Area A,Parking Area,
```

## API Endpoints

### 📥 **Import CSV Data**
```
POST /api/siteplotplans/import-csv
```

**Request Body:**
```json
{
  "csvData": "Name,Description\nSite 1,Description 1\nSite 2,Description 2",
  "userId": 1,
  "mapping": {
    "name": ["name", "Name", "Nama"],
    "description": ["description", "Description", "Deskripsi"]
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Successfully imported 4 site plot plans",
  "data": {
    "imported": 4,
    "errors": 0,
    "results": [...],
    "errorDetails": [],
    "csvInfo": {
      "totalRows": 4,
      "headers": ["Name", "Description", "Location", "Area", "Type"],
      "sampleData": [...]
    }
  }
}
```

### 📥 **Import dari Google Spreadsheet URL**
```
POST /api/siteplotplans/import-spreadsheet
```

**Request Body:**
```json
{
  "spreadsheetUrl": "https://docs.google.com/spreadsheets/d/SHEET_ID/edit?usp=sharing",
  "userId": 1
}
```

### 📋 **Get All Site Plot Plans**
```
GET /api/siteplotplans
GET /api/siteplotplans?userId=1
```

### ➕ **Create Single Site Plot Plan**
```
POST /api/siteplotplans
```

**Request Body:**
```json
{
  "name": "Layout Kantor Baru",
  "description": "Denah layout kantor baru dengan area safety",
  "filePath": "/uploads/layout-new.pdf",
  "userId": 1
}
```

## Testing Import

### ✅ **Test dengan Sample Data:**
```bash
# Test import CSV
curl -X POST http://localhost:3001/api/siteplotplans/import-csv \
  -H "Content-Type: application/json" \
  -d '{
    "csvData": "Name,Description,Location,Area,Type\nLayout Kantor Utama,Denah layout kantor utama dengan area safety,Jakarta,Area A,Office Layout\nRencana Lokasi Pabrik,Site plan untuk pembangunan pabrik baru,Cilacap,Area B,Factory Plan",
    "userId": 1
  }'

# Cek hasil import
curl http://localhost:3001/api/siteplotplans
```

### ✅ **Hasil Import yang Berhasil:**
```json
{
  "success": true,
  "data": [
    {
      "id": 2,
      "name": "Layout Kantor Utama",
      "description": "Denah layout kantor utama dengan area safety | Location: Jakarta | Area: Area A | Type: Office Layout",
      "filePath": null,
      "userId": 1,
      "createdAt": "2025-08-19T10:04:43.645Z",
      "updatedAt": "2025-08-19T10:04:43.645Z",
      "user": {
        "id": 1,
        "name": "Administrator",
        "email": "admin@sika.com"
      }
    }
  ]
}
```

## Troubleshooting

### ❌ **Error: "Failed to fetch spreadsheet"**
**Penyebab:** Spreadsheet tidak public atau butuh permission
**Solusi:** 
1. Pastikan spreadsheet di-share sebagai "Anyone with the link can view"
2. Gunakan metode import CSV manual
3. Download CSV dari spreadsheet dan upload manual

### ❌ **Error: "Name is required"**
**Penyebab:** Kolom nama tidak ditemukan atau kosong
**Solusi:**
1. Pastikan ada kolom `Name`, `Nama`, atau `Site Name`
2. Pastikan kolom tidak kosong
3. Cek mapping field jika menggunakan nama kolom custom

### ❌ **Error: "No valid data found in CSV"**
**Penyebab:** Format CSV tidak valid atau kosong
**Solusi:**
1. Cek format CSV (headers di baris pertama)
2. Pastikan ada data di baris kedua dan seterusnya
3. Periksa encoding file (gunakan UTF-8)

### ❌ **Error: "User not found"**
**Penyebab:** userId tidak valid
**Solusi:**
1. Pastikan user sudah login
2. Gunakan userId yang valid (admin: 1, user: 2)
3. Cek user dengan `curl http://localhost:3001/api/users`

## Tips Optimasi

### 🚀 **Best Practices:**
1. **Batch Import**: Import maksimal 100 rows per request
2. **Data Validation**: Pastikan data clean sebelum import
3. **Backup**: Backup database sebelum import besar
4. **Error Handling**: Cek error details untuk debugging

### 📊 **Field Mapping Custom:**
```json
{
  "mapping": {
    "name": ["nama_site", "site_name", "judul"],
    "description": ["keterangan", "detail", "desc"],
    "location": ["alamat", "tempat", "lokasi"]
  }
}
```

## Kesimpulan

✅ **Import berhasil diimplementasikan dengan fitur:**
- Import CSV manual (copy-paste)
- Import dari Google Spreadsheet URL (jika public)
- Field mapping yang fleksibel
- Error handling dan validation
- Batch processing untuk data besar

✅ **Data Sample telah berhasil diimport:**
- 4 site plot plans dari sample CSV
- Data tersimpan di database MySQL dengan Prisma
- Relasi dengan user yang benar

🔄 **Next Steps:**
1. Buat UI form untuk import di dashboard
2. Add file upload untuk CSV files
3. Implement preview sebelum import
4. Add progress bar untuk import besar

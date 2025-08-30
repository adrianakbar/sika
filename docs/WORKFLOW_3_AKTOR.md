# SIKA - Workflow 3 Aktor (PTWC, AA, SC)

## Overview
Aplikasi SIKA telah diperbarui untuk mendukung workflow 3 aktor dengan sistem approval bertingkat:

1. **PTWC (Permit to Work Controller)** - Membuat dan submit permit
2. **AA (Area Authority)** - Approve permit pertama kali
3. **SC (Site Controller)** - Approve permit setelah AA approve

## Alur Kerja

### 1. PTWC - Membuat Permit
- Login dengan role `PTWC`
- Membuat permit baru dengan status `DRAFT`
- Setelah selesai mengisi detail permit, submit untuk approval
- Status berubah menjadi `PENDING_AA_APPROVAL`

### 2. AA - Approve Permit
- Login dengan role `AA`
- Melihat permit dengan status `PENDING_AA_APPROVAL` di dashboard
- Review detail permit dan safety measures
- Bisa **Approve** atau **Reject** permit:
  - Jika approve: Status berubah menjadi `AA_APPROVED`
  - Jika reject: Status berubah menjadi `REJECTED_BY_AA`

### 3. SC - Final Approval
- Login dengan role `SC`
- Melihat permit dengan status `AA_APPROVED` di dashboard
- Review permit yang sudah disetujui AA
- Bisa **Approve** atau **Reject** permit:
  - Jika approve: Status berubah menjadi `FULLY_APPROVED` → `ACTIVE`
  - Jika reject: Status berubah menjadi `REJECTED_BY_SC`

### 4. Tampil di Site Plot
- Hanya permit dengan status `ACTIVE` yang akan muncul sebagai pin di site plot
- Pin akan menampilkan warna sesuai work type:
  - **Biru**: Cold Work
  - **Hitam**: Cold Work - Breaking Containment
  - **Kuning**: Hot Work - Spark Potential
  - **Merah**: Hot Work - Naked Flame

## User Accounts untuk Testing

### PTWC (Permit to Work Controller)
- Email: `ptwc@sika.com`
- Password: `ptwc123`
- Fungsi: Membuat dan submit permit

### AA (Area Authority)
- Email: `aa@sika.com`  
- Password: `aa123`
- Fungsi: Approve/reject permit setelah PTWC submit

### SC (Site Controller)
- Email: `sc@sika.com`
- Password: `sc123`
- Fungsi: Final approve/reject setelah AA approve

### Admin
- Email: `admin@sika.com`
- Password: `admin123`
- Fungsi: Melihat semua permit dan bisa bertindak sebagai role manapun

### Regular User
- Email: `user@sika.com`
- Password: `user123`
- Fungsi: User biasa (view only)

## Status Permit

1. **DRAFT** - Permit baru dibuat oleh PTWC, belum disubmit
2. **PENDING_AA_APPROVAL** - Permit sudah disubmit, menunggu approval AA
3. **AA_APPROVED** - Permit sudah disetujui AA, menunggu approval SC
4. **FULLY_APPROVED** - Permit sudah disetujui AA dan SC
5. **ACTIVE** - Permit aktif dan muncul di site plot
6. **REJECTED_BY_AA** - Permit ditolak oleh AA
7. **REJECTED_BY_SC** - Permit ditolak oleh SC
8. **COMPLETED** - Permit selesai
9. **CANCELLED** - Permit dibatalkan

## API Endpoints Baru

### Submit Permit (PTWC)
```
POST /api/permit-planning/{id}/submit
Body: { userId: number }
```

### Approve/Reject Permit (AA/SC)
```
POST /api/permit-planning/{id}/approve  // Approve
PUT /api/permit-planning/{id}/approve   // Reject
Body: { 
  userId: number, 
  role: "AA" | "SC", 
  comments?: string,
  rejectionReason?: string 
}
```

### Dashboard by Role
```
GET /api/dashboard/permits?userId={id}&role={role}
```

## Database Changes

### New Columns in permit_planning table:
- `aa_approved_by` - ID user AA yang approve
- `aa_approved_at` - Timestamp approval AA
- `aa_comments` - Komentar dari AA
- `sc_approved_by` - ID user SC yang approve  
- `sc_approved_at` - Timestamp approval SC
- `sc_comments` - Komentar dari SC
- `rejected_by` - ID user yang reject
- `rejected_at` - Timestamp rejection
- `rejection_reason` - Alasan rejection

### New Roles:
- `PTWC` - Permit to Work Controller
- `AA` - Area Authority  
- `SC` - Site Controller

## Testing Scenario

1. **Login sebagai PTWC**
   - Buat permit baru
   - Submit permit untuk approval
   - Lihat permit di dashboard dengan status "Pending AA Approval"

2. **Login sebagai AA**
   - Lihat permit yang pending approval
   - Approve permit dengan komentar
   - Permit status berubah ke "AA Approved"

3. **Login sebagai CC**
   - Lihat permit yang sudah diapprove AA
   - Final approve permit
   - Permit status berubah ke "Active"

4. **Cek Site Plot**
   - Permit sekarang muncul sebagai pin di site plot visualization
   - Pin berwarna sesuai work type

5. **Testing Rejection**
   - AA atau CC bisa reject permit dengan alasan
   - Permit status berubah ke "Rejected by AA/CC"
   - PTWC bisa lihat alasan rejection

## Features

- **Role-based Dashboard**: Setiap role melihat permit yang relevan
- **Approval Workflow**: Sistem approval bertingkat AA → CC
- **Approval History**: Track siapa dan kapan approve/reject
- **Comments & Rejection Reasons**: Komunikasi antar aktor
- **Site Plot Integration**: Hanya permit active yang tampil
- **Color-coded Pins**: Pin warna sesuai work type di site plot

# Prisma Setup Guide untuk Proyek SIKA

## Overview
Proyek ini sekarang menggunakan Prisma sebagai ORM (Object-Relational Mapping) untuk database MySQL. Prisma memberikan type safety, auto-completion, dan developer experience yang lebih baik dibanding raw SQL queries.

## Struktur File Prisma

```
prisma/
├── schema.prisma    # Schema definition & models
└── seed.js         # Database seeding script

lib/
└── prisma.js       # Prisma client instance

models/
└── User.js         # Model classes with Prisma operations
```

## Fitur Utama yang Diimplementasikan

### 1. **Database Models**
- ✅ User (dengan role ADMIN/USER)
- ✅ Goal (target/goals dengan status)
- ✅ SitePlotPlan (rencana site/lokasi)
- ✅ OrganizationStructure (struktur organisasi hirarkis)

### 2. **API Routes**
- ✅ `/api/test-db` - Test koneksi database
- ✅ `/api/users` - CRUD users
- ✅ `/api/auth/login` - Authentication
- ✅ `/api/goals` - CRUD goals
- ✅ `/api/goals/[id]` - Single goal operations

### 3. **Relationships**
- User has many Goals
- User has many SitePlotPlans
- User has many OrganizationStructures
- OrganizationStructure self-referencing (parent-child hierarchy)

## Commands Prisma

```bash
# Generate Prisma Client
npm run db:generate

# Push schema to database (development)
npm run db:push

# Create and run migrations (production)
npm run db:migrate

# Seed database dengan sample data
npm run db:seed

# Open Prisma Studio (GUI database viewer)
npm run db:studio
```

## Environment Variables

File `.env`:
```bash
DATABASE_URL="mysql://root:@localhost:3306/db_sika"
```

File `.env.local`:
```bash
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=db_sika
DB_PORT=3306
```

## Sample Data yang Sudah Dibuat

### Users:
- **Admin**: admin@sika.com / admin123
- **User**: user@sika.com / user123

### Goals:
- Implementasi Sistem SIKA (status: IN_PROGRESS)
- Pelatihan K3 (status: PENDING)

### Organization Structure:
- Direktur Utama
  - Manager K3

## API Testing

### Test Database Connection
```bash
curl http://localhost:3001/api/test-db
```

### Login
```bash
curl -X POST http://localhost:3001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@sika.com","password":"admin123"}'
```

### Get All Users
```bash
curl http://localhost:3001/api/users
```

### Create User
```bash
curl -X POST http://localhost:3001/api/users \
  -H "Content-Type: application/json" \
  -d '{"name":"John Doe","email":"john@example.com","password":"password123","role":"USER"}'
```

### Get All Goals
```bash
curl http://localhost:3001/api/goals
```

### Create Goal
```bash
curl -X POST http://localhost:3001/api/goals \
  -H "Content-Type: application/json" \
  -d '{"title":"New Goal","description":"Goal description","status":"PENDING","userId":1}'
```

## Keunggulan Prisma vs Raw SQL

### 1. **Type Safety**
```javascript
// Prisma (Type-safe)
const user = await prisma.user.findUnique({
  where: { id: 1 },
  include: { goals: true }
});

// vs Raw SQL (No type safety)
const result = await executeQuery('SELECT * FROM users WHERE id = ?', [1]);
```

### 2. **Auto-completion & IntelliSense**
IDE akan memberikan auto-complete untuk semua fields dan methods

### 3. **Relationship Handling**
```javascript
// Easy to include related data
const userWithGoals = await prisma.user.findUnique({
  where: { id: 1 },
  include: {
    goals: true,
    siteplotplans: true,
    organizationStructures: {
      include: {
        parent: true,
        children: true
      }
    }
  }
});
```

### 4. **Built-in Validation**
Prisma automatically validates data types and constraints

### 5. **Migration Management**
```bash
# Create migration
npx prisma migrate dev --name add_new_field

# Deploy migrations to production
npx prisma migrate deploy
```

## Database Schema (Prisma)

### User Model
```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String   @db.VarChar(255)
  email     String   @unique @db.VarChar(255)
  password  String   @db.VarChar(255)
  role      Role     @default(USER)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  lastLogin DateTime?

  // Relations
  goals                   Goal[]
  siteplotplans          SitePlotPlan[]
  organizationStructures OrganizationStructure[]
}
```

### Goal Model
```prisma
model Goal {
  id          Int        @id @default(autoincrement())
  title       String     @db.VarChar(255)
  description String?    @db.Text
  status      GoalStatus @default(PENDING)
  userId      Int
  createdAt   DateTime   @default(now())
  updatedAt   DateTime   @updatedAt

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
}
```

## Best Practices

### 1. **Use Prisma Client Instance**
```javascript
import { prisma } from '@/lib/prisma';

// Use prisma instance, don't create new PrismaClient
const users = await prisma.user.findMany();
```

### 2. **Select Only Needed Fields**
```javascript
// Good - only select needed fields
const users = await prisma.user.findMany({
  select: {
    id: true,
    name: true,
    email: true
  }
});

// Avoid - selecting all fields including password
const users = await prisma.user.findMany();
```

### 3. **Use Transactions for Complex Operations**
```javascript
const result = await prisma.$transaction(async (prisma) => {
  const user = await prisma.user.create({ data: userData });
  const goal = await prisma.goal.create({ 
    data: { ...goalData, userId: user.id } 
  });
  return { user, goal };
});
```

### 4. **Handle Errors Properly**
```javascript
try {
  const user = await prisma.user.findUniqueOrThrow({
    where: { id: userId }
  });
} catch (error) {
  if (error.code === 'P2025') {
    // Record not found
    return null;
  }
  throw error;
}
```

## Troubleshooting

### Error: "Environment variable not found"
- Pastikan `DATABASE_URL` ada di file `.env`
- Restart development server setelah mengubah .env

### Error: "Can't reach database server"
- Pastikan MySQL server berjalan
- Periksa connection string di `DATABASE_URL`

### Error: "Table doesn't exist"
- Jalankan `npm run db:push` untuk sync schema
- Atau gunakan `npm run db:migrate` untuk production

### Prisma Client out of sync
```bash
npm run db:generate
```

## Migrasi dari Raw SQL ke Prisma

File-file lama yang diganti:
- ❌ `lib/db.js` (raw MySQL connection)
- ✅ `lib/prisma.js` (Prisma client)
- ✅ `models/User.js` (updated dengan Prisma methods)

## Next Steps

1. **Implement Password Hashing** dengan bcrypt
2. **Add JWT Authentication** untuk session management
3. **Add Input Validation** dengan Zod atau Joi
4. **Implement File Upload** untuk site plot plans
5. **Add Real-time Updates** dengan WebSockets
6. **Setup Database Backup** dan monitoring

Prisma setup selesai dan siap digunakan! 🚀

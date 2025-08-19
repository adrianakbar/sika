import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log('Start seeding...')

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@sika.com' },
    update: {},
    create: {
      name: 'Administrator',
      email: 'admin@sika.com',
      password: 'admin123', // In production, hash this password
      role: 'ADMIN',
    },
  })

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@sika.com' },
    update: {},
    create: {
      name: 'User Demo',
      email: 'user@sika.com',
      password: 'user123', // In production, hash this password
      role: 'USER',
    },
  })

  // Create sample goals
  const goal1 = await prisma.goal.create({
    data: {
      title: 'Implementasi Sistem SIKA',
      description: 'Mengimplementasikan sistem informasi keselamatan dan kesehatan kerja',
      status: 'IN_PROGRESS',
      userId: admin.id,
    },
  })

  const goal2 = await prisma.goal.create({
    data: {
      title: 'Pelatihan K3',
      description: 'Mengadakan pelatihan keselamatan dan kesehatan kerja untuk seluruh karyawan',
      status: 'PENDING',
      userId: admin.id,
    },
  })

  // Create sample site plot plans
  const siteplot1 = await prisma.sitePlotPlan.create({
    data: {
      name: 'Layout Kantor Pusat',
      description: 'Denah layout kantor pusat dengan area keselamatan',
      filePath: '/uploads/layout-office.pdf',
      userId: admin.id,
    },
  })

  // Create sample organization structure
  const orgHead = await prisma.organizationStructure.create({
    data: {
      name: 'Direktur Utama',
      position: 'Direktur Utama',
      department: 'Management',
      userId: admin.id,
    },
  })

  const orgManager = await prisma.organizationStructure.create({
    data: {
      name: 'Manager K3',
      position: 'Manager',
      department: 'Keselamatan dan Kesehatan Kerja',
      parentId: orgHead.id,
      userId: admin.id,
    },
  })

  console.log({ admin, user, goal1, goal2, siteplot1, orgHead, orgManager })
  console.log('Seeding finished.')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })

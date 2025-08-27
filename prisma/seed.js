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

  // Create sample permit planning data
  const permit1 = await prisma.permitPlanning.create({
    data: {
      permitNumber: 'SIKA-2025-001',
      workDescription: 'Pemeliharaan rutin pompa air cooling tower',
      workLocation: 'Area Utilities - Cooling Tower Unit 1',
      locationCode: 'UTL',
      areaName: 'Utilities Area',
      coordinates: '{"x": 150, "y": 200}',
      zone: 'UTL',
      workType: 'COLD_WORK',
      riskLevel: 'MEDIUM',
      startDate: new Date('2025-08-22T08:00:00.000Z'),
      endDate: new Date('2025-08-22T17:00:00.000Z'),
      performingAuthority: 'John Manager',
      company: 'PT Maintenance Specialist',
      areaAuthority: 'Utilities Manager',
      siteControllerName: 'Budi Santoso',
      ppeRequired: 'Safety helmet, safety shoes, gloves, safety glasses',
      safetyMeasures: 'Lockout/tagout procedure, work area isolation',
      emergencyContact: '+62-811-2345-6789',
      relatedDocuments: '{"l2ra": {"checked": true, "number": "L2RA-001"}, "confineSpace": {"checked": false, "number": ""}, "tkiTko": {"checked": false, "number": ""}, "other": {"checked": false, "number": ""}}',
      status: 'APPROVED',
      approvedBy: 'Manager K3',
      approvedAt: new Date(),
      userId: user.id,
    },
  })

  const permit2 = await prisma.permitPlanning.create({
    data: {
      permitNumber: 'SIKA-2025-002',
      workDescription: 'Pengelasan pipa steam di area produksi',
      workLocation: 'Area Produksi - Unit Distilasi 2',
      locationCode: 'PRC',
      areaName: 'Processing Area',
      coordinates: '{"x": 300, "y": 400}',
      zone: 'PRC',
      workType: 'HOT_WORK_FLAME',
      riskLevel: 'HIGH',
      startDate: new Date('2025-08-23T06:00:00.000Z'),
      endDate: new Date('2025-08-23T18:00:00.000Z'),
      performingAuthority: 'Ahmad Supervisor',
      company: 'PT Welding Expert',
      areaAuthority: 'Production Manager',
      siteControllerName: 'Ahmad Wijaya',
      ppeRequired: 'Welding mask, fire-resistant clothing, safety boots, gloves',
      safetyMeasures: 'Fire watch, gas monitoring, hot work permit',
      emergencyContact: '+62-811-9876-5432',
      relatedDocuments: '{"l2ra": {"checked": true, "number": "L2RA-002"}, "confineSpace": {"checked": true, "number": "CSE-001"}, "tkiTko": {"checked": false, "number": ""}, "other": {"checked": false, "number": ""}}',
      status: 'UNDER_REVIEW',
      userId: user.id,
    },
  })

  const permit3 = await prisma.permitPlanning.create({
    data: {
      permitNumber: 'SIKA-2025-003',
      workDescription: 'Pembersihan dan inspeksi tangki penyimpanan',
      workLocation: 'Tank Farm - Tangki T-301',
      locationCode: 'PRC',
      areaName: 'Tank Farm',
      coordinates: '{"x": 500, "y": 100}',
      zone: 'PRC',
      workType: 'COLD_WORK_BREAKING',
      riskLevel: 'CRITICAL',
      startDate: new Date('2025-08-20T07:00:00.000Z'),
      endDate: new Date('2025-08-20T16:00:00.000Z'),
      performingAuthority: 'Safety Inspector',
      company: 'PT Tank Services',
      areaAuthority: 'Tank Farm Manager',
      siteControllerName: 'Siti Nurhaliza',
      ppeRequired: 'SCBA, chemical suit, safety harness, gas detector',
      safetyMeasures: 'Atmospheric testing, rescue team standby, continuous monitoring',
      emergencyContact: '+62-811-1111-2222',
      relatedDocuments: '{"l2ra": {"checked": true, "number": "L2RA-003"}, "confineSpace": {"checked": true, "number": "CSE-002"}, "tkiTko": {"checked": true, "number": "TKI-001"}, "other": {"checked": false, "number": ""}}',
      status: 'COMPLETED',
      approvedBy: 'Safety Manager',
      approvedAt: new Date('2025-08-19T10:00:00.000Z'),
      userId: admin.id,
    },
  })

  const permit4 = await prisma.permitPlanning.create({
    data: {
      permitNumber: 'SIKA-2025-004',
      workDescription: 'Instalasi kabel listrik baru untuk sistem kontrol',
      workLocation: 'Central Control Room - Panel B',
      locationCode: 'CCR',
      areaName: 'Control Room',
      coordinates: '{"x": 250, "y": 350}',
      zone: 'CCR',
      workType: 'HOT_WORK_SPARK',
      riskLevel: 'MEDIUM',
      startDate: new Date('2025-08-21T08:00:00.000Z'),
      endDate: new Date('2025-08-25T17:00:00.000Z'),
      performingAuthority: 'Electrical Supervisor',
      company: 'PT Electrical Solutions',
      areaAuthority: 'Control Room Manager',
      siteControllerName: 'Rina Permata',
      ppeRequired: 'Insulated gloves, electrical safety boots, voltage detector',
      safetyMeasures: 'LOTO procedure, electrical isolation, voltage testing',
      emergencyContact: '+62-811-3333-4444',
      relatedDocuments: '{"l2ra": {"checked": false, "number": ""}, "confineSpace": {"checked": false, "number": ""}, "tkiTko": {"checked": true, "number": "TKO-001"}, "other": {"checked": true, "number": "ELECTRICAL-PERMIT-001"}}',
      status: 'ACTIVE',
      approvedBy: 'Electrical Supervisor',
      approvedAt: new Date('2025-08-20T15:00:00.000Z'),
      userId: user.id,
    },
  })

  // Create expired permit (for testing)
  const expiredPermit = await prisma.permitPlanning.create({
    data: {
      permitNumber: 'SIKA-2025-005',
      workDescription: 'Pembersihan saluran air limbah',
      workLocation: 'Waste Water Treatment Plant',
      locationCode: 'UTL',
      areaName: 'WWTP',
      coordinates: '{"x": 100, "y": 600}',
      zone: 'UTL',
      workType: 'COLD_WORK',
      riskLevel: 'LOW',
      startDate: new Date('2025-08-15T08:00:00.000Z'),
      endDate: new Date('2025-08-15T17:00:00.000Z'), // Already passed
      performingAuthority: 'Operations Supervisor',
      company: 'PT Cleaning Service',
      areaAuthority: 'WWTP Manager',
      siteControllerName: 'Joko Susilo',
      ppeRequired: 'Rubber boots, gloves, mask',
      safetyMeasures: 'Confined space monitoring, ventilation',
      emergencyContact: '+62-811-5555-6666',
      relatedDocuments: '{"l2ra": {"checked": false, "number": ""}, "confineSpace": {"checked": true, "number": "CSE-003"}, "tkiTko": {"checked": false, "number": ""}, "other": {"checked": false, "number": ""}}',
      status: 'ACTIVE', // Should be expired
      approvedBy: 'Operations Manager',
      approvedAt: new Date('2025-08-14T10:00:00.000Z'),
      userId: user.id,
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

  console.log({ admin, user, goal1, goal2, permit1, permit2, permit3, permit4, expiredPermit, orgHead, orgManager })
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

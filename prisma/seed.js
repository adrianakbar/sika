import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🚀 Starting database seeding...')
  
  // Clear existing data
  console.log('🧹 Clearing existing data...')
  await prisma.permitPlanning.deleteMany({})
  await prisma.goal.deleteMany({})
  await prisma.organizationStructure.deleteMany({})
  await prisma.user.deleteMany({})
  
  console.log('👥 Creating users...')
  
  // Create users with hashed passwords
  const adminPassword = await bcrypt.hash('admin123', 10)
  const admin = await prisma.user.create({
    data: {
      name: 'System Administrator',
      email: 'admin@sika.com',
      password: adminPassword,
      role: 'ADMIN',
    },
  })

  const ptwcPassword = await bcrypt.hash('ptwc123', 10)
  const ptwc1 = await prisma.user.create({
    data: {
      name: 'User PTWC',
      email: 'ptwc@sika.com',
      password: ptwcPassword,
      role: 'PTWC',
    },
  })

  const ptwc2 = await prisma.user.create({
    data: {
      name: 'User PTWC 2',
      email: 'ptwc2@sika.com',
      password: ptwcPassword,
      role: 'PTWC',
    },
  })

  const aaPassword = await bcrypt.hash('aa123', 10)
  const aa1 = await prisma.user.create({
    data: {
      name: 'User AA',
      email: 'aa@sika.com',
      password: aaPassword,
      role: 'AA',
    },
  })

  const aa2 = await prisma.user.create({
    data: {
      name: 'User AA 2',
      email: 'aa.processing@sika.com',
      password: aaPassword,
      role: 'AA',
    },
  })

  const scPassword = await bcrypt.hash('sc123', 10)
  const sc1 = await prisma.user.create({
    data: {
      name: 'User SC',
      email: 'sc@sika.com',
      password: scPassword,
      role: 'SC',
    },
  })

  const sc2 = await prisma.user.create({
    data: {
      name: 'User SC 2',
      email: 'sc.utilities@sika.com',
      password: scPassword,
      role: 'SC',
    },
  })

  const userPassword = await bcrypt.hash('user123', 10)
  const user1 = await prisma.user.create({
    data: {
      name: 'Operator Produksi',
      email: 'operator@sika.com',
      password: userPassword,
      role: 'USER',
    },
  })

  // Test users (same as test-users.js)
  const testPassword = await bcrypt.hash('password123', 10)
  const testPtwc = await prisma.user.create({
    data: {
      name: 'Test PTWC User',
      email: 'ptwc@test.com',
      password: testPassword,
      role: 'PTWC',
    },
  })

  const testAA = await prisma.user.create({
    data: {
      name: 'Test AA User',
      email: 'aa@test.com',
      password: testPassword,
      role: 'AA',
    },
  })

  const testSC = await prisma.user.create({
    data: {
      name: 'Test SC User',
      email: 'sc@test.com',
      password: testPassword,
      role: 'SC',
    },
  })

  const testAdmin = await prisma.user.create({
    data: {
      name: 'Test Admin User',
      email: 'admin@test.com',
      password: testPassword,
      role: 'ADMIN',
    },
  })

  console.log('🎯 Creating goals...')
  
  // Create sample goals
  const goals = await Promise.all([
    prisma.goal.create({
      data: {
        title: 'Zero Accident Campaign 2025',
        description: 'Mencapai target zero accident untuk tahun 2025 dengan implementasi sistem SIKA yang lebih ketat',
        status: 'IN_PROGRESS',
        userId: admin.id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Digitalisasi Permit System',
        description: 'Mendigitalisasi seluruh proses permit kerja untuk meningkatkan efisiensi dan akuntabilitas',
        status: 'IN_PROGRESS',
        userId: admin.id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Pelatihan K3 Berkelanjutan',
        description: 'Mengadakan pelatihan keselamatan dan kesehatan kerja untuk seluruh karyawan secara berkala',
        status: 'PENDING',
        userId: admin.id,
      },
    }),
    prisma.goal.create({
      data: {
        title: 'Audit Sistem Keselamatan',
        description: 'Melakukan audit menyeluruh terhadap sistem keselamatan kerja di seluruh area',
        status: 'COMPLETED',
        userId: admin.id,
      },
    }),
  ])

  console.log('🏢 Creating organization structure...')
  
  // Create organization structure
  const orgDirector = await prisma.organizationStructure.create({
    data: {
      name: 'Direktur Operasional',
      position: 'Direktur',
      department: 'Direksi',
      userId: admin.id,
    },
  })

  const orgHSEManager = await prisma.organizationStructure.create({
    data: {
      name: 'Manager HSE',
      position: 'Manager',
      department: 'Health, Safety & Environment',
      parentId: orgDirector.id,
      userId: admin.id,
    },
  })

  const orgProductionManager = await prisma.organizationStructure.create({
    data: {
      name: 'Manager Produksi',
      position: 'Manager',
      department: 'Produksi',
      parentId: orgDirector.id,
      userId: aa1.id,
    },
  })

  const orgUtilitiesManager = await prisma.organizationStructure.create({
    data: {
      name: 'Manager Utilities',
      position: 'Manager',
      department: 'Utilities',
      parentId: orgDirector.id,
      userId: aa2.id,
    },
  })

  console.log('📋 Creating permit planning data...')
  
  // Helper function to create dates
  const getDate = (daysFromNow, hour = 8) => {
    const date = new Date()
    date.setDate(date.getDate() + daysFromNow)
    date.setHours(hour, 0, 0, 0)
    return date
  }

  // Create comprehensive permit planning data
  const permits = await Promise.all([
    // ACTIVE permits (fully approved)
    prisma.permitPlanning.create({
      data: {
        permitNumber: 'SIKA-2025-001',
        workDescription: 'Pemeliharaan rutin pompa sentrifugal cooling tower unit 1 meliputi penggantian bearing, seal, dan impeller',
        workLocation: 'Area Utilities - Cooling Tower Unit 1, Pompa P-301A',
        locationCode: 'UTL',
        areaName: 'Utilities Area',
        coordinates: '150;200',
        zone: 'UTL',
        workType: 'COLD_WORK',
        riskLevel: 'MEDIUM',
        startDate: getDate(1, 8),
        endDate: getDate(1, 17),
        performingAuthority: 'Supervisor Maintenance',
        company: 'PT Maintenance Specialist Indonesia',
        areaAuthority: 'Manager Utilities',
        siteControllerName: 'Site Controller Utilities',
        ppeRequired: 'Safety helmet, safety shoes, work gloves, safety glasses, ear protection',
        safetyMeasures: 'Lockout/tagout procedure, work area isolation, permit to work, toolbox talk',
        emergencyContact: '+62-811-2345-6789',
        relatedDocuments: JSON.stringify({
          l2ra: { checked: true, number: 'L2RA-UTL-001' },
          confineSpace: { checked: false, number: '' },
          tkiTko: { checked: true, number: 'TKI-UTL-001' },
          other: { checked: false, number: '' }
        }),
        status: 'ACTIVE',
        aaApprovedBy: aa2.id,
        aaApprovedAt: getDate(-2),
        aaComments: 'Disetujui dengan catatan pastikan LOTO procedure dilaksanakan dengan benar',
        scApprovedBy: sc2.id,
        scApprovedAt: getDate(-1),
        scComments: 'Disetujui, pastikan area kerja terisolasi dan emergency response team standby',
        userId: ptwc1.id,
      },
    }),
    
    prisma.permitPlanning.create({
      data: {
        permitNumber: 'SIKA-2025-002',
        workDescription: 'Pengelasan perbaikan pipa steam line 6 inch di unit distilasi dengan menggunakan elektroda E7018',
        workLocation: 'Area Processing - Unit Distilasi 2, Steam Line SL-201',
        locationCode: 'PRC',
        areaName: 'Processing Area',
        coordinates: '300;400',
        zone: 'PRC',
        workType: 'HOT_WORK_FLAME',
        riskLevel: 'HIGH',
        startDate: getDate(2, 6),
        endDate: getDate(2, 18),
        performingAuthority: 'Supervisor Welding',
        company: 'PT Welding Expert Nusantara',
        areaAuthority: 'Manager Processing',
        siteControllerName: 'Site Controller Processing',
        ppeRequired: 'Welding helmet, fire-resistant clothing, safety boots, leather gloves, respiratory protection',
        safetyMeasures: 'Hot work permit, fire watch, gas monitoring, fire extinguisher standby, area ventilation',
        emergencyContact: '+62-811-9876-5432',
        relatedDocuments: JSON.stringify({
          l2ra: { checked: true, number: 'L2RA-PRC-002' },
          confineSpace: { checked: false, number: '' },
          tkiTko: { checked: true, number: 'TKO-PRC-001' },
          other: { checked: true, number: 'HOT-WORK-002' }
        }),
        status: 'ACTIVE',
        aaApprovedBy: aa1.id,
        aaApprovedAt: getDate(-1),
        aaComments: 'Disetujui untuk hot work dengan fire watch wajib dan gas monitoring kontinyu',
        scApprovedBy: sc1.id,
        scApprovedAt: getDate(0),
        scComments: 'Approved with strict fire prevention measures',
        userId: ptwc1.id,
      },
    }),

    // PENDING approvals
    prisma.permitPlanning.create({
      data: {
        permitNumber: 'SIKA-2025-003',
        workDescription: 'Pembersihan dan inspeksi internal tangki penyimpanan crude oil T-301 dengan kapasitas 50,000 bbl',
        workLocation: 'Tank Farm Area - Tangki T-301',
        locationCode: 'PRC',
        areaName: 'Tank Farm',
        coordinates: '500;100',
        zone: 'PRC',
        workType: 'COLD_WORK_BREAKING',
        riskLevel: 'CRITICAL',
        startDate: getDate(3, 7),
        endDate: getDate(5, 16),
        performingAuthority: 'Safety Inspector Senior',
        company: 'PT Tank Cleaning Services',
        areaAuthority: 'Manager Tank Farm',
        siteControllerName: 'Site Controller Tank Farm',
        ppeRequired: 'SCBA, chemical resistant suit, safety harness, gas detector personal, emergency escape mask',
        safetyMeasures: 'Atmospheric testing, rescue team standby, continuous gas monitoring, emergency response plan activated',
        emergencyContact: '+62-811-1111-2222',
        relatedDocuments: JSON.stringify({
          l2ra: { checked: true, number: 'L2RA-TANK-003' },
          confineSpace: { checked: true, number: 'CSE-TANK-002' },
          tkiTko: { checked: true, number: 'TKI-TANK-001' },
          other: { checked: true, number: 'TANK-ENTRY-PERMIT-003' }
        }),
        status: 'PENDING_AA_APPROVAL',
        userId: ptwc2.id,
      },
    }),

    prisma.permitPlanning.create({
      data: {
        permitNumber: 'SIKA-2025-004',
        workDescription: 'Instalasi sistem kabel fiber optic baru untuk upgrade sistem kontrol DCS di control room',
        workLocation: 'Central Control Room - Panel DCS Section B',
        locationCode: 'CCR',
        areaName: 'Control Room',
        coordinates: '250;350',
        zone: 'CCR',
        workType: 'HOT_WORK_SPARK',
        riskLevel: 'MEDIUM',
        startDate: getDate(4, 8),
        endDate: getDate(8, 17),
        performingAuthority: 'Electrical Supervisor',
        company: 'PT Electrical & Instrumentation Solutions',
        areaAuthority: 'Manager Control Room',
        siteControllerName: 'Site Controller CCR',
        ppeRequired: 'Insulated gloves class 0, electrical safety boots, voltage detector, arc flash suit',
        safetyMeasures: 'LOTO procedure, electrical isolation verification, voltage testing, grounding verification',
        emergencyContact: '+62-811-3333-4444',
        relatedDocuments: JSON.stringify({
          l2ra: { checked: true, number: 'L2RA-CCR-004' },
          confineSpace: { checked: false, number: '' },
          tkiTko: { checked: true, number: 'TKO-CCR-001' },
          other: { checked: true, number: 'ELECTRICAL-PERMIT-004' }
        }),
        status: 'AA_APPROVED',
        aaApprovedBy: aa1.id,
        aaApprovedAt: getDate(-1),
        aaComments: 'Approved dengan catatan pastikan semua sistem electrical ter-isolasi dengan benar',
        userId: ptwc2.id,
      },
    }),

    // DRAFT permits
    prisma.permitPlanning.create({
      data: {
        permitNumber: 'SIKA-2025-005',
        workDescription: 'Perbaikan struktur beton pada pondasi compressor reciprocating unit 3',
        workLocation: 'Compressor House - Unit 3 Foundation',
        locationCode: 'PRC',
        areaName: 'Compressor Area',
        coordinates: '400;300',
        zone: 'PRC',
        workType: 'COLD_WORK',
        riskLevel: 'MEDIUM',
        startDate: getDate(7, 8),
        endDate: getDate(10, 17),
        performingAuthority: 'Civil Supervisor',
        company: 'PT Konstruksi Beton Unggul',
        areaAuthority: 'Manager Mechanical',
        siteControllerName: 'Site Controller Mechanical',
        ppeRequired: 'Safety helmet, safety shoes, dust mask, work gloves, safety harness',
        safetyMeasures: 'Area isolation, dust control measures, noise monitoring, structural stability check',
        emergencyContact: '+62-811-4444-5555',
        relatedDocuments: JSON.stringify({
          l2ra: { checked: false, number: '' },
          confineSpace: { checked: false, number: '' },
          tkiTko: { checked: false, number: '' },
          other: { checked: false, number: '' }
        }),
        status: 'DRAFT',
        userId: ptwc1.id,
      },
    }),

    // REJECTED permit
    prisma.permitPlanning.create({
      data: {
        permitNumber: 'SIKA-2025-006',
        workDescription: 'Pembersihan saluran air limbah waste water treatment plant section A',
        workLocation: 'WWTP - Clarifier Basin A',
        locationCode: 'UTL',
        areaName: 'Waste Water Treatment Plant',
        coordinates: '100;600',
        zone: 'UTL',
        workType: 'COLD_WORK',
        riskLevel: 'HIGH',
        startDate: getDate(-5, 8),
        endDate: getDate(-5, 17),
        performingAuthority: 'Operations Supervisor WWTP',
        company: 'PT Environmental Cleaning',
        areaAuthority: 'Manager Environmental',
        siteControllerName: 'Site Controller Environmental',
        ppeRequired: 'Rubber boots, chemical gloves, protective clothing, face shield',
        safetyMeasures: 'Gas detection, proper ventilation, safety signage, emergency shower access',
        emergencyContact: '+62-811-5555-6666',
        relatedDocuments: JSON.stringify({
          l2ra: { checked: false, number: '' },
          confineSpace: { checked: false, number: '' },
          tkiTko: { checked: false, number: '' },
          other: { checked: false, number: '' }
        }),
        status: 'REJECTED_BY_AA',
        rejectedBy: aa2.id,
        rejectedAt: getDate(-3),
        rejectionReason: 'Safety measures tidak memadai untuk confined space work. Dibutuhkan SCBA, rescue team standby, dan atmospheric monitoring. Silakan revisi JSA dan tambahkan confined space entry permit.',
        userId: ptwc1.id,
      },
    }),

    // COMPLETED permit
    prisma.permitPlanning.create({
      data: {
        permitNumber: 'SIKA-2025-007',
        workDescription: 'Kalibrasi instrumentasi pressure transmitter dan flow meter di unit separasi',
        workLocation: 'Separation Unit - Instrument Section',
        locationCode: 'PRC',
        areaName: 'Separation Unit',
        coordinates: '350;250',
        zone: 'PRC',
        workType: 'COLD_WORK',
        riskLevel: 'LOW',
        startDate: getDate(-7, 8),
        endDate: getDate(-7, 16),
        performingAuthority: 'Instrument Technician Senior',
        company: 'PT Instrument Calibration Service',
        areaAuthority: 'Manager Instrumentation',
        siteControllerName: 'Site Controller Instrumentation',
        ppeRequired: 'Safety helmet, safety shoes, work gloves, safety glasses',
        safetyMeasures: 'Equipment isolation, calibration procedures, documentation requirement',
        emergencyContact: '+62-811-7777-8888',
        relatedDocuments: JSON.stringify({
          l2ra: { checked: true, number: 'L2RA-INST-007' },
          confineSpace: { checked: false, number: '' },
          tkiTko: { checked: false, number: '' },
          other: { checked: true, number: 'CALIB-CERT-007' }
        }),
        status: 'COMPLETED',
        aaApprovedBy: aa1.id,
        aaApprovedAt: getDate(-10),
        aaComments: 'Approved untuk pekerjaan kalibrasi rutin',
        scApprovedBy: sc1.id,
        scApprovedAt: getDate(-9),
        scComments: 'Approved, pastikan dokumentasi kalibrasi lengkap',
        userId: ptwc2.id,
      },
    }),
  ])

  console.log('✅ Database seeding completed successfully!')
  console.log(`📊 Summary:`)
  console.log(`   - Users created: ${11} (including test users)`)
  console.log(`   - Goals created: ${goals.length}`)
  console.log(`   - Organization structures: 4`)
  console.log(`   - Permits created: ${permits.length}`)
  console.log(`     • Active: 2`)
  console.log(`     • Pending AA Approval: 1`) 
  console.log(`     • AA Approved (Pending SC): 1`)
  console.log(`     • Draft: 1`)
  console.log(`     • Rejected: 1`)
  console.log(`     • Completed: 1`)
  
  console.log('\n🔑 Login Credentials:')
  console.log('📧 Main Users:')
  console.log('   - Admin: admin@sika.com / admin123')
  console.log('   - PTWC: ptwc@sika.com / ptwc123')
  console.log('   - AA: aa@sika.com / aa123')
  console.log('   - SC: sc@sika.com / sc123')
  console.log('📧 Test Users:')
  console.log('   - Test PTWC: ptwc@test.com / password123')
  console.log('   - Test AA: aa@test.com / password123')
  console.log('   - Test SC: sc@test.com / password123')
  console.log('   - Test Admin: admin@test.com / password123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error('❌ Seeding failed:', e)
    await prisma.$disconnect()
    process.exit(1)
  })

import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function checkPermits() {
  try {
    console.log('🔍 Checking permits in database...\n');
    
    // Get all permits
    const allPermits = await prisma.permitPlanning.findMany({
      include: {
        user: {
          select: {
            name: true,
            email: true,
            role: true
          }
        }
      },
      orderBy: { id: 'asc' }
    });
    
    console.log(`Total permits: ${allPermits.length}\n`);
    
    // Show all permits with their status
    allPermits.forEach(permit => {
      console.log(`Permit ${permit.id}:`);
      console.log(`  - Number: ${permit.permitNumber}`);
      console.log(`  - Status: ${permit.status}`);
      console.log(`  - Location: ${permit.workLocation}`);
      console.log(`  - Zone: ${permit.zone}`);
      console.log(`  - Start Date: ${permit.startDate}`);
      console.log(`  - End Date: ${permit.endDate}`);
      console.log(`  - Coordinates: ${permit.coordinates}`);
      console.log(`  - User: ${permit.user?.name} (${permit.user?.role})`);
      console.log('---');
    });
    
    // Check active permits specifically
    const activePermits = allPermits.filter(p => p.status === 'ACTIVE');
    console.log(`\n📊 Active permits: ${activePermits.length}`);
    
    activePermits.forEach(permit => {
      console.log(`✅ Active Permit ${permit.id}: ${permit.permitNumber}`);
      console.log(`   Location: ${permit.workLocation}`);
      console.log(`   Zone: ${permit.zone}`);
      console.log(`   Coordinates: ${permit.coordinates}`);
      console.log(`   Start: ${permit.startDate}`);
      console.log(`   End: ${permit.endDate}`);
    });
    
    // Check current date vs permit dates
    const currentDate = new Date();
    console.log(`\n📅 Current date: ${currentDate.toISOString().split('T')[0]}\n`);
    
    allPermits.forEach(permit => {
      const startDate = new Date(permit.startDate);
      const endDate = new Date(permit.endDate);
      
      console.log(`Permit ${permit.id} (${permit.status}):`);
      console.log(`  Start: ${startDate.toISOString().split('T')[0]}`);
      console.log(`  End: ${endDate.toISOString().split('T')[0]}`);
      
      if (currentDate >= startDate && currentDate <= endDate) {
        console.log(`  ✅ Should be RUNNING (within date range)`);
      } else if (currentDate < startDate) {
        console.log(`  ⏳ Should be PENDING (before start date)`);
      } else {
        console.log(`  ⏹️ Should be COMPLETED (past end date)`);
      }
      console.log('');
    });
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkPermits();

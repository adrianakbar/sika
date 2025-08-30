// Test date logic
const currentDate = new Date();
console.log('📅 Current date:', currentDate.toISOString().split('T')[0]);

// Test permit dates
const permits = [
  {
    id: 4,
    permitNumber: 'SIKA-2025-004',
    startDate: '2025-08-21T08:00:00.000Z',
    endDate: '2025-08-25T17:00:00.000Z',
    status: 'ACTIVE'
  },
  {
    id: 1,
    permitNumber: 'SIKA-2025-001', 
    startDate: '2025-08-22T08:00:00.000Z',
    endDate: '2025-08-22T17:00:00.000Z',
    status: 'ACTIVE'
  }
];

permits.forEach(permit => {
  console.log(`\n🔍 Testing permit ${permit.id}:`);
  
  const currentDateCopy = new Date(currentDate);
  const startDate = new Date(permit.startDate);
  const endDate = new Date(permit.endDate);
  
  console.log(`  - Start: ${startDate.toISOString().split('T')[0]}`);
  console.log(`  - End: ${endDate.toISOString().split('T')[0]}`);
  
  // Set time like in the original code
  currentDateCopy.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  // Calculate days since end date
  const daysSinceEnd = Math.floor((currentDateCopy - endDate) / (1000 * 60 * 60 * 24));
  console.log(`  - Days since end: ${daysSinceEnd}`);
  
  // Check filter condition
  if (daysSinceEnd >= 1) {
    console.log(`  ❌ FILTERED OUT - too old (${daysSinceEnd} days past end date)`);
  } else {
    console.log(`  ✅ INCLUDED - still valid`);
    
    // Check dynamic status
    let dynamicStatus = permit.status.toLowerCase();
    
    if (currentDateCopy >= startDate && currentDateCopy <= endDate && permit.status !== 'CANCELLED') {
      dynamicStatus = 'running';
      console.log(`  🏃 Status: RUNNING`);
    } else if (currentDateCopy > endDate) {
      dynamicStatus = 'completed';
      console.log(`  ✅ Status: COMPLETED`);
    } else if (currentDateCopy < startDate) {
      dynamicStatus = 'pending';
      console.log(`  ⏳ Status: PENDING`);
    }
  }
});

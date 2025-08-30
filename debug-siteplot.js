// Debug script untuk Site Plot Plans
console.log('🔍 Debug Site Plot Plans Issue\n');

// Sample permit data (sesuai dengan yang seharusnya ada di database)
const samplePermits = [
  {
    id: 1,
    permitNumber: 'PTWC-001',
    status: 'ACTIVE',
    workType: 'HOT_WORK_FLAME',
    workLocation: 'Process Area A',
    zone: 'PRC',
    coordinates: '{"x": 60, "y": 30}',
    startDate: '2025-08-29T00:00:00.000Z',
    endDate: '2025-08-31T23:59:59.000Z',
    company: 'PT ABC'
  },
  {
    id: 2,
    permitNumber: 'PTWC-002', 
    status: 'ACTIVE',
    workType: 'COLD_WORK',
    workLocation: 'Utilities Section',
    zone: 'UTL',
    coordinates: '{"x": 35, "y": 18}',
    startDate: '2025-08-30T00:00:00.000Z',
    endDate: '2025-09-01T23:59:59.000Z',
    company: 'PT XYZ'
  }
];

// Function untuk parse coordinates
function parseCoordinates(coordinates, zone) {
  console.log(`🎯 Parsing coordinates: ${coordinates} for zone: ${zone}`);
  
  if (!coordinates) {
    console.log('❌ No coordinates provided');
    return { x: 50, y: 50 }; // default fallback
  }

  try {
    const parsed = JSON.parse(coordinates);
    if (parsed.x !== undefined && parsed.y !== undefined) {
      console.log(`✅ Successfully parsed: x=${parsed.x}, y=${parsed.y}`);
      return parsed;
    }
  } catch (error) {
    console.log(`❌ JSON parse error: ${error.message}`);
  }

  console.log(`🔄 Using fallback coordinates`);
  return { x: 50, y: 50 };
}

// Function untuk get permit type code
function getPermitTypeCode(workType) {
  const typeMap = {
    COLD_WORK: "GW",
    COLD_WORK_BREAKING: "BC", 
    HOT_WORK_SPARK: "CW",
    HOT_WORK_FLAME: "HW",
  };
  
  const code = typeMap[workType] || "GW";
  console.log(`🏷️ Work type ${workType} mapped to ${code}`);
  return code;
}

// Simulate the conversion process
console.log('📋 Processing sample permits...\n');

const currentDate = new Date();
console.log(`📅 Current date: ${currentDate.toISOString().split('T')[0]}\n`);

const convertedPermits = samplePermits.map((permit) => {
  console.log(`\n🔍 Processing permit ${permit.id}:`);
  console.log(`  - Number: ${permit.permitNumber}`);
  console.log(`  - Status: ${permit.status}`);
  console.log(`  - Zone: ${permit.zone}`);
  console.log(`  - Coordinates: ${permit.coordinates}`);
  
  const coords = parseCoordinates(permit.coordinates, permit.zone);
  
  const startDate = new Date(permit.startDate);
  const endDate = new Date(permit.endDate);
  
  console.log(`  - Start: ${startDate.toISOString().split('T')[0]}`);
  console.log(`  - End: ${endDate.toISOString().split('T')[0]}`);
  
  // Set time to beginning of day for proper date comparison
  const currentDateCopy = new Date(currentDate);
  currentDateCopy.setHours(0, 0, 0, 0);
  startDate.setHours(0, 0, 0, 0);
  endDate.setHours(23, 59, 59, 999);
  
  // Calculate days since end date
  const daysSinceEnd = Math.floor((currentDateCopy - endDate) / (1000 * 60 * 60 * 24));
  console.log(`  - Days since end: ${daysSinceEnd}`);
  
  // Check if should be filtered out
  if (daysSinceEnd >= 1) {
    console.log(`  ❌ FILTERED OUT - too old`);
    return null;
  }
  
  let dynamicStatus = permit.status.toLowerCase();
  
  // Determine status based on date range
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
  
  const result = {
    id: permit.id,
    x: coords.x,
    y: coords.y,
    type: getPermitTypeCode(permit.workType),
    status: dynamicStatus,
    permitNumber: permit.permitNumber,
    location: permit.workLocation,
    zone: permit.zone,
    area: permit.zone,
  };
  
  console.log(`  ✨ Final result:`, result);
  return result;
}).filter(permit => permit !== null);

console.log(`\n🎯 Final converted permits: ${convertedPermits.length}`);
console.log('\n📊 Summary:');
convertedPermits.forEach(permit => {
  console.log(`  - ${permit.permitNumber}: ${permit.status} at (${permit.x}, ${permit.y}) in ${permit.zone}`);
});

console.log('\n✅ Debug completed');

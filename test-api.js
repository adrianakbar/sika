// Test API permit-planning
async function testAPI() {
  try {
    console.log('🧪 Testing permit-planning API...\n');
    
    // Test without userId first  
    const response1 = await fetch('http://localhost:3001/api/permit-planning');
    const result1 = await response1.json();
    console.log('📋 All permits (no filter):', JSON.stringify(result1, null, 2));
    
    // Test with sample userId
    const response2 = await fetch('http://localhost:3001/api/permit-planning?userId=2');
    const result2 = await response2.json();
    console.log('\n📋 Permits for userId=2:', JSON.stringify(result2, null, 2));
    
    // Test with status filter
    const response3 = await fetch('http://localhost:3001/api/permit-planning?status=ACTIVE');
    const result3 = await response3.json();
    console.log('\n📋 Active permits:', JSON.stringify(result3, null, 2));
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

// Wait a bit for server to be ready
setTimeout(testAPI, 3000);

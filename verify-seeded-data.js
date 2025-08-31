/**
 * Script to verify seeded data
 */

const BASE_URL = 'http://localhost:3000';

async function verifySeededData() {
  console.log('🔍 Verifying Seeded Data');
  console.log('=' .repeat(50));
  
  // Test main user logins
  const mainUsers = [
    { email: 'admin@sika.com', password: 'admin123', role: 'ADMIN' },
    { email: 'ptwc@sika.com', password: 'ptwc123', role: 'PTWC' },
    { email: 'aa@sika.com', password: 'aa123', role: 'AA' },
    { email: 'sc@sika.com', password: 'sc123', role: 'SC' }
  ];

  console.log('\n👥 Testing Main User Logins:');
  for (const user of mainUsers) {
    try {
      const response = await fetch(`${BASE_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: user.email, password: user.password })
      });
      const result = await response.json();
      console.log(`   ${result.success ? '✅' : '❌'} ${user.role}: ${user.email}`);
    } catch (error) {
      console.log(`   ❌ ${user.role}: ${user.email} - Error: ${error.message}`);
    }
  }

  // Test PTWC login and get permits
  try {
    console.log('\n📋 Testing Permit Data:');
    const ptwcResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'ptwc@sika.com', password: 'ptwc123' })
    });
    const ptwcUser = await ptwcResponse.json();
    
    if (ptwcUser.success) {
      const permitsResponse = await fetch(`${BASE_URL}/api/permit-planning?userId=${ptwcUser.user.id}`);
      const permitsResult = await permitsResponse.json();
      
      if (permitsResult.success) {
        console.log(`   ✅ Total permits: ${permitsResult.data.length}`);
        
        // Count by status
        const statusCounts = {};
        permitsResult.data.forEach(permit => {
          statusCounts[permit.status] = (statusCounts[permit.status] || 0) + 1;
        });
        
        console.log('   📊 Permit Status Distribution:');
        Object.entries(statusCounts).forEach(([status, count]) => {
          console.log(`      - ${status}: ${count}`);
        });
      }
    }
  } catch (error) {
    console.log(`   ❌ Error checking permits: ${error.message}`);
  }

  // Test goals
  try {
    console.log('\n🎯 Testing Goals Data:');
    const adminResponse = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'admin@sika.com', password: 'admin123' })
    });
    const adminUser = await adminResponse.json();
    
    if (adminUser.success) {
      const goalsResponse = await fetch(`${BASE_URL}/api/goals?userId=${adminUser.user.id}`);
      const goalsResult = await goalsResponse.json();
      
      if (goalsResult.success) {
        console.log(`   ✅ Total goals: ${goalsResult.data.length}`);
        goalsResult.data.forEach(goal => {
          console.log(`      - ${goal.title} (${goal.status})`);
        });
      }
    }
  } catch (error) {
    console.log(`   ❌ Error checking goals: ${error.message}`);
  }

  console.log('\n🎉 Verification completed!');
  console.log('\n📱 You can now test the application:');
  console.log('   1. Open http://localhost:3000/login');
  console.log('   2. Login with any of the seeded credentials');
  console.log('   3. Explore the permit workflow and dashboard');
}

verifySeededData();

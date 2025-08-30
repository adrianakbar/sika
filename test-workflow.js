// Test script untuk workflow 3 aktor SIKA
const BASE_URL = 'http://localhost:3000';

// Helper function untuk HTTP requests
async function apiRequest(endpoint, method = 'GET', body = null, headers = {}) {
  const config = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers
    }
  };
  
  if (body) {
    config.body = JSON.stringify(body);
  }
  
  const response = await fetch(`${BASE_URL}${endpoint}`, config);
  const result = await response.json();
  
  console.log(`${method} ${endpoint} - Status: ${response.status}`);
  console.log('Response:', result);
  console.log('---');
  
  return result;
}

async function testWorkflow() {
  console.log('🧪 Testing SIKA 3-Actor Workflow\n');
  
  try {
    // 1. Test login untuk setiap role
    console.log('1. Testing Login for Each Role');
    
    const ptwcLogin = await apiRequest('/api/auth/login', 'POST', {
      email: 'ptwc@sika.com',
      password: 'ptwc123'
    });
    
    const aaLogin = await apiRequest('/api/auth/login', 'POST', {
      email: 'aa@sika.com', 
      password: 'aa123'
    });
    
    const ccLogin = await apiRequest('/api/auth/login', 'POST', {
      email: 'cc@sika.com',
      password: 'cc123'
    });
    
    if (!ptwcLogin.success || !aaLogin.success || !ccLogin.success) {
      console.error('❌ Login tests failed');
      return;
    }
    
    console.log('✅ All logins successful\n');
    
    // 2. Test dashboard untuk setiap role
    console.log('2. Testing Dashboard for Each Role');
    
    await apiRequest(`/api/dashboard/permits?userId=2&role=PTWC`);
    await apiRequest(`/api/dashboard/permits?userId=3&role=AA`);
    await apiRequest(`/api/dashboard/permits?userId=4&role=CC`);
    
    console.log('✅ Dashboard tests completed\n');
    
    // 3. Test submit permit (PTWC)
    console.log('3. Testing Permit Submit (PTWC)');
    
    // Submit permit ID 4 (status DRAFT)
    await apiRequest('/api/permit-planning/4/submit', 'POST', {
      userId: 2 // PTWC user ID
    });
    
    console.log('✅ Permit submit test completed\n');
    
    // 4. Test AA approval
    console.log('4. Testing AA Approval');
    
    // Approve permit yang baru di-submit
    await apiRequest('/api/permit-planning/4/approve', 'POST', {
      userId: 3, // AA user ID
      role: 'AA',
      comments: 'Test approval by AA'
    });
    
    console.log('✅ AA approval test completed\n');
    
    // 5. Test CC approval
    console.log('5. Testing CC Approval');
    
    // Final approve oleh CC
    await apiRequest('/api/permit-planning/4/approve', 'POST', {
      userId: 4, // CC user ID  
      role: 'CC',
      comments: 'Final approval by CC'
    });
    
    console.log('✅ CC approval test completed\n');
    
    // 6. Test site plot visualization (hanya ACTIVE permits)
    console.log('6. Testing Site Plot Visualization');
    
    await apiRequest('/api/site-plot-visualization');
    
    console.log('✅ Site plot visualization test completed\n');
    
    // 7. Test rejection workflow
    console.log('7. Testing Rejection Workflow');
    
    // Reject permit ID 2 oleh AA
    await apiRequest('/api/permit-planning/2/approve', 'PUT', {
      userId: 3, // AA user ID
      role: 'AA', 
      rejectionReason: 'Test rejection - insufficient safety measures'
    });
    
    console.log('✅ Rejection test completed\n');
    
    console.log('🎉 All tests completed successfully!');
    
  } catch (error) {
    console.error('❌ Test failed:', error);
  }
}

// Jalankan test jika file ini dieksekusi langsung
if (import.meta.url === `file://${process.argv[1]}`) {
  testWorkflow();
}

export { testWorkflow, apiRequest };

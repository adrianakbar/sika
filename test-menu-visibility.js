/**
 * Test script to verify menu visibility for different roles
 */

const BASE_URL = 'http://localhost:3000';

// Test users
const testUsers = {
  ptwc: { email: 'ptwc@test.com', password: 'password123', role: 'PTWC' },
  aa: { email: 'aa@test.com', password: 'password123', role: 'AA' },
  sc: { email: 'sc@test.com', password: 'password123', role: 'SC' },
  admin: { email: 'admin@test.com', password: 'password123', role: 'ADMIN' }
};

/**
 * Login user
 */
async function loginUser(userType) {
  console.log(`\n👤 Testing login for ${userType.toUpperCase()}...`);
  
  const user = testUsers[userType];
  try {
    const response = await fetch(`${BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: user.email,
        password: user.password
      })
    });

    const result = await response.json();
    
    if (result.success) {
      console.log(`✅ ${userType.toUpperCase()} logged in successfully`);
      console.log(`   User: ${result.user.name} (${result.user.role})`);
      console.log(`   Expected behavior: ${user.role === 'AA' || user.role === 'SC' ? 'Permit Planning menu should be HIDDEN' : 'Permit Planning menu should be VISIBLE'}`);
      return result.user;
    } else {
      console.log(`❌ Failed to login ${userType}: ${result.message}`);
      return null;
    }
  } catch (error) {
    console.log(`❌ Error logging in ${userType}: ${error.message}`);
    return null;
  }
}

/**
 * Main test function
 */
async function testMenuVisibility() {
  console.log('🚀 Testing Menu Visibility for Different Roles');
  console.log('='.repeat(50));
  
  const roles = ['ptwc', 'aa', 'sc', 'admin'];
  
  for (const role of roles) {
    await loginUser(role);
  }
  
  console.log('\n📋 Summary:');
  console.log('- PTWC and ADMIN: Should see Permit Planning menu');
  console.log('- AA and SC: Should NOT see Permit Planning menu');
  console.log('\nTo verify, log in to the web application with the respective user credentials and check the sidebar menu.');
}

testMenuVisibility();

// Test login functionality
const testLogin = async () => {
  try {
    console.log('Testing login with admin credentials...');
    
    const response = await fetch('http://localhost:3000/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'admin@sika.com',
        password: 'admin123'
      })
    });
    
    const result = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', result);
    
    if (response.ok) {
      console.log('✅ Login successful!');
    } else {
      console.log('❌ Login failed:', result.message);
    }
    
  } catch (error) {
    console.error('❌ Network error:', error.message);
  }
};

// Run the test
testLogin();

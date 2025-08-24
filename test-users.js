const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function testUsers() {
  try {
    console.log('Checking users in database...');
    
    const users = await prisma.user.findMany();
    console.log('Users found:', users.length);
    
    users.forEach((user, index) => {
      console.log(`\nUser ${index + 1}:`);
      console.log('ID:', user.id);
      console.log('Name:', user.name);
      console.log('Email:', user.email);
      console.log('Password (first 10 chars):', user.password?.substring(0, 10) + '...');
      console.log('Role:', user.role);
    });
    
    // Test authentication with first user
    if (users.length > 0) {
      const testUser = users[0];
      console.log(`\nTesting authentication with user: ${testUser.email}`);
      console.log('Stored password:', testUser.password);
      
      // Test with exact password
      const authResult = await prisma.user.findUnique({
        where: { email: testUser.email }
      });
      
      if (authResult && authResult.password === testUser.password) {
        console.log('✅ Password comparison works');
      } else {
        console.log('❌ Password comparison failed');
      }
    }
    
  } catch (error) {
    console.error('Error:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testUsers();

/**
 * Setup Test Users Script
 * Creates test users for workflow testing if they don't exist
 */

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const testUsers = [
  {
    name: 'Test PTWC User',
    email: 'ptwc@test.com',
    password: 'password123',
    role: 'PTWC'
  },
  {
    name: 'Test AA User',
    email: 'aa@test.com',
    password: 'password123',
    role: 'AA'
  },
  {
    name: 'Test SC User',
    email: 'sc@test.com',
    password: 'password123',
    role: 'SC'
  },
  {
    name: 'Test Admin User',
    email: 'admin@test.com',
    password: 'password123',
    role: 'ADMIN'
  }
];

async function setupTestUsers() {
  console.log('🔧 Setting up test users...');
  
  for (const userData of testUsers) {
    try {
      // Check if user already exists
      const existingUser = await prisma.user.findUnique({
        where: { email: userData.email }
      });
      
      if (existingUser) {
        console.log(`✅ User ${userData.email} (${userData.role}) already exists`);
        continue;
      }
      
      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await prisma.user.create({
        data: {
          name: userData.name,
          email: userData.email,
          password: hashedPassword,
          role: userData.role
        }
      });
      
      console.log(`✅ Created user: ${user.email} (${user.role})`);
      
    } catch (error) {
      console.error(`❌ Failed to create user ${userData.email}:`, error.message);
    }
  }
  
  console.log('\n🎉 Test users setup completed!');
  console.log('You can now run the workflow test with:');
  console.log('node test-workflow-complete.js');
}

async function cleanupTestUsers() {
  console.log('🧹 Cleaning up test users...');
  
  for (const userData of testUsers) {
    try {
      const deleted = await prisma.user.deleteMany({
        where: { email: userData.email }
      });
      
      if (deleted.count > 0) {
        console.log(`✅ Deleted user: ${userData.email}`);
      } else {
        console.log(`ℹ️  User ${userData.email} not found`);
      }
    } catch (error) {
      console.error(`❌ Failed to delete user ${userData.email}:`, error.message);
    }
  }
  
  console.log('🎉 Cleanup completed!');
}

async function listTestUsers() {
  console.log('📋 Current test users:');
  
  for (const userData of testUsers) {
    try {
      const user = await prisma.user.findUnique({
        where: { email: userData.email },
        select: {
          id: true,
          name: true,
          email: true,
          role: true,
          createdAt: true
        }
      });
      
      if (user) {
        console.log(`✅ ${user.email} (${user.role}) - ID: ${user.id}`);
      } else {
        console.log(`❌ ${userData.email} (${userData.role}) - NOT FOUND`);
      }
    } catch (error) {
      console.error(`❌ Error checking user ${userData.email}:`, error.message);
    }
  }
}

// Main execution
async function main() {
  const args = process.argv.slice(2);
  
  try {
    switch (args[0]) {
      case 'setup':
        await setupTestUsers();
        break;
      case 'cleanup':
        await cleanupTestUsers();
        break;
      case 'list':
        await listTestUsers();
        break;
      default:
        console.log('Usage:');
        console.log('  node setup-test-users.js setup   - Create test users');
        console.log('  node setup-test-users.js cleanup - Delete test users');
        console.log('  node setup-test-users.js list    - List current test users');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();

export {
  setupTestUsers,
  cleanupTestUsers,
  listTestUsers,
  testUsers
};

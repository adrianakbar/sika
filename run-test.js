#!/usr/bin/env node

/**
 * Test Runner Script for SIKA Workflow Testing
 * Usage: node run-test.js [command]
 */

const { execSync } = require('child_process');
const fs = require('fs');

function runCommand(command, description) {
  console.log(`\n🚀 ${description}`);
  console.log(`📝 Running: ${command}`);
  console.log('─'.repeat(50));
  
  try {
    execSync(command, { stdio: 'inherit', cwd: __dirname });
    console.log('─'.repeat(50));
    console.log('✅ Command completed successfully!');
  } catch (error) {
    console.log('─'.repeat(50));
    console.error('❌ Command failed:', error.message);
    throw error;
  }
}

async function main() {
  const args = process.argv.slice(2);
  const command = args[0] || 'help';
  
  console.log('🧪 SIKA Workflow Test Runner');
  console.log('============================');
  
  try {
    switch (command) {
      case 'setup':
        console.log('Setting up test environment...');
        runCommand('node setup-test-users.js setup', 'Creating test users');
        break;
        
      case 'cleanup':
        console.log('Cleaning up test environment...');
        runCommand('node setup-test-users.js cleanup', 'Removing test users');
        break;
        
      case 'list-users':
        runCommand('node setup-test-users.js list', 'Listing test users');
        break;
        
      case 'full-workflow':
        console.log('Running complete workflow test...');
        runCommand('node test-workflow-complete.js', 'Testing PTWC → AA → SC → SitePlot workflow');
        break;
        
      case 'test-login':
        runCommand('node test-workflow-complete.js login', 'Testing user login');
        break;
        
      case 'test-create':
        runCommand('node test-workflow-complete.js create', 'Testing permit creation');
        break;
        
      case 'test-submit':
        runCommand('node test-workflow-complete.js submit', 'Testing permit submission');
        break;
        
      case 'test-aa':
        runCommand('node test-workflow-complete.js aa-approve', 'Testing AA approval');
        break;
        
      case 'test-sc':
        runCommand('node test-workflow-complete.js sc-approve', 'Testing SC approval');
        break;
        
      case 'test-siteplot':
        runCommand('node test-workflow-complete.js site-plot', 'Testing site plot visualization');
        break;
        
      case 'quick-test':
        console.log('Running quick test sequence...');
        runCommand('node setup-test-users.js setup', 'Setting up test users');
        setTimeout(() => {
          runCommand('node test-workflow-complete.js', 'Running full workflow test');
        }, 2000);
        break;
        
      case 'db-status':
        console.log('Checking database status...');
        runCommand('npx prisma db push', 'Syncing database schema');
        runCommand('node setup-test-users.js list', 'Listing current users');
        break;
        
      case 'help':
      default:
        console.log(`
Available commands:

📋 Setup & Cleanup:
  setup          - Create test users for workflow testing
  cleanup        - Remove all test users
  list-users     - List current test users
  db-status      - Check database status and sync schema

🧪 Testing Commands:
  full-workflow  - Run complete PTWC → AA → SC → SitePlot test
  quick-test     - Setup users + run full workflow test
  
🔧 Individual Tests:
  test-login     - Test user login for all roles
  test-create    - Test permit creation as PTWC
  test-submit    - Test permit submission
  test-aa        - Test AA approval process
  test-sc        - Test SC approval process
  test-siteplot  - Test site plot visualization

💡 Example Usage:
  node run-test.js setup
  node run-test.js full-workflow
  node run-test.js cleanup

🌐 Make sure your development server is running:
  npm run dev
        `);
        break;
    }
    
  } catch (error) {
    console.error('\n❌ Test execution failed!');
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Check if required files exist
function checkRequiredFiles() {
  const requiredFiles = [
    'test-workflow-complete.js',
    'setup-test-users.js',
    'package.json',
    'prisma/schema.prisma'
  ];
  
  for (const file of requiredFiles) {
    if (!fs.existsSync(file)) {
      console.error(`❌ Required file missing: ${file}`);
      process.exit(1);
    }
  }
}

// Run the main function
if (require.main === module) {
  checkRequiredFiles();
  main().catch(console.error);
}

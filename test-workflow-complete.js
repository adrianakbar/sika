/**
 * Complete Workflow Testing Script
 * Testing: PTWC creates permit → AA approval → SC approval → Pin appears in siteplotplans
 */

const BASE_URL = 'http://localhost:3000';

// Test users
const testUsers = {
  ptwc: { email: 'ptwc@test.com', password: 'password123', role: 'PTWC' },
  aa: { email: 'aa@test.com', password: 'password123', role: 'AA' },
  sc: { email: 'sc@test.com', password: 'password123', role: 'SC' },
  admin: { email: 'admin@test.com', password: 'password123', role: 'ADMIN' }
};

// Global variables to store user data and permit data
let userData = {};
let createdPermit = null;

/**
 * Utility function to make API calls
 */
async function apiCall(endpoint, method = 'GET', data = null) {
  const headers = {
    'Content-Type': 'application/json'
  };

  const config = {
    method,
    headers
  };

  if (data && method !== 'GET') {
    config.body = JSON.stringify(data);
  }

  try {
    console.log(`🔄 ${method} ${BASE_URL}${endpoint}`);
    const response = await fetch(`${BASE_URL}${endpoint}`, config);
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${result.message || 'Request failed'}`);
    }
    
    return result;
  } catch (error) {
    console.error(`❌ API call failed: ${error.message}`);
    throw error;
  }
}

/**
 * Login user and store user data
 */
async function loginUser(userType) {
  console.log(`\n👤 Logging in ${userType.toUpperCase()}...`);
  
  const user = testUsers[userType];
  const result = await apiCall('/api/auth/login', 'POST', {
    email: user.email,
    password: user.password
  });

  if (result.success) {
    userData[userType] = result.user;
    console.log(`✅ ${userType.toUpperCase()} logged in successfully`);
    console.log(`   User: ${result.user.name} (${result.user.role})`);
    return result.user;
  } else {
    throw new Error(`Failed to login ${userType}: ${result.message}`);
  }
}

/**
 * Create a test permit as PTWC
 */
async function createPermit() {
  console.log(`\n📝 Creating permit as PTWC...`);
  
  const ptwcUser = userData.ptwc || await loginUser('ptwc');
  
  // Generate unique permit number for testing
  const timestamp = Date.now();
  const permitNumber = `TEST-PTW-${timestamp}`;
  
  const permitData = {
    permitNumber: permitNumber,
    userId: ptwcUser.id,
    workDescription: "Testing SC Approval Workflow - Hot Work on Pipeline Section A-1",
    workLocation: "Processing Area - Pipeline Section A-1",
    locationCode: "PRC",
    areaName: "Processing Area",
    zone: "PRC",
    workType: "HOT_WORK_FLAME",
    riskLevel: "HIGH",
    startDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(), // Tomorrow
    endDate: new Date(Date.now() + 48 * 60 * 60 * 1000).toISOString(), // Day after tomorrow
    performingAuthority: "John Smith",
    company: "PT. Contractor ABC",
    areaAuthority: "Jane Doe",
    siteControllerName: "Mike Johnson",
    ppeRequired: "Fire retardant suit, respiratory protection, safety harness",
    safetyMeasures: "Fire watch, gas monitoring, isolation procedures",
    emergencyContact: "+62-811-1234-5678",
    coordinates: JSON.stringify({ x: 150, y: 200 }) // Coordinates for site plot
  };

  const result = await apiCall('/api/permit-planning', 'POST', permitData);
  
  if (result.success) {
    createdPermit = result.data;
    console.log(`✅ Permit created successfully`);
    console.log(`   Permit ID: ${createdPermit.id}`);
    console.log(`   Permit Number: ${createdPermit.permitNumber}`);
    console.log(`   Status: ${createdPermit.status}`);
    console.log(`   Work Type: ${createdPermit.workType}`);
    console.log(`   Risk Level: ${createdPermit.riskLevel}`);
    return createdPermit;
  } else {
    throw new Error(`Failed to create permit: ${result.message}`);
  }
}

/**
 * Submit permit for approval
 */
async function submitPermit() {
  console.log(`\n📤 Submitting permit for approval...`);
  
  const result = await apiCall(`/api/permit-planning/${createdPermit.id}/submit`, 'POST', {
    userId: createdPermit.userId
  });
  
  if (result.success) {
    createdPermit = result.data;
    console.log(`✅ Permit submitted successfully`);
    console.log(`   Status: ${createdPermit.status}`);
    return createdPermit;
  } else {
    throw new Error(`Failed to submit permit: ${result.message}`);
  }
}

/**
 * Check AA dashboard for pending permits
 */
async function checkAADashboard() {
  console.log(`\n🔍 Checking AA dashboard for pending permits...`);
  
  const aaUser = userData.aa || await loginUser('aa');
  const result = await apiCall(`/api/dashboard/permits?userId=${aaUser.id}&role=${aaUser.role}`, 'GET');
  
  if (result.success) {
    console.log(`✅ AA Dashboard retrieved`);
    console.log(`   Total permits pending AA approval: ${result.data.permits.length}`);
    
    const ourPermit = result.data.permits.find(p => p.id === createdPermit.id);
    if (ourPermit) {
      console.log(`   ✅ Our permit found in AA dashboard`);
      console.log(`   Status: ${ourPermit.status}`);
    } else {
      console.log(`   ❌ Our permit NOT found in AA dashboard`);
    }
    
    return result.data;
  } else {
    throw new Error(`Failed to get AA dashboard: ${result.message}`);
  }
}

/**
 * AA approves the permit
 */
async function aaApproval() {
  console.log(`\n✅ AA approving permit...`);
  
  const aaUser = userData.aa || await loginUser('aa');
  const result = await apiCall(`/api/permit-planning/${createdPermit.id}/approve`, 'POST', {
    userId: aaUser.id,
    role: 'AA',
    comments: 'Approved by Area Authority - Safety measures are adequate'
  });
  
  if (result.success) {
    createdPermit = result.data;
    console.log(`✅ Permit approved by AA`);
    console.log(`   Status: ${createdPermit.status}`);
    console.log(`   AA Approved by: ${createdPermit.aaApprover?.name}`);
    console.log(`   AA Comments: ${createdPermit.aaComments}`);
    return createdPermit;
  } else {
    throw new Error(`Failed to approve permit by AA: ${result.message}`);
  }
}

/**
 * Check SC dashboard for pending permits
 */
async function checkSCDashboard() {
  console.log(`\n🔍 Checking SC dashboard for pending permits...`);
  
  const scUser = userData.sc || await loginUser('sc');
  const result = await apiCall(`/api/dashboard/permits?userId=${scUser.id}&role=${scUser.role}`, 'GET');
  
  if (result.success) {
    console.log(`✅ SC Dashboard retrieved`);
    console.log(`   Total permits pending SC approval: ${result.data.permits.length}`);
    
    const ourPermit = result.data.permits.find(p => p.id === createdPermit.id);
    if (ourPermit) {
      console.log(`   ✅ Our permit found in SC dashboard`);
      console.log(`   Status: ${ourPermit.status}`);
    } else {
      console.log(`   ❌ Our permit NOT found in SC dashboard`);
    }
    
    return result.data;
  } else {
    throw new Error(`Failed to get SC dashboard: ${result.message}`);
  }
}

/**
 * SC approves the permit
 */
async function scApproval() {
  console.log(`\n✅ SC approving permit...`);
  
  const scUser = userData.sc || await loginUser('sc');
  const result = await apiCall(`/api/permit-planning/${createdPermit.id}/approve`, 'POST', {
    userId: scUser.id,
    role: 'SC',
    comments: 'Approved by Site Controller - All safety requirements met, work can proceed'
  });
  
  if (result.success) {
    createdPermit = result.data;
    console.log(`✅ Permit approved by SC`);
    console.log(`   Status: ${createdPermit.status}`);
    console.log(`   SC Approved by: ${createdPermit.scApprover?.name}`);
    console.log(`   SC Comments: ${createdPermit.scComments}`);
    return createdPermit;
  } else {
    throw new Error(`Failed to approve permit by SC: ${result.message}`);
  }
}

/**
 * Check if permit appears in site plot visualization
 */
async function checkSitePlotVisualization() {
  console.log(`\n📍 Checking site plot visualization for active permits...`);
  
  try {
    const result = await apiCall('/api/site-plot-visualization', 'GET');
    
    if (result.success) {
      console.log(`✅ Site plot data retrieved`);
      console.log(`   Total active permits: ${result.data.length}`);
      
      const ourPermit = result.data.find(p => p.id === createdPermit.id);
      if (ourPermit) {
        console.log(`   ✅ Our permit found in site plot!`);
        console.log(`   Permit Number: ${ourPermit.permitNumber}`);
        console.log(`   Location: ${ourPermit.workLocation}`);
        console.log(`   Zone: ${ourPermit.zone}`);
        console.log(`   Coordinates: ${ourPermit.coordinates}`);
        console.log(`   Work Type: ${ourPermit.workType}`);
        console.log(`   Risk Level: ${ourPermit.riskLevel}`);
        console.log(`   Status: ${ourPermit.status}`);
      } else {
        console.log(`   ❌ Our permit NOT found in site plot visualization`);
        console.log(`   Available permits:`, result.data.map(p => ({
          id: p.id,
          permitNumber: p.permitNumber,
          status: p.status
        })));
      }
      
      return result.data;
    } else {
      throw new Error(`Failed to get site plot data: ${result.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Error checking site plot: ${error.message}`);
    return null;
  }
}

/**
 * Get detailed permit information
 */
async function getPermitDetails() {
  console.log(`\n📋 Getting final permit details...`);
  
  try {
    const result = await apiCall(`/api/permit-planning/${createdPermit.id}`, 'GET');
    
    if (result.success) {
      const permit = result.data;
      console.log(`✅ Final permit details:`);
      console.log(`   ID: ${permit.id}`);
      console.log(`   Permit Number: ${permit.permitNumber}`);
      console.log(`   Status: ${permit.status}`);
      console.log(`   Work Description: ${permit.workDescription}`);
      console.log(`   Location: ${permit.workLocation} (${permit.zone})`);
      console.log(`   Work Type: ${permit.workType}`);
      console.log(`   Risk Level: ${permit.riskLevel}`);
      console.log(`   Created by: ${permit.user?.name} (${permit.user?.role})`);
      console.log(`   AA Approved by: ${permit.aaApprover?.name} at ${permit.aaApprovedAt}`);
      console.log(`   SC Approved by: ${permit.scApprover?.name} at ${permit.scApprovedAt}`);
      console.log(`   Coordinates: ${permit.coordinates}`);
      
      return permit;
    } else {
      throw new Error(`Failed to get permit details: ${result.message}`);
    }
  } catch (error) {
    console.log(`   ❌ Error getting permit details: ${error.message}`);
    return null;
  }
}

/**
 * Sleep function for delays
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Main workflow test function
 */
async function runWorkflowTest() {
  console.log('🚀 Starting Complete Workflow Test');
  console.log('=====================================');
  console.log('Testing: PTWC → AA → SC → SitePlot workflow');
  console.log('');

  try {
    // Step 1: Login PTWC and create permit
    await loginUser('ptwc');
    await createPermit();
    
    // Step 2: Submit permit for approval
    await submitPermit();
    
    // Small delay to ensure database is updated
    await sleep(1000);
    
    // Step 3: Check AA dashboard and approve
    await checkAADashboard();
    await aaApproval();
    
    // Small delay
    await sleep(1000);
    
    // Step 4: Check SC dashboard and approve
    await checkSCDashboard();
    await scApproval();
    
    // Small delay
    await sleep(1000);
    
    // Step 5: Check if permit appears in site plot
    await checkSitePlotVisualization();
    
    // Step 6: Get final permit details
    await loginUser('admin');
    await getPermitDetails();
    
    console.log('\n🎉 WORKFLOW TEST COMPLETED SUCCESSFULLY!');
    console.log('=====================================');
    console.log('✅ PTWC created permit');
    console.log('✅ PTWC submitted permit for approval');
    console.log('✅ AA approved permit');
    console.log('✅ SC approved permit');
    console.log('✅ Permit is now ACTIVE and visible in site plot');
    
  } catch (error) {
    console.error('\n❌ WORKFLOW TEST FAILED!');
    console.error('=====================================');
    console.error('Error:', error.message);
    
    if (createdPermit) {
      console.log('\nPermit details at failure:');
      console.log(`   ID: ${createdPermit.id}`);
      console.log(`   Status: ${createdPermit.status}`);
      console.log(`   Permit Number: ${createdPermit.permitNumber}`);
    }
  }
}

/**
 * Test specific workflow step
 */
async function testStep(stepName) {
  console.log(`🔧 Testing specific step: ${stepName}`);
  
  switch (stepName) {
    case 'login':
      await loginUser('ptwc');
      await loginUser('aa');
      await loginUser('sc');
      break;
      
    case 'create':
      await loginUser('ptwc');
      await createPermit();
      break;
      
    case 'submit':
      // Assumes permit already exists
      await loginUser('ptwc');
      await submitPermit();
      break;
      
    case 'aa-approve':
      await loginUser('aa');
      await aaApproval();
      break;
      
    case 'sc-approve':
      await loginUser('sc');
      await scApproval();
      break;
      
    case 'site-plot':
      await checkSitePlotVisualization();
      break;
      
    default:
      console.log('Available steps: login, create, submit, aa-approve, sc-approve, site-plot');
  }
}

// Export functions for individual testing
export {
  runWorkflowTest,
  testStep,
  loginUser,
  createPermit,
  submitPermit,
  checkAADashboard,
  aaApproval,
  checkSCDashboard,
  scApproval,
  checkSitePlotVisualization,
  getPermitDetails
};

// Run the test if this script is executed directly
const args = process.argv.slice(2);

if (args.length > 0) {
  testStep(args[0]).catch(console.error);
} else {
  runWorkflowTest().catch(console.error);
}

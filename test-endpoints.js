// test-endpoints.js - Test script to verify API endpoints
const axios = require('axios');

const BASE_URL = 'http://localhost:3000';

// Test data
const testUser = {
  name: "Test User",
  email: "testuser@example.com"
};

const testBus = {
  busNumber: "TEST001",
  totalSeats: 30,
  availableSeats: 25
};

// Helper function for logging
const logTest = (testName, status, details = '') => {
  const timestamp = new Date().toISOString();
  const statusIcon = status === 'PASS' ? '✅' : '❌';
  console.log(`[${timestamp}] ${statusIcon} ${testName}: ${details}`);
};

// Test functions
async function testHealthCheck() {
  try {
    const response = await axios.get(`${BASE_URL}/`);
    if (response.status === 200 && response.data.includes('Bus Booking System')) {
      logTest('Health Check', 'PASS', 'Server is running');
      return true;
    } else {
      logTest('Health Check', 'FAIL', 'Unexpected response');
      return false;
    }
  } catch (error) {
    logTest('Health Check', 'FAIL', error.message);
    return false;
  }
}

async function testGetUsers() {
  try {
    const response = await axios.get(`${BASE_URL}/users`);
    if (response.status === 200 && Array.isArray(response.data)) {
      logTest('GET /users', 'PASS', `Retrieved ${response.data.length} users`);
      return true;
    } else {
      logTest('GET /users', 'FAIL', 'Unexpected response format');
      return false;
    }
  } catch (error) {
    logTest('GET /users', 'FAIL', error.message);
    return false;
  }
}

async function testCreateUser() {
  try {
    const response = await axios.post(`${BASE_URL}/users`, testUser);
    if (response.status === 201 && response.data.user) {
      logTest('POST /users', 'PASS', `User created with ID: ${response.data.user.id}`);
      return response.data.user.id;
    } else {
      logTest('POST /users', 'FAIL', 'Unexpected response format');
      return null;
    }
  } catch (error) {
    logTest('POST /users', 'FAIL', error.message);
    return null;
  }
}

async function testGetBuses() {
  try {
    const response = await axios.get(`${BASE_URL}/buses`);
    if (response.status === 200 && response.data.buses) {
      logTest('GET /buses', 'PASS', `Retrieved ${response.data.buses.length} buses`);
      return true;
    } else {
      logTest('GET /buses', 'FAIL', 'Unexpected response format');
      return false;
    }
  } catch (error) {
    logTest('GET /buses', 'FAIL', error.message);
    return false;
  }
}

async function testCreateBus() {
  try {
    const response = await axios.post(`${BASE_URL}/buses`, testBus);
    if (response.status === 201 && response.data.bus) {
      logTest('POST /buses', 'PASS', `Bus created with ID: ${response.data.bus.id}`);
      return response.data.bus.id;
    } else {
      logTest('POST /buses', 'FAIL', 'Unexpected response format');
      return null;
    }
  } catch (error) {
    logTest('POST /buses', 'FAIL', error.message);
    return null;
  }
}

async function testGetBusesByAvailableSeats() {
  try {
    const response = await axios.get(`${BASE_URL}/buses/available/10`);
    if (response.status === 200 && response.data.buses) {
      logTest('GET /buses/available/10', 'PASS', `Found ${response.data.buses.length} buses with >10 available seats`);
      return true;
    } else {
      logTest('GET /buses/available/10', 'FAIL', 'Unexpected response format');
      return false;
    }
  } catch (error) {
    logTest('GET /buses/available/10', 'FAIL', error.message);
    return false;
  }
}

// Main test function
async function runAllTests() {
  console.log('🚀 Starting API Endpoint Tests...\n');
  
  let passedTests = 0;
  let totalTests = 6;
  
  // Test 1: Health Check
  if (await testHealthCheck()) passedTests++;
  
  // Test 2: Get Users
  if (await testGetUsers()) passedTests++;
  
  // Test 3: Create User
  const userId = await testCreateUser();
  if (userId) passedTests++;
  
  // Test 4: Get Buses
  if (await testGetBuses()) passedTests++;
  
  // Test 5: Create Bus
  const busId = await testCreateBus();
  if (busId) passedTests++;
  
  // Test 6: Get Buses by Available Seats
  if (await testGetBusesByAvailableSeats()) passedTests++;
  
  // Results
  console.log('\n' + '='.repeat(60));
  console.log('📊 TEST RESULTS SUMMARY');
  console.log('='.repeat(60));
  console.log(`✅ Passed: ${passedTests}/${totalTests} tests`);
  console.log(`❌ Failed: ${totalTests - passedTests}/${totalTests} tests`);
  
  if (passedTests === totalTests) {
    console.log('\n🎉 All tests passed! Your API is working correctly.');
    console.log('🚀 You can now use Postman to test the endpoints manually.');
  } else {
    console.log('\n⚠️  Some tests failed. Please check the server and database connection.');
  }
  
  console.log('\n📋 SQL Queries for Manual Testing:');
  console.log('• SELECT * FROM Users;');
  console.log('• SELECT * FROM Buses;');
  console.log('• SELECT * FROM Buses WHERE availableSeats > 10;');
  
  console.log('\n🔗 Postman Endpoints to Test:');
  console.log('• GET  http://localhost:3000/users');
  console.log('• POST http://localhost:3000/users');
  console.log('• GET  http://localhost:3000/buses');
  console.log('• POST http://localhost:3000/buses');
  console.log('• GET  http://localhost:3000/buses/available/10');
  
  console.log('='.repeat(60));
}

// Handle errors gracefully
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// Run tests
runAllTests().catch(console.error);


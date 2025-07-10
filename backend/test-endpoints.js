const http = require('http');

// Test configuration
const BASE_URL = 'http://localhost:3000';
const tests = [
  {
    name: 'Health Check',
    method: 'GET',
    path: '/health',
    expectedStatus: 200
  },
  {
    name: 'API Documentation Redirect',
    method: 'GET',
    path: '/',
    expectedStatus: [302, 200] // Can be redirect or direct response
  },
  {
    name: 'Swagger JSON',
    method: 'GET',
    path: '/swagger.json',
    expectedStatus: 200
  }
];

// Test runner
async function runTests() {
  console.log('🚀 Testing Backend Endpoints...\n');
  
  let passed = 0;
  let failed = 0;

  for (const test of tests) {
    try {
      console.log(`📝 Testing: ${test.name}`);
      
      const result = await makeRequest(test.method, test.path);
      
      const expectedStatuses = Array.isArray(test.expectedStatus) 
        ? test.expectedStatus 
        : [test.expectedStatus];
      
      if (expectedStatuses.includes(result.statusCode)) {
        console.log(`✅ PASSED - Status: ${result.statusCode}`);
        passed++;
      } else {
        console.log(`❌ FAILED - Expected: ${test.expectedStatus}, Got: ${result.statusCode}`);
        failed++;
      }
      
      console.log(''); // Empty line for readability
    } catch (error) {
      console.log(`❌ FAILED - Error: ${error.message}`);
      failed++;
      console.log(''); // Empty line for readability
    }
  }

  // Summary
  console.log('📊 Test Summary:');
  console.log(`✅ Passed: ${passed}`);
  console.log(`❌ Failed: ${failed}`);
  console.log(`📈 Success Rate: ${((passed / (passed + failed)) * 100).toFixed(1)}%`);

  if (failed === 0) {
    console.log('\n🎉 All tests passed! Backend is working correctly.');
  } else {
    console.log('\n⚠️  Some tests failed. Check the server logs for more details.');
  }
}

// HTTP request helper
function makeRequest(method, path) {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE_URL);
    
    const options = {
      hostname: url.hostname,
      port: url.port,
      path: url.pathname + url.search,
      method: method,
      timeout: 5000,
      headers: {
        'User-Agent': 'Backend-Test-Script/1.0'
      }
    };

    const req = http.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          body: data
        });
      });
    });

    req.on('error', (error) => {
      reject(new Error(`Request failed: ${error.message}`));
    });

    req.on('timeout', () => {
      reject(new Error('Request timeout'));
    });

    req.end();
  });
}

// Check if server is running
async function checkServerStatus() {
  try {
    console.log('🔍 Checking if server is running...');
    await makeRequest('GET', '/health');
    console.log('✅ Server is running!\n');
    return true;
  } catch (error) {
    console.log('❌ Server is not responding.');
    console.log('💡 Make sure to start the server with: npm run dev\n');
    return false;
  }
}

// Main execution
async function main() {
  const serverRunning = await checkServerStatus();
  
  if (serverRunning) {
    await runTests();
  } else {
    console.log('Instructions to start the backend:');
    console.log('1. Open a new terminal');
    console.log('2. Navigate to the backend directory');
    console.log('3. Run: npm run dev');
    console.log('4. Wait for "Server started" message');
    console.log('5. Run this test again: node test-endpoints.js');
  }
}

// Run the tests
main().catch(console.error); 
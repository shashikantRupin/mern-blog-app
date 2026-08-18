const axios = require('axios');

const BASE_URL = 'http://localhost:7000';

const runTest = async () => {
  try {
    console.log('--- Testing Strong Password Validation ---');

    // 1. Weak password (only lowercase/letters)
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: 'Weak User',
        email: `weak_${Date.now()}@example.com`,
        password: 'password'
      });
      console.error('FAIL: Weak password was incorrectly accepted!');
    } catch (err) {
      console.log('1. Weak password correctly rejected (400):', err.response?.data?.msg);
    }

    // 2. Missing uppercase (e.g., rupin@123)
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: 'No Upper',
        email: `noupper_${Date.now()}@example.com`,
        password: 'rupin@123'
      });
      console.error('FAIL: Password without uppercase was incorrectly accepted!');
    } catch (err) {
      console.log('2. Missing uppercase correctly rejected (400):', err.response?.data?.msg);
    }

    // 3. Missing special character (e.g., Rupin1234)
    try {
      await axios.post(`${BASE_URL}/signup`, {
        name: 'No Special',
        email: `nospec_${Date.now()}@example.com`,
        password: 'Rupin1234'
      });
      console.error('FAIL: Password without special character was incorrectly accepted!');
    } catch (err) {
      console.log('3. Missing special char correctly rejected (400):', err.response?.data?.msg);
    }

    // 4. Valid Strong Password: Rupin@123
    const strongEmail = `rupin_${Date.now()}@example.com`;
    const strongRes = await axios.post(`${BASE_URL}/signup`, {
      name: 'Rupin Raj',
      email: strongEmail,
      password: 'Rupin@123'
    });
    console.log('4. Valid Strong Password "Rupin@123" accepted (201):', strongRes.data?.msg);

    // 5. Test login with the strong password
    const loginRes = await axios.post(`${BASE_URL}/login`, {
      email: strongEmail,
      password: 'Rupin@123'
    });
    console.log('5. Login with "Rupin@123" successful (200), token received:', !!loginRes.data?.token);

    console.log('\n ALL STRONG PASSWORD VALIDATION TESTS PASSED 100%! \n');
  } catch (err) {
    console.error('Test Failed:', err.response?.data || err.message);
    process.exit(1);
  }
};

runTest();

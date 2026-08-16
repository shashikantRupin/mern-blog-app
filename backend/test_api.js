const axios = require('axios');

const API_URL = 'http://localhost:7000';

async function runTests() {
  console.log('=== Starting API Tests ===');
  let testsPassed = 0;
  let testsTotal = 0;

  const test = async (name, fn) => {
    testsTotal++;
    try {
      await fn();
      console.log(`PASS: ${name}`);
      testsPassed++;
    } catch (err) {
      console.error(`FAIL: ${name}`);
      console.error(`   Error: ${err.message}`);
      if (err.response) {
        console.error(`   Response status: ${err.response.status}`);
        console.error(`   Response data:`, err.response.data);
      }
    }
  };

  const testUser = {
    name: 'Test User',
    email: `test_${Date.now()}@example.com`,
    password: 'Password123!'
  };
  let authToken = '';

  // 1. Health check
  await test('GET / - API Health Check', async () => {
    const res = await axios.get(`${API_URL}/`);
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
  });

  // 2. Signup with missing fields
  await test('POST /signup - Missing fields validation', async () => {
    try {
      await axios.post(`${API_URL}/signup`, { email: 'bad@test.com' });
      throw new Error('Should have failed with 400');
    } catch (err) {
      if (err.response && err.response.status === 400) return;
      throw err;
    }
  });

  // 3. Successful Signup
  await test('POST /signup - Successful Registration', async () => {
    const res = await axios.post(`${API_URL}/signup`, testUser);
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    if (!res.data.user || res.data.user.email !== testUser.email.toLowerCase()) {
      throw new Error('Response did not contain expected user data');
    }
  });

  // 4. Duplicate Signup Prevention
  await test('POST /signup - Duplicate Email Rejection', async () => {
    try {
      await axios.post(`${API_URL}/signup`, testUser);
      throw new Error('Should have failed with 400 for duplicate email');
    } catch (err) {
      if (err.response && err.response.status === 400) return;
      throw err;
    }
  });

  // 5. Login with invalid password
  await test('POST /login - Invalid credentials rejection', async () => {
    try {
      await axios.post(`${API_URL}/login`, { email: testUser.email, password: 'WrongPassword' });
      throw new Error('Should have failed with 400');
    } catch (err) {
      if (err.response && err.response.status === 400) return;
      throw err;
    }
  });

  // 6. Successful Login
  await test('POST /login - Successful Login', async () => {
    const res = await axios.post(`${API_URL}/login`, { email: testUser.email, password: testUser.password });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!res.data.token) throw new Error('Response did not contain JWT token');
    authToken = res.data.token;
  });

  // 7. Access Protected Route without token
  await test('GET /blogs - Unauthorized without token', async () => {
    try {
      await axios.get(`${API_URL}/blogs`);
      throw new Error('Should have failed with 401');
    } catch (err) {
      if (err.response && err.response.status === 401) return;
      throw err;
    }
  });

  // 8. Access Protected Route with token
  await test('GET /blogs - Authorized with JWT', async () => {
    const res = await axios.get(`${API_URL}/blogs`, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (res.status !== 200) throw new Error(`Expected 200, got ${res.status}`);
    if (!Array.isArray(res.data)) throw new Error('Expected array of blogs');
  });

  // 9. Create Blog Post
  let createdBlogId = '';
  await test('POST /blogs/create - Create blog post', async () => {
    const res = await axios.post(`${API_URL}/blogs/create`, {
      title: 'Test Blog Post',
      content: 'This is test content for blog post.',
      type: 'tech',
      imageUrl: 'https://images.unsplash.com/photo-1485178575877-1a13bf489dfe'
    }, {
      headers: { Authorization: `Bearer ${authToken}` }
    });
    if (res.status !== 201) throw new Error(`Expected 201, got ${res.status}`);
    if (!res.data.blog || !res.data.blog._id) throw new Error('Blog not returned');
    createdBlogId = res.data.blog._id;
  });

  console.log(`\n=== API Test Summary: ${testsPassed}/${testsTotal} passed ===`);
}

// Allow slight delay if invoked immediately
setTimeout(runTests, 1000);

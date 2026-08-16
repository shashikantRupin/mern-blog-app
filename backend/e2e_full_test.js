const axios = require('axios');

const BASE_URL = 'http://localhost:7000';

async function fullE2ETest() {
  console.log('--- Starting Complete End-to-End API Test ---');

  const testUser = {
    name: 'Shashikant Tester',
    email: `tester_${Date.now()}@test.com`,
    password: 'SecurePassword123'
  };

  // Step 1: Sign Up
  console.log('1. Testing User Sign Up...');
  const signupRes = await axios.post(`${BASE_URL}/signup`, testUser);
  console.log('   Status:', signupRes.status);
  console.log('   Response msg:', signupRes.data.msg);
  if (!signupRes.data.user || signupRes.data.user.email !== testUser.email) {
    throw new Error('Sign up user data mismatch');
  }

  // Step 2: Login
  console.log('2. Testing User Login...');
  const loginRes = await axios.post(`${BASE_URL}/login`, {
    email: testUser.email,
    password: testUser.password
  });
  console.log('   Status:', loginRes.status);
  console.log('   Token received:', !!loginRes.data.token);
  console.log('   User name:', loginRes.data.name);
  const token = loginRes.data.token;

  const authHeaders = {
    headers: { Authorization: `Bearer ${token}` }
  };

  // Step 3: Create Blog
  console.log('3. Testing Blog Creation...');
  const createBlogRes = await axios.post(`${BASE_URL}/blogs/create`, {
    title: 'Testing MERN Blog App',
    content: 'Full end-to-end verification of login, signup, and blog CRUD operations.',
    type: 'tech',
    imageUrl: 'https://images.unsplash.com/photo-1485178575877-1a13bf489dfe'
  }, authHeaders);
  console.log('   Status:', createBlogRes.status);
  console.log('   Created Blog ID:', createBlogRes.data.blog._id);
  const blogId = createBlogRes.data.blog._id;

  // Step 4: Get All Blogs
  console.log('4. Testing Fetch All Blogs...');
  const allBlogsRes = await axios.get(`${BASE_URL}/blogs`, authHeaders);
  console.log('   Status:', allBlogsRes.status);
  console.log('   Total Blogs Found:', allBlogsRes.data.length);
  const foundBlog = allBlogsRes.data.find(b => b._id === blogId);
  if (!foundBlog) throw new Error('Newly created blog not found in /blogs');

  // Step 5: Get Single Blog
  console.log('5. Testing Fetch Single Blog by ID...');
  const singleBlogRes = await axios.get(`${BASE_URL}/blogs/${blogId}`, authHeaders);
  console.log('   Status:', singleBlogRes.status);
  console.log('   Blog Title:', singleBlogRes.data[0]?.title || singleBlogRes.data?.title);

  // Step 6: Update Blog
  console.log('6. Testing Update Blog...');
  const updateRes = await axios.put(`${BASE_URL}/blogs/update/${blogId}`, {
    title: 'Updated MERN Blog Title',
    content: 'Updated blog content text.'
  }, authHeaders);
  console.log('   Status:', updateRes.status);
  console.log('   Updated Message:', updateRes.data.message);

  // Step 7: Delete Blog
  console.log('7. Testing Delete Blog...');
  const deleteRes = await axios.delete(`${BASE_URL}/blogs/delete/${blogId}`, authHeaders);
  console.log('   Status:', deleteRes.status);
  console.log('   Deleted Message:', deleteRes.data.message);

  console.log('\n ALL 7 E2E OPERATIONS COMPLETED SUCCESSFULLY! ');
}

fullE2ETest().catch(err => {
  console.error(' E2E Test Failed:', err.message);
  if (err.response) {
    console.error('Data:', err.response.data);
  }
  process.exit(1);
});

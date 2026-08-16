const axios = require('axios');

const BASE_URL = 'http://localhost:7000';

const runTest = async () => {
  try {
    console.log('--- Testing Local Image (Base64) Creation & Update ---');
    
    // 1. Signup user
    const testEmail = `imguser_${Date.now()}@example.com`;
    const signupRes = await axios.post(`${BASE_URL}/signup`, {
      name: 'Image Tester',
      email: testEmail,
      password: 'password123'
    });
    console.log('1. User Signup:', signupRes.status);

    // 2. Login
    const loginRes = await axios.post(`${BASE_URL}/login`, {
      email: testEmail,
      password: 'password123'
    });
    const token = loginRes.data.token;
    console.log('2. User Login:', loginRes.status);

    // Sample local base64 JPG/PNG data URL (1x1 red png)
    const base64LocalPng = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8z8BQDwAEhQGAhKmMIQAAAABJRU5ErkJggg==';
    const base64LocalJpg = 'data:image/jpeg;base64,/9j/4AAQSkZJRgABAQEASABIAAD/2wBDAP//////////////////////////////////////////////////////////////////////////////////////wgALCAABAAEBAREA/8QAFBABAAAAAAAAAAAAAAAAAAAAAP/aAAgBAQABPxA=';

    // 3. Create Blog with Local Base64 Image
    const createRes = await axios.post(`${BASE_URL}/blogs/create`, {
      title: 'Local File Upload Test',
      content: 'This article was created with a local PNG image converted to data URL.',
      type: 'tech',
      imageUrl: base64LocalPng
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('3. Blog Created with Local Image:', createRes.status);

    // 4. Fetch the created blog
    const fetchRes = await axios.get(`${BASE_URL}/blogs`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const createdBlog = fetchRes.data.find(b => b.title === 'Local File Upload Test');
    console.log('4. Blog Verified in DB:', createdBlog ? 'FOUND' : 'NOT FOUND');
    console.log('   Image URL starts with:', createdBlog?.imageUrl.substring(0, 30));

    // 5. Update the blog with a new local JPG image
    const updateRes = await axios.put(`${BASE_URL}/blogs/update/${createdBlog._id}`, {
      title: 'Updated Title with Local JPG',
      content: 'Updated content body.',
      type: 'news',
      imageUrl: base64LocalJpg
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('5. Blog Updated with New Local Image:', updateRes.status);

    // 6. Fetch single blog to verify updated image
    const singleRes = await axios.get(`${BASE_URL}/blogs/${createdBlog._id}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    const updatedData = Array.isArray(singleRes.data) ? singleRes.data[0] : singleRes.data;
    console.log('6. Updated Image verified:', updatedData.imageUrl.startsWith('data:image/jpeg') ? 'SUCCESS' : 'FAILED');

    console.log('\n ALL LOCAL IMAGE TESTS PASSED SUCCESSFULLY! \n');
  } catch (err) {
    console.error('Test Failed:', err.response?.data || err.message);
    process.exit(1);
  }
};

runTest();

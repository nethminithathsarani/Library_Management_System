// Node.js v18+ has built-in fetch

const BASE_URL = 'http://localhost:5000/api';
const testUser = {
  name: 'Test User',
  email: `testuser_${Date.now()}@library.com`,
  password: 'TestPass123',
};

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[36m',
};

async function test(label, fn) {
  try {
    process.stdout.write(`\n${colors.blue}→ ${label}${colors.reset} `);
    await fn();
    console.log(`${colors.green}✓ PASS${colors.reset}`);
    return true;
  } catch (err) {
    console.log(`${colors.red}✗ FAIL${colors.reset}: ${err.message}`);
    return false;
  }
}

async function main() {
  console.log(`\n${colors.yellow}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.yellow}  Library Management System - Auth Flow Test  ${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════════${colors.reset}\n`);

  let token = null;
  let userId = null;
  let userRole = null;

  // Test 1: Signup
  await test('Signup new user', async () => {
    const res = await fetch(`${BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(testUser),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!data.message) throw new Error('No response message');
  });

  // Test 2: Login
  await test('Login with credentials', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testUser.email,
        password: testUser.password,
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    token = data.token;
    userId = data.user.id;
    userRole = data.user.role;
    if (!token) throw new Error('No JWT token returned');
    if (userRole !== 'user') throw new Error(`Expected role 'user', got '${userRole}'`);
  });

  // Test 3: Verify JWT contains userId
  await test('JWT contains userId and role', async () => {
    const parts = token.split('.');
    const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
    if (!payload.userId) throw new Error('No userId in JWT');
    if (payload.role !== 'user') throw new Error(`Expected role 'user', got '${payload.role}'`);
  });

  // Test 4: Get books without auth (should work - public endpoint)
  await test('GET /books without auth (public)', async () => {
    const res = await fetch(`${BASE_URL}/books`);
    if (!res.ok) throw new Error(`Status ${res.status}`);
  });

  // Test 5: Try to create book without auth (should fail)
  await test('POST /books without auth (should fail with 401)', async () => {
    const res = await fetch(`${BASE_URL}/books`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'Test Book',
        author: 'Test Author',
        genre: 'Fiction',
        isbn: '123-456',
        publicationDate: '2024-01-01',
      }),
    });
    if (res.ok) throw new Error('Should have failed with 401');
  });

  // Test 6: User tries to access admin borrowings endpoint (should fail)
  await test('GET /borrowings/admin with user JWT (should fail 403)', async () => {
    const res = await fetch(`${BASE_URL}/borrowings/admin`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) throw new Error('Should have failed with 403 Forbidden');
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
  });

  // Test 7: User accesses their own borrowings (should succeed)
  await test('GET /borrowings/me with user JWT (should succeed)', async () => {
    const res = await fetch(`${BASE_URL}/borrowings/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');
  });

  // Test 8: Admin login
  let adminToken = null;
  await test('Admin login', async () => {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@library.com',
        password: 'admin123', // From sample data in schema
      }),
    });
    if (!res.ok) throw new Error(`Status ${res.status}: ${await res.text()}`);
    const data = await res.json();
    adminToken = data.token;
    if (data.user.role !== 'admin') throw new Error(`Expected role 'admin', got '${data.user.role}'`);
  });

  // Test 9: Admin can access admin borrowings endpoint
  await test('GET /borrowings/admin with admin JWT (should succeed)', async () => {
    const res = await fetch(`${BASE_URL}/borrowings/admin`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');
  });

  // Test 10: Admin can list members (protected endpoint)
  await test('GET /members with admin JWT (should succeed)', async () => {
    const res = await fetch(`${BASE_URL}/members`, {
      headers: { Authorization: `Bearer ${adminToken}` },
    });
    if (!res.ok) throw new Error(`Status ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data)) throw new Error('Response is not an array');
  });

  // Test 11: User cannot list members
  await test('GET /members with user JWT (should fail 403)', async () => {
    const res = await fetch(`${BASE_URL}/members`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) throw new Error('Should have failed with 403');
    if (res.status !== 403) throw new Error(`Expected 403, got ${res.status}`);
  });

  console.log(`\n${colors.yellow}═══════════════════════════════════════════${colors.reset}`);
  console.log(`${colors.green}Auth flow tests completed!${colors.reset}`);
  console.log(`${colors.yellow}═══════════════════════════════════════════${colors.reset}\n`);
}

main().catch(err => {
  console.error(colors.red, 'Test suite failed:', err, colors.reset);
  process.exit(1);
});

/**
 * SkillSphere Automated Backend API & Security Test Suite
 * Tests authentication, authorization boundaries, CRUD operations,
 * regex character safety (e.g. C++, C#), and dashboard aggregations.
 */

const BASE_URL = process.env.TEST_API_URL || 'http://localhost:5000/api';

const runTest = async (testName, testFn) => {
  try {
    await testFn();
    console.log(`  ✓ [PASS] ${testName}`);
    return true;
  } catch (err) {
    console.error(`  ✗ [FAIL] ${testName}: ${err.message}`);
    return false;
  }
};

const assert = (condition, message) => {
  if (!condition) {
    throw new Error(message || 'Assertion failed');
  }
};

async function executeTestSuite() {
  console.log('========================================================');
  console.log('  Running SkillSphere Backend & Security Test Suite');
  console.log('========================================================\n');

  let passed = 0;
  let total = 0;

  const testEmail = `test_${Date.now()}@skillsphere.edu`;
  const testPassword = 'Password123!';
  let authToken = null;
  let createdSkillId = null;
  let createdProjectId = null;
  let createdCertId = null;

  // 1. Health Endpoint Test
  total++;
  if (
    await runTest('Health Check: GET /api/health returns 200 and connected DB', async () => {
      const res = await fetch(`${BASE_URL}/health`);
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.status === 'ok', 'Status is not ok');
      assert(data.database === 'connected', `Database state is ${data.database}`);
    })
  ) passed++;

  // 2. Unauthorized Request Test
  total++;
  if (
    await runTest('Security: Unauthenticated request to /api/skills is rejected with 401', async () => {
      const res = await fetch(`${BASE_URL}/skills`);
      assert(res.status === 401, `Expected 401 Unauthorized, got ${res.status}`);
      const data = await res.json();
      assert(data.success === false, 'Expected success: false');
    })
  ) passed++;

  // 3. Tampered Token Test
  total++;
  if (
    await runTest('Security: Malformed/Tampered token is rejected with 401', async () => {
      const res = await fetch(`${BASE_URL}/skills`, {
        headers: { Authorization: 'Bearer invalid.tampered.token' },
      });
      assert(res.status === 401, `Expected 401, got ${res.status}`);
    })
  ) passed++;

  // 4. Invalid Registration Input Tests
  total++;
  if (
    await runTest('Validation: Invalid email format in registration rejected with 400', async () => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Invalid Email User',
          email: 'not-an-email',
          password: 'Password123!',
        }),
      });
      assert(res.status === 400, `Expected 400, got ${res.status}`);
    })
  ) passed++;

  total++;
  if (
    await runTest('Validation: Short password (< 6 chars) rejected with 400', async () => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Short Password User',
          email: `short_${Date.now()}@university.edu`,
          password: '123',
        }),
      });
      assert(res.status === 400, `Expected 400, got ${res.status}`);
    })
  ) passed++;

  // 5. Valid Registration
  total++;
  if (
    await runTest('Auth: Successful registration returns 201 and JWT token', async () => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Jordan Audit Test',
          email: testEmail,
          password: testPassword,
          institution: 'Institute of Tech',
          department: 'Computer Science',
          graduationYear: '2026',
        }),
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const data = await res.json();
      assert(data.success === true, 'Registration was not successful');
      assert(Boolean(data.token), 'No JWT token returned');
      authToken = data.token;
    })
  ) passed++;

  // 6. Duplicate Email Registration
  total++;
  if (
    await runTest('Auth: Duplicate email registration rejected with 400', async () => {
      const res = await fetch(`${BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: 'Duplicate Jordan',
          email: testEmail,
          password: testPassword,
        }),
      });
      assert(res.status === 400, `Expected 400 Duplicate Key error, got ${res.status}`);
    })
  ) passed++;

  // 7. Login with Valid Credentials
  total++;
  if (
    await runTest('Auth: Login with valid credentials returns 200 and token', async () => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: testPassword,
        }),
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(Boolean(data.token), 'No token returned on login');
      authToken = data.token;
    })
  ) passed++;

  // 8. Login with Invalid Credentials
  total++;
  if (
    await runTest('Auth: Login with incorrect password returns 401', async () => {
      const res = await fetch(`${BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: testEmail,
          password: 'WrongPassword999!',
        }),
      });
      assert(res.status === 401, `Expected 401, got ${res.status}`);
    })
  ) passed++;

  const authHeaders = {
    Authorization: `Bearer ${authToken}`,
    'Content-Type': 'application/json',
  };

  // 9. Authenticated Profile Access
  total++;
  if (
    await runTest('User: GET /api/auth/me returns student profile without password', async () => {
      const res = await fetch(`${BASE_URL}/auth/me`, { headers: authHeaders });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.user.email === testEmail.toLowerCase(), 'Email mismatch');
      assert(data.user.password === undefined, 'Security violation: Password returned in payload');
    })
  ) passed++;

  // 10. Skills CRUD with Regex Character Safety Test (C++)
  total++;
  if (
    await runTest('Skills: Add skill with regex metacharacters ("C++ (Modern)") without crashing', async () => {
      const res = await fetch(`${BASE_URL}/skills`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: 'C++ (Modern)',
          category: 'Programming Languages',
          proficiencyLevel: 'Advanced',
          progress: 75,
          description: 'Testing regex safety with plus signs and parentheses',
        }),
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const data = await res.json();
      assert(data.skill.name === 'C++ (Modern)', 'Skill name mismatch');
      createdSkillId = data.skill._id;
    })
  ) passed++;

  // 11. Duplicate Skill Name Check
  total++;
  if (
    await runTest('Skills: Duplicate skill name rejection (case-insensitive)', async () => {
      const res = await fetch(`${BASE_URL}/skills`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: 'c++ (modern)',
          category: 'Programming Languages',
        }),
      });
      assert(res.status === 400, `Expected 400 for duplicate skill name, got ${res.status}`);
    })
  ) passed++;

  // 12. Quick Progress Update (PATCH)
  total++;
  if (
    await runTest('Skills: PATCH /api/skills/:id/progress updates progress and status to Completed', async () => {
      const res = await fetch(`${BASE_URL}/skills/${createdSkillId}/progress`, {
        method: 'PATCH',
        headers: authHeaders,
        body: JSON.stringify({ progress: 100 }),
      });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.skill.progress === 100, 'Progress not updated to 100');
      assert(data.skill.status === 'Completed', 'Status not auto-updated to Completed');
    })
  ) passed++;

  // 13. Projects CRUD
  total++;
  if (
    await runTest('Projects: Create project with technologies and URLs', async () => {
      const res = await fetch(`${BASE_URL}/projects`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          title: 'SkillSphere Capstone',
          description: 'Automated test project build',
          technologies: ['React', 'Node.js', 'MongoDB'],
          githubUrl: 'https://github.com/skillsphere/test',
          liveDemoUrl: 'https://demo.skillsphere.app',
          featured: true,
        }),
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const data = await res.json();
      assert(data.project.title === 'SkillSphere Capstone', 'Title mismatch');
      createdProjectId = data.project._id;
    })
  ) passed++;

  // 14. Certifications CRUD
  total++;
  if (
    await runTest('Certifications: Create certification credential', async () => {
      const res = await fetch(`${BASE_URL}/certifications`, {
        method: 'POST',
        headers: authHeaders,
        body: JSON.stringify({
          name: 'AWS Cloud Solutions Architect',
          issuingOrganization: 'Amazon Web Services',
          issueDate: '2026-01-15',
          credentialId: 'AWS-CERT-9988',
          credentialUrl: 'https://aws.amazon.com/verify',
        }),
      });
      assert(res.status === 201, `Expected 201, got ${res.status}`);
      const data = await res.json();
      assert(data.certification.name === 'AWS Cloud Solutions Architect', 'Name mismatch');
      createdCertId = data.certification._id;
    })
  ) passed++;

  // 15. Dashboard Statistics
  total++;
  if (
    await runTest('Dashboard: Aggregated statistics reflect user data accurately', async () => {
      const res = await fetch(`${BASE_URL}/dashboard/stats`, { headers: authHeaders });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.stats.totalSkills >= 1, 'Total skills count incorrect');
      assert(data.stats.totalProjects >= 1, 'Total projects count incorrect');
      assert(data.stats.totalCertifications >= 1, 'Total certs count incorrect');
    })
  ) passed++;

  // 16. Portfolio Package
  total++;
  if (
    await runTest('Portfolio: Consolidated portfolio payload contains categorized data', async () => {
      const res = await fetch(`${BASE_URL}/portfolio/me`, { headers: authHeaders });
      assert(res.status === 200, `Expected 200, got ${res.status}`);
      const data = await res.json();
      assert(data.portfolio.user.email === testEmail.toLowerCase(), 'User mismatch');
      assert(Array.isArray(data.portfolio.skills), 'Skills array missing');
      assert(Array.isArray(data.portfolio.projects), 'Projects array missing');
    })
  ) passed++;

  // 17. Clean up test records
  total++;
  if (
    await runTest('Cleanup: Delete created skill, project, and certification', async () => {
      if (createdSkillId) {
        const res = await fetch(`${BASE_URL}/skills/${createdSkillId}`, {
          method: 'DELETE',
          headers: authHeaders,
        });
        assert(res.status === 200, 'Skill deletion failed');
      }
      if (createdProjectId) {
        const res = await fetch(`${BASE_URL}/projects/${createdProjectId}`, {
          method: 'DELETE',
          headers: authHeaders,
        });
        assert(res.status === 200, 'Project deletion failed');
      }
      if (createdCertId) {
        const res = await fetch(`${BASE_URL}/certifications/${createdCertId}`, {
          method: 'DELETE',
          headers: authHeaders,
        });
        assert(res.status === 200, 'Cert deletion failed');
      }
    })
  ) passed++;

  console.log('\n--------------------------------------------------------');
  console.log(`  Tests Passed: ${passed} / ${total}`);
  console.log('--------------------------------------------------------\n');

  if (passed === total) {
    console.log('🎉 ALL AUTOMATED API & SECURITY TESTS PASSED SUCCESSFULLY!\n');
    process.exit(0);
  } else {
    console.error('❌ SOME TESTS FAILED!\n');
    process.exit(1);
  }
}

executeTestSuite().catch((err) => {
  console.error('Test Suite Fatal Error:', err);
  process.exit(1);
});

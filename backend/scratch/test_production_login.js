async function runTest() {
  const BASE_URL = 'http://localhost:5000/api/v1';
  const email = 'test.user.argendar.84574@gmail.com';
  const password = 'Password123!';

  console.log("=== STARTING PRODUCTION LOGIN & PROFILE GET TEST ===");
  console.log(`Email: ${email}`);

  try {
    // 1. Iniciar sesión
    console.log("\n1. Testing POST /auth/login...");
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const loginData = await loginRes.json();
    console.log(`Status: ${loginRes.status}`);
    console.log("Response:", JSON.stringify(loginData, null, 2));

    if (loginRes.status !== 200 || !loginData.accessToken) {
      throw new Error("Login failed or accessToken is missing from response root");
    }

    const token = loginData.accessToken;

    // 2. Obtener perfil del usuario actual (Me)
    console.log("\n2. Testing GET /auth/me with Bearer JWT...");
    const meRes = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    const meData = await meRes.json();
    console.log(`Status: ${meRes.status}`);
    console.log("Response:", JSON.stringify(meData, null, 2));

    if (meRes.status !== 200) {
      throw new Error("GET /auth/me failed");
    }

    console.log("\n=== PRODUCTION AUTH TESTS PASSED SUCCESSFULLY! ===");
  } catch (err) {
    console.error("\n❌ TEST FAILED:", err.message || err);
    process.exit(1);
  }
}

runTest();

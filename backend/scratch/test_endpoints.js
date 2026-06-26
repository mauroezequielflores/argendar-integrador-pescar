import dotenv from 'dotenv';
dotenv.config();

const PORT = process.env.TEST_PORT || 5001;
const BASE_URL = `http://localhost:${PORT}/api/v1`;

async function testEndpoints() {
  console.log("=== STARTING AUTH ENDPOINTS INTEGRATION TEST ===");
  const testEmail = `integration.test.${Math.floor(Math.random() * 1000000)}@gmail.com`;
  const testPassword = "IntegrationPassword123!";
  const testNombre = "Juan";
  const testApellido = "Pérez";
  let token = null;

  try {
    // 1. Test Registro Exitoso
    console.log(`\n1. Testing POST /auth/register with email: ${testEmail}`);
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: testNombre,
        apellido: testApellido,
        email: testEmail,
        password: testPassword
      })
    });
    
    const regData = await regRes.json();
    console.log(`Status: ${regRes.status}`);
    console.log("Response:", JSON.stringify(regData, null, 2));

    if (regRes.status !== 201) {
      throw new Error("Register failed");
    }

    // 2. Test Registro Duplicado
    console.log(`\n2. Testing POST /auth/register for duplicate email`);
    const dupRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: testNombre,
        apellido: testApellido,
        email: testEmail,
        password: testPassword
      })
    });
    const dupData = await dupRes.json();
    console.log(`Status: ${dupRes.status}`);
    console.log("Response:", JSON.stringify(dupData, null, 2));
    if (dupRes.status !== 400) {
      throw new Error("Duplicate check failed, should have returned 400");
    }

    // 3. Test Registro Validación Fallida (Falta contraseña)
    console.log(`\n3. Testing POST /auth/register with missing password`);
    const valRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: testNombre,
        apellido: testApellido,
        email: testEmail
      })
    });
    const valData = await valRes.json();
    console.log(`Status: ${valRes.status}`);
    console.log("Response:", JSON.stringify(valData, null, 2));
    if (valRes.status !== 400) {
      throw new Error("Validation check failed, should have returned 400");
    }

    // 4. Test Login Exitoso
    console.log(`\n4. Testing POST /auth/login with correct credentials`);
    const loginRes = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: testEmail,
        password: testPassword
      })
    });
    const loginData = await loginRes.json();
    console.log(`Status: ${loginRes.status}`);
    console.log("Response (truncated session):", {
      status: loginData.status,
      message: loginData.message,
      user: loginData.data?.user,
      hasToken: !!loginData.data?.session?.accessToken
    });
    if (loginRes.status !== 200 || !loginData.data?.session?.accessToken) {
      throw new Error("Login failed");
    }
    token = loginData.data.session.accessToken;

    // 5. Test GET /auth/me con Token Válido
    console.log(`\n5. Testing GET /auth/me with valid Bearer Token`);
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
      throw new Error("Fetching self profile failed");
    }

    // 6. Test GET /auth/me con Token Inválido
    console.log(`\n6. Testing GET /auth/me with invalid token`);
    const badMeRes = await fetch(`${BASE_URL}/auth/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer invalid-token-12345`
      }
    });
    const badMeData = await badMeRes.json();
    console.log(`Status: ${badMeRes.status}`);
    console.log("Response:", JSON.stringify(badMeData, null, 2));
    if (badMeRes.status !== 401) {
      throw new Error("Invalid token check failed, should have returned 401");
    }

    console.log("\n=== ALL AUTH INTEGRATION TESTS PASSED SUCCESSFULLY! ===");
  } catch (error) {
    console.error("\n❌ TEST FAILED:", error.message || error);
    process.exit(1);
  }
}

testEndpoints();

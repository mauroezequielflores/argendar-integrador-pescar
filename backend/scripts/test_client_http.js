async function test() {
  const email = "cliente@gmail.com";
  const password = "password123";

  // Login
  const loginRes = await fetch('http://localhost:5173/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!loginRes.ok) {
    console.error("Login failed:", await loginRes.text());
    return;
  }
  
  const loginData = await loginRes.json();
  const token = loginData.session.access_token;
  
  // Get requests
  const reqsRes = await fetch('http://localhost:5173/api/v1/client/requests', {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!reqsRes.ok) {
    console.error("Requests failed:", await reqsRes.text());
    return;
  }
  
  const reqsData = await reqsRes.json();
  console.log("Number of requests:", reqsData.length);
  for (const r of reqsData) {
    console.log(`Request ID: ${r.id}, Title: ${r.title}, Status: ${r.status}, Offers count: ${r.offers ? r.offers.length : 'undefined'}`);
  }
}

test();

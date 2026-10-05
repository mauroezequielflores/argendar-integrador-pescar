async function test() {
  const email = "luciagonzales@gmail.com";
  const password = "password123";

  const loginRes = await fetch('http://localhost:5173/api/v1/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });
  
  if (!loginRes.ok) {
    console.error("Login failed:", await loginRes.text());
    return;
  }
  
  const { session } = await loginRes.json();
  const token = session.access_token;
  
  const requestId = '23c367ff-c5ae-4bc4-b057-bd6e343f975d';
  console.log(`Fetching offers for request: ${requestId}`);
  const offersRes = await fetch(`http://localhost:5173/api/v1/job-requests/${requestId}/offers`, {
    headers: { 'Authorization': `Bearer ${token}` }
  });
  
  if (!offersRes.ok) {
    console.error("Offers failed:", await offersRes.text());
    return;
  }
  
  const offers = await offersRes.json();
  console.log(JSON.stringify(offers, null, 2));
}

test();

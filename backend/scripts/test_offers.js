import { supabase } from '../src/config/supabase.js';

async function test() {
  console.log("Checking last 5 offers created...");
  const { data: offers, error: offersError } = await supabase
    .from('offers')
    .select('id, request_id, professional_id, status, created_at')
    .order('created_at', { ascending: false })
    .limit(5);

  if (offersError) {
    console.error("Error fetching offers:", offersError);
    return;
  }
  
  console.log(JSON.stringify(offers, null, 2));

  console.log("\nChecking last 5 requests...");
  const { data: requests, error: requestsError } = await supabase
    .from('requests')
    .select('id, client_id, title, status, offers(id, status)')
    .order('created_at', { ascending: false })
    .limit(5);

  if (requestsError) {
    console.error("Error fetching requests:", requestsError);
    return;
  }
  
  console.log(JSON.stringify(requests, null, 2));
}

test();

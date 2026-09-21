import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
dotenv.config({ path: './.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  realtime: { transport: ws }
});

async function test() {
  const { data: requests, error } = await supabase
    .from('requests')
    .select(`
      id,
      title,
      description,
      status,
      client_id,
      offers(id, status)
    `);

  if (error) {
    console.error("Error:", error);
  } else {
    console.log("Requests count:", requests.length);
    requests.forEach(r => {
      console.log(`- Request: ${r.title} | Status: ${r.status} | Client: ${r.client_id} | Offers count: ${r.offers ? r.offers.length : 'undefined/null'}`);
    });
  }
}
test();

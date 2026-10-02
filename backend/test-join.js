import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
dotenv.config({ path: './.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  realtime: { transport: ws }
});

async function test() {
  const { data: offers, error } = await supabase
    .from('offers')
    .select(`
      id,
      amount,
      proposed_deposit,
      proposed_date,
      proposed_time,
      message,
      status,
      created_at,
      professional:profiles!professional_id (
        id,
        first_name,
        last_name,
        avatar_url,
        professional_profiles (
          rating_avg,
          reviews_count
        )
      )
    `)
    .limit(5);

  console.log("Error:", error);
  console.log("Offers count:", offers ? offers.length : 0);
  console.log("Data:", JSON.stringify(offers, null, 2));
  
}
test();

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://srelrezggpbujrrkffth.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNyZWxyZXpnZ3BidWpycmtmZnRoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4ODY0MTY2MSwiZXhwIjoyMTA0MjE3NjYxfQ.NhWqJBSi0CI9nuJaemrzndbzlSuzTA41AH13BGDaleU';

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false
  }
});

async function run() {
  const { data, count, error } = await supabase.rpc('get_marketplace_requests', {
    p_professional_id: '00000000-0000-0000-0000-000000000000',
    p_limit: 20,
    p_offset: 0,
    p_search: null,
    p_categories: null
  }, { count: 'exact' });

  if (error) {
    console.error('RPC Error:', error);
  } else {
    console.log('RPC Success:', data);
  }
}

run();

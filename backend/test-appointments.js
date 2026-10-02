import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';
import ws from 'ws';
dotenv.config({ path: './.env' });

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  realtime: { transport: ws }
});

async function test() {
  const { data, error } = await supabase.from('appointments').select('*');
  console.log("Appointments error:", error);
  console.log("Appointments:", data);
  
  const { data: reqs, error: rError } = await supabase.from('requests').select('id, status, title');
  console.log("Requests:", reqs);
}

test();

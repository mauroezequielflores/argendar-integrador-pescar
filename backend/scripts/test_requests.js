import { supabase } from '../src/config/supabase.js';

async function test() {
  const { data, error } = await supabase
    .from('requests')
    .select(`
      id,
      title,
      status,
      offers:offers(id, status)
    `)
    .limit(5);

  if (error) {
    console.error("Error:", error);
    return;
  }
  console.log(JSON.stringify(data, null, 2));
}

test();

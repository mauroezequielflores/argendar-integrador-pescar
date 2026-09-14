import { supabase } from './src/config/supabase.js';
async function run() {
  const { data, error } = await supabase.from('profiles').select('*').eq('id', 'd7701832-26b6-46dd-869a-6cebaccfda47');
  console.log('Profile:', data);
  if (error) console.error(error);
}
run();

import { supabase } from '../src/config/supabase.js';
import dotenv from 'dotenv';
dotenv.config();

async function test() {
  const { data: users, error } = await supabase.auth.admin.listUsers();
  if (error) {
    console.error("Error fetching users:", error);
    return;
  }
  
  for (const u of users.users) {
    console.log(`User: ${u.email}, ID: ${u.id}`);
  }
}

test();

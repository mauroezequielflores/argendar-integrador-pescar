import { supabase } from '../config/supabase.js';

async function run() {
  try {
    const { data: userList, error: userError } = await supabase
      .from('usuarios')
      .select('*')
      .limit(5);
    
    console.log("Query 'usuarios' table results:");
    if (userError) {
      console.error("Error fetching usuarios:", userError);
    } else {
      console.log("Data:", userList);
    }

    // Let's also check if there is a turnos table
    const { data: turnoList, error: turnoError } = await supabase
      .from('turnos')
      .select('*')
      .limit(5);

    console.log("Query 'turnos' table results:");
    if (turnoError) {
      console.error("Error fetching turnos:", turnoError);
    } else {
      console.log("Data:", turnoList);
    }

  } catch (err) {
    console.error("System error:", err);
  }
}

run();

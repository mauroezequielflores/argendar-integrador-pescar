import { supabase } from '../config/supabase.js';

async function testSignup() {
  const email = `test.user.argendar.${Math.floor(Math.random() * 100000)}@gmail.com`;
  const password = "Password123!";
  const nombre = "TestNombre";
  const apellido = "TestApellido";

  console.log(`Attempting to sign up user: ${email}`);

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        nombre,
        apellido
      }
    }
  });

  if (error) {
    console.error("SignUp error:", error);
    return;
  }

  console.log("SignUp successful! User ID:", data.user?.id);
  console.log("User email confirmation status:", data.user?.email_confirmed_at);

  // Wait 2 seconds to let any async trigger execute
  await new Promise(resolve => setTimeout(resolve, 2000));

  console.log("Checking public.usuarios table...");
  const { data: publicUsers, error: selectError } = await supabase
    .from('usuarios')
    .select('*')
    .eq('email', email);

  if (selectError) {
    console.error("Error querying public.usuarios:", selectError);
  } else {
    console.log("Found in public.usuarios:", publicUsers);
  }
}

testSignup();

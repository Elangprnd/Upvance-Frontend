require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

async function checkMetadata() {
  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@upvance.com', // wait, I need the actual user's email if possible
    password: 'password123'
  });

  // Instead of logging in as them, maybe we can use the service_role key to inspect users?
  // But we only have anon key in .env.local
}

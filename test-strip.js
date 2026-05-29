require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function run() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("Missing env vars");
    return;
  }

  // 1. Login to get a real session
  const supabase = createClient(supabaseUrl, supabaseKey);
  const { data, error } = await supabase.auth.signInWithPassword({
    email: 'test@upvance.com',
    password: 'password123'
  });

  if (error) {
    console.error("Login failed:", error.message);
    return;
  }

  const fullSession = data.session;
  console.log("Original session JSON length:", JSON.stringify(fullSession).length);

  // 2. Strip the user object
  const strippedSession = {
    access_token: fullSession.access_token,
    refresh_token: fullSession.refresh_token,
    expires_at: fullSession.expires_at,
    expires_in: fullSession.expires_in,
    token_type: fullSession.token_type,
    // Provide a minimal user object so TS/client doesn't crash if it expects it
    user: {
      id: fullSession.user.id,
      aud: fullSession.user.aud,
      role: fullSession.user.role,
      email: fullSession.user.email,
      app_metadata: {},
      user_metadata: {},
    }
  };

  console.log("Stripped session JSON length:", JSON.stringify(strippedSession).length);

  // 3. Create a new client and test if it works with the stripped session!
  const supabase2 = createClient(supabaseUrl, supabaseKey);
  
  const { error: setErr } = await supabase2.auth.setSession({
    access_token: strippedSession.access_token,
    refresh_token: strippedSession.refresh_token,
  });

  if (setErr) {
    console.error("Failed to set stripped session:", setErr);
  } else {
    console.log("Successfully set stripped session!");
    const { data: { user } } = await supabase2.auth.getUser();
    console.log("Recovered user from stripped session:", user ? user.email : "null");
    
    // Check if user_metadata is recovered from the JWT!
    console.log("Recovered user_metadata:", user.user_metadata);
  }
}

run();

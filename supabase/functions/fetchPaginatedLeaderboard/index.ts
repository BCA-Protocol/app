// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />
import { createClient } from 'https://esm.sh/@supabase/supabase-js'

function obfuscateEmail(email) {
  if (email === undefined || email === null) {
    return "n/a";
  }
  const parts = email.split("@");
  let localPart = parts[0];
  if (localPart.length > 2) {
    localPart =
      localPart[0] +
      "*".repeat(localPart.length - 2) +
      localPart[localPart.length - 1];
  }
  let domainPart = parts[1];
  const domainParts = domainPart.split(".");
  let mainDomain = domainParts[0];
  if (mainDomain.length > 2) {
    mainDomain =
      mainDomain[0] +
      "*".repeat(mainDomain.length - 2) +
      mainDomain[mainDomain.length - 1];
  }
  domainPart = [mainDomain, ...domainParts.slice(1)].join(".");
  return localPart + "@" + domainPart;
}

Deno.serve(async (req) => {
  // const { lastOverallPoints,lastCreated } = await req.json()
  // const data = {
  //   message: `Hello ${name}!`,
  // }

  // return new Response(
  //   JSON.stringify(data),
  //   { headers: { "Content-Type": "application/json" } },
  // )
  try {
    const { from,to } = await req.json()
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
    )

    const { data, error, count } = await supabase.from('users')
    .select('*',{count:'exact'}).order('overall_points', { ascending: false })
    .order('created_at', { ascending: true })
    .range(0, 2)

    const users = [];
    data.forEach((user:any) => {
      const { id, email, display_name,total_points,referral_points, overall_points, created_at } = user
      const hiddenEmail = obfuscateEmail(email);
      users.push({
        id,
        email: hiddenEmail,
        display_name,
        total_points,
        overall_points,
        referral_points,
        created_at,
      });
    })

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ 
      users, 
      count: count
    }), {
      headers: { 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (err) {
    return new Response(String(err?.message ?? err), { status: 500 })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/fetchPaginatedLeaderboard' \
    --header 'Authorization: Bearer ' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/

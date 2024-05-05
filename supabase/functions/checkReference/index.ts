// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
/// <reference types="https://esm.sh/@supabase/functions-js/src/edge-runtime.d.ts" />

import { createClient } from 'https://esm.sh/@supabase/supabase-js'

Deno.serve(async (req) => {

  try {
  const { referenceId } = await req.json()
  const supabase = createClient(
    Deno.env.get('SUPABASE_URL') ?? '',
    Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    { global: { headers: { Authorization: req.headers.get('Authorization')! } } }
  )
  const { data, error }  = await supabase.from('users').select().eq('id', referenceId).maybeSingle();

  if (error) {
    throw error
  }

  return new Response(JSON.stringify({ 
    data, 
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

  curl -i --location --request POST 'https://onmkwytrhfghwfilzbrt.supabase.co/functions/v1/checkReference' \
    --header 'Content-Type: application/json' \
    --data '{"referenceId":"6ae71fb3-7358-4b34-ac81-0a9723df0318"}'

*/

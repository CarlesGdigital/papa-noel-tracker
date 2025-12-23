import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query } = await req.json();
    
    if (!query || typeof query !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Query parameter is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const normalizedQuery = query.trim().toLowerCase();
    console.log(`Geocoding query: ${normalizedQuery}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Check cache first (48 hours = 172800 seconds)
    const cacheThreshold = new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString();
    const { data: cachedResult } = await supabase
      .from('geocode_cache')
      .select('result_json, updated_at')
      .eq('query', normalizedQuery)
      .gte('updated_at', cacheThreshold)
      .single();

    if (cachedResult) {
      console.log('Cache hit for:', normalizedQuery);
      return new Response(
        JSON.stringify(cachedResult.result_json),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Cache miss, querying Nominatim...');

    // Query Nominatim
    const nominatimUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=5&addressdetails=1`;
    
    const nominatimResponse = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'LobaBall-SantaTracker/1.0 (https://lovable.dev)',
        'Accept-Language': 'es,en',
      },
    });

    if (!nominatimResponse.ok) {
      throw new Error(`Nominatim error: ${nominatimResponse.status}`);
    }

    const nominatimData = await nominatimResponse.json();
    console.log(`Nominatim returned ${nominatimData.length} results`);

    // Format results
    const results = nominatimData.map((item: any) => ({
      display_name: item.display_name,
      lat: parseFloat(item.lat),
      lon: parseFloat(item.lon),
      type: item.type,
      address: item.address,
    }));

    // Cache the result
    await supabase
      .from('geocode_cache')
      .upsert({
        query: normalizedQuery,
        result_json: results,
        updated_at: new Date().toISOString(),
      }, { onConflict: 'query' });

    return new Response(
      JSON.stringify(results),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Geocoding error:', error);
    return new Response(
      JSON.stringify({ error: 'Failed to geocode location' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});

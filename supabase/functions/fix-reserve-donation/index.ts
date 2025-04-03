
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

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
    // Get the request body
    const { donation_id, ngo_id } = await req.json();

    // Validate inputs
    if (!donation_id || !ngo_id) {
      return new Response(
        JSON.stringify({ success: false, message: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with Deno runtime
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First check if donation exists and is available
    const { data: donationCheck, error: checkError } = await supabase
      .from('donations')
      .select('status')
      .eq('id', donation_id)
      .single();

    if (checkError) {
      console.error("Error checking donation status:", checkError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to verify donation status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!donationCheck || donationCheck.status !== 'available') {
      return new Response(
        JSON.stringify({ success: false, message: "Donation is not available for reservation" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Try using the RPC function as the primary approach (most reliable)
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'reserve_donation', 
      { 
        donation_id: donation_id,
        ngo_id: ngo_id
      }
    );
    
    if (rpcError) {
      console.error("Error with RPC call:", rpcError);
      
      // If RPC fails, try direct update as fallback
      const { error: directUpdateError } = await supabase
        .from('donations')
        .update({
          status: 'pending',
          reserved_by: ngo_id,
          reserved_at: new Date().toISOString()
        })
        .eq('id', donation_id)
        .eq('status', 'available');
        
      if (directUpdateError) {
        console.error("Both RPC and direct update failed:", directUpdateError);
        return new Response(
          JSON.stringify({ success: false, message: "Failed to reserve donation: " + rpcError.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
    }

    // Create notification for the donor (even if we used direct update)
    const { data: donation } = await supabase
      .from('donations')
      .select('donor_id, food_name')
      .eq('id', donation_id)
      .single();

    if (donation) {
      // Insert notification
      await supabase.from('notifications').insert({
        user_id: donation.donor_id,
        title: 'Donation Reserved',
        message: `Your donation "${donation.food_name}" has been reserved by an NGO.`,
        related_to: 'donation',
        related_id: donation_id
      });
    }

    return new Response(
      JSON.stringify({ success: true, message: "Donation reserved successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Exception in edge function:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error: " + error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

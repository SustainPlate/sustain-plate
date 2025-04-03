
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
    
    if (!supabaseUrl || !supabaseServiceKey) {
      return new Response(
        JSON.stringify({ success: false, message: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
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

    // First try using the RPC function
    console.log("Attempting reservation using RPC function");
    const { data: rpcResult, error: rpcError } = await supabase.rpc(
      'reserve_donation',
      { 
        donation_id: donation_id,
        ngo_id: ngo_id
      }
    );

    // If RPC fails, we'll try direct update as fallback
    if (rpcError) {
      console.error("RPC reservation failed:", rpcError);
      
      // Query the database to get valid status values
      const { data: statusData, error: statusError } = await supabase.query(`
        SELECT enum_range(NULL::public.donation_status) as valid_statuses;
      `);
      
      if (statusError) {
        console.error("Failed to query valid statuses:", statusError);
      } else {
        console.log("Valid status values:", statusData);
      }
      
      // Try direct update with 'pending' status
      console.log("Attempting direct update as fallback");
      const { error: directUpdateError } = await supabase
        .from('donations')
        .update({
          status: 'pending', // This must match a valid enum value in the database
          reserved_by: ngo_id,
          reserved_at: new Date().toISOString()
        })
        .eq('id', donation_id)
        .eq('status', 'available');
      
      if (directUpdateError) {
        console.error("Direct update failed:", directUpdateError);
        
        // If direct update with 'pending' fails, try with 'reserved' status
        const { error: fallbackUpdateError } = await supabase
          .from('donations')
          .update({
            status: 'reserved', // Try alternative valid status
            reserved_by: ngo_id,
            reserved_at: new Date().toISOString()
          })
          .eq('id', donation_id)
          .eq('status', 'available');
        
        if (fallbackUpdateError) {
          console.error("Fallback update also failed:", fallbackUpdateError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: "Failed to reserve donation. Please try again later.",
              error: directUpdateError.message,
              fallbackError: fallbackUpdateError.message
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        }
      }
    }

    // Create notification for the donor
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

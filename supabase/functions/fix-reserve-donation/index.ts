
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
    const requestData = await req.json();
    const { donation_id, ngo_id } = requestData;

    console.log("Request received:", { donation_id, ngo_id });

    // Validate inputs
    if (!donation_id || !ngo_id) {
      console.error("Missing required parameters:", { donation_id, ngo_id });
      return new Response(
        JSON.stringify({ success: false, message: "Missing required parameters" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Initialize Supabase client with Deno runtime
    const supabaseUrl = Deno.env.get("SUPABASE_URL") || "";
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error("Missing Supabase configuration");
      return new Response(
        JSON.stringify({ success: false, message: "Server configuration error" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // First check if donation exists and is available
    console.log("Checking donation status...");
    const { data: donationCheck, error: checkError } = await supabase
      .from('donations')
      .select('status, food_name')
      .eq('id', donation_id)
      .single();

    if (checkError) {
      console.error("Error checking donation status:", checkError);
      return new Response(
        JSON.stringify({ success: false, message: "Failed to verify donation status" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (!donationCheck) {
      console.error("Donation not found");
      return new Response(
        JSON.stringify({ success: false, message: "Donation not found" }),
        { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    if (donationCheck.status !== 'available') {
      console.error("Donation not available:", donationCheck);
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: `Donation "${donationCheck.food_name}" is not available for reservation (current status: ${donationCheck.status})` 
        }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // First try using the RPC function
    console.log("Attempting reservation using RPC function");
    let reservationSuccessful = false;
    let reservationError = null;

    try {
      const { data: rpcResult, error: rpcError } = await supabase.rpc(
        'reserve_donation',
        { 
          donation_id: donation_id,
          ngo_id: ngo_id
        }
      );

      if (rpcError) {
        console.error("RPC reservation failed:", rpcError);
        reservationError = rpcError;
      } else if (rpcResult === true) {
        console.log("RPC reservation succeeded");
        reservationSuccessful = true;
      } else {
        console.log("RPC returned false, donation may not be available");
        reservationError = new Error("RPC function indicated reservation failed");
      }
    } catch (error) {
      console.error("Exception during RPC call:", error);
      reservationError = error;
    }

    // If RPC fails, we'll try direct update as fallback
    if (!reservationSuccessful) {
      console.log("RPC failed, attempting direct update fallback...");
      
      // Try direct update with 'pending' status first
      const { error: directUpdateError } = await supabase
        .from('donations')
        .update({
          status: 'pending',
          reserved_by: ngo_id,
          reserved_at: new Date().toISOString()
        })
        .eq('id', donation_id)
        .eq('status', 'available')
        .select();
      
      if (directUpdateError) {
        console.error("Direct update with 'pending' failed:", directUpdateError);
        
        // If direct update with 'pending' fails, try with 'reserved' status
        const { error: fallbackUpdateError } = await supabase
          .from('donations')
          .update({
            status: 'reserved',
            reserved_by: ngo_id,
            reserved_at: new Date().toISOString()
          })
          .eq('id', donation_id)
          .eq('status', 'available')
          .select();
        
        if (fallbackUpdateError) {
          console.error("Fallback update with 'reserved' also failed:", fallbackUpdateError);
          return new Response(
            JSON.stringify({ 
              success: false, 
              message: "Failed to reserve donation. Please try again later.",
              error: directUpdateError.message,
              fallbackError: fallbackUpdateError.message,
              originalError: reservationError?.message || "Unknown RPC error"
            }),
            { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
          );
        } else {
          console.log("Fallback update with 'reserved' succeeded");
          reservationSuccessful = true;
        }
      } else {
        console.log("Direct update with 'pending' succeeded");
        reservationSuccessful = true;
      }
    }

    if (!reservationSuccessful) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          message: "All reservation attempts failed" 
        }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Create notification for the donor
    console.log("Creating notification for the donor");
    try {
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
        console.log("Notification created for donor", donation.donor_id);
      }
    } catch (notificationError) {
      // Don't fail the reservation if notification creation fails
      console.error("Error creating notification:", notificationError);
    }

    return new Response(
      JSON.stringify({ success: true, message: "Donation reserved successfully" }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    console.error("Unhandled exception in edge function:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Internal server error: " + error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

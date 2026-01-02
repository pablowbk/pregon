import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

export async function GET() {
  // Check Supabase connection via REST API health check
  let supabaseConnected = false;
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY;

  if (supabaseUrl && supabaseKey) {
    try {
      const supabase = await createClient();
      // Any response with a status means Supabase is reachable
      // We use from() with a non-existent table - a 404 still proves connectivity
      const response = await supabase
        .from("_health_check")
        .select("*")
        .limit(1);
      // Status exists = we got a response from Supabase = connected
      supabaseConnected = response.status !== undefined;
      console.log("supabase check:", response);
    } catch (error) {
      console.log(
        "supabase error:",
        error instanceof Error ? error.message : error
      );
      supabaseConnected = false;
    }
  } else {
    console.log(
      "supabase error: Missing NEXT_PUBLIC_SUPABASE_URL or NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY"
    );
  }

  // Check WhatsApp by verifying the phone number ID with the API
  let whatsappConnected = false;
  const phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID;
  const accessToken = process.env.WHATSAPP_ACCESS_TOKEN;

  if (phoneNumberId && accessToken) {
    try {
      const response = await fetch(
        `${WHATSAPP_API_URL}/${phoneNumberId}?fields=verified_name,display_phone_number`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      console.log("whatsapp check:", await response.json());
      whatsappConnected = response.ok;
    } catch {
      whatsappConnected = false;
    }
  }

  return NextResponse.json({
    supabase: supabaseConnected,
    whatsapp: whatsappConnected,
  });
}

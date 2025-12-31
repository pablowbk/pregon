import { NextResponse } from "next/server";

export async function GET() {
  // Check Supabase connection
  const supabaseConfigured = Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );

  // Check WhatsApp configuration
  const whatsappConfigured = Boolean(
    process.env.WHATSAPP_PHONE_NUMBER_ID && process.env.WHATSAPP_ACCESS_TOKEN
  );

  return NextResponse.json({
    supabase: supabaseConfigured,
    whatsapp: whatsappConfigured,
  });
}

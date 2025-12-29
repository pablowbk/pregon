import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";

/**
 * WhatsApp Webhook - Verificación (GET)
 * Meta envía una solicitud GET para verificar el webhook
 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  const mode = searchParams.get("hub.mode");
  const token = searchParams.get("hub.verify_token");
  const challenge = searchParams.get("hub.challenge");

  // Verificar el token
  if (mode === "subscribe" && token === process.env.WHATSAPP_VERIFY_TOKEN) {
    console.log("✅ Webhook verificado correctamente");
    return new NextResponse(challenge, { status: 200 });
  }

  console.warn("❌ Verificación de webhook fallida");
  return new NextResponse("Forbidden", { status: 403 });
}

/**
 * WhatsApp Webhook - Recibir eventos (POST)
 * Meta envía notificaciones de mensajes y estados aquí
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Log para debugging (remover en producción)
    console.log("📩 Webhook recibido:", JSON.stringify(body, null, 2));

    // Procesar cada entrada
    const entries = body.entry || [];

    for (const entry of entries) {
      const changes = entry.changes || [];

      for (const change of changes) {
        if (change.field !== "messages") continue;

        const value = change.value;

        // Procesar mensajes entrantes (suscripciones)
        if (value.messages) {
          await handleIncomingMessages(value);
        }

        // Procesar actualizaciones de estado
        if (value.statuses) {
          await handleStatusUpdates(value.statuses);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing webhook:", error);
    return NextResponse.json({ success: true }); // Siempre responder 200 a Meta
  }
}

/**
 * Procesa mensajes entrantes
 * Por ejemplo: cuando alguien envía "ALTA" para suscribirse
 */
async function handleIncomingMessages(value: {
  metadata: { phone_number_id: string };
  messages: Array<{
    from: string;
    type: string;
    text?: { body: string };
    timestamp: string;
  }>;
  contacts?: Array<{ profile: { name: string }; wa_id: string }>;
}) {
  const supabase = createAdminClient();

  for (const message of value.messages) {
    if (message.type !== "text") continue;

    const phone = message.from;
    const text = message.text?.body?.trim().toUpperCase() || "";
    const contactName = value.contacts?.find((c) => c.wa_id === phone)?.profile?.name;

    // Comandos de suscripción
    if (text === "ALTA" || text === "SUSCRIBIR" || text === "HOLA") {
      // Registrar nuevo suscriptor
      const { error } = await supabase.from("suscriptores").upsert(
        {
          telefono: phone,
          nombre: contactName || null,
          activo: true,
        },
        { onConflict: "telefono" }
      );

      if (!error) {
        console.log(`✅ Nuevo suscriptor: ${phone} (${contactName || "sin nombre"})`);
      }
    }

    // Comando de baja
    if (text === "BAJA" || text === "DESUSCRIBIR" || text === "SALIR") {
      const { error } = await supabase
        .from("suscriptores")
        .update({ activo: false })
        .eq("telefono", phone);

      if (!error) {
        console.log(`👋 Suscriptor dado de baja: ${phone}`);
      }
    }
  }
}

/**
 * Procesa actualizaciones de estado de mensajes
 */
async function handleStatusUpdates(
  statuses: Array<{
    id: string;
    status: "sent" | "delivered" | "read" | "failed";
    timestamp: string;
    recipient_id: string;
    errors?: Array<{ code: number; title: string }>;
  }>
) {
  const supabase = createAdminClient();

  for (const status of statuses) {
    // Mapear estados de WhatsApp a nuestros estados
    const estadoMap: Record<string, string> = {
      sent: "enviado",
      delivered: "entregado",
      read: "leido",
      failed: "fallido",
    };

    const estado = estadoMap[status.status] || "enviado";

    // Actualizar registro de envío si existe
    await supabase
      .from("registro_envios")
      .update({
        estado,
        whatsapp_status: status.status,
        error_mensaje: status.errors?.[0]?.title,
      })
      .eq("whatsapp_status", status.id);
  }
}


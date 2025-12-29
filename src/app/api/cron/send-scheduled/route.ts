import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getWhatsAppClient } from "@/lib/whatsapp/client";

/**
 * Cron job para enviar mensajes programados
 * Este endpoint debe llamarse periódicamente (cada minuto idealmente)
 * 
 * En Vercel, configurar en vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/cron/send-scheduled",
 *     "schedule": "* * * * *"
 *   }]
 * }
 */
export async function GET(request: Request) {
  // Verificar el secret para proteger el endpoint
  const authHeader = request.headers.get("authorization");
  const cronSecret = process.env.CRON_SECRET;

  // En desarrollo, permitir sin secret
  if (process.env.NODE_ENV === "production" && cronSecret) {
    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
  }

  try {
    const supabase = createAdminClient();
    const now = new Date().toISOString();

    // Buscar mensajes programados que ya deberían enviarse
    const { data: mensajesPendientes, error: fetchError } = await supabase
      .from("mensajes")
      .select("*")
      .eq("estado", "programado")
      .lte("programado_para", now)
      .order("programado_para", { ascending: true })
      .limit(10); // Procesar de a 10 para no sobrecargar

    if (fetchError) {
      console.error("Error fetching scheduled messages:", fetchError);
      return NextResponse.json({ error: fetchError.message }, { status: 500 });
    }

    if (!mensajesPendientes || mensajesPendientes.length === 0) {
      return NextResponse.json({ message: "No hay mensajes pendientes", processed: 0 });
    }

    const whatsapp = getWhatsAppClient();
    const results = [];

    for (const mensaje of mensajesPendientes) {
      try {
        // Obtener suscriptores activos
        const { data: suscriptores } = await supabase
          .from("suscriptores")
          .select("id, telefono")
          .eq("activo", true);

        if (!suscriptores || suscriptores.length === 0) {
          // Marcar como enviado aunque no haya suscriptores
          await supabase
            .from("mensajes")
            .update({ estado: "enviado", enviado_en: now })
            .eq("id", mensaje.id);

          results.push({
            id: mensaje.id,
            status: "sent",
            recipients: 0,
          });
          continue;
        }

        // Enviar a todos los suscriptores
        if (whatsapp.isConfigured()) {
          const phones = suscriptores.map((s) => s.telefono);
          const sendResults = await whatsapp.sendBulkMessages(phones, mensaje.contenido);

          // Registrar los envíos
          const registros = suscriptores.map((sub) => ({
            mensaje_id: mensaje.id,
            suscriptor_id: sub.id,
            estado: sendResults.success.includes(sub.telefono) ? "enviado" : "fallido",
            error_mensaje: sendResults.failed.find((f) => f.phone === sub.telefono)?.error || null,
          }));

          await supabase.from("registro_envios").insert(registros);

          results.push({
            id: mensaje.id,
            status: "sent",
            recipients: sendResults.success.length,
            failed: sendResults.failed.length,
          });
        } else {
          results.push({
            id: mensaje.id,
            status: "skipped",
            reason: "WhatsApp not configured",
          });
        }

        // Actualizar estado del mensaje
        await supabase
          .from("mensajes")
          .update({ estado: "enviado", enviado_en: now })
          .eq("id", mensaje.id);

        // Manejar recurrencia
        if (mensaje.recurrencia && mensaje.recurrencia !== "ninguna") {
          const nextDate = calculateNextDate(
            new Date(mensaje.programado_para),
            mensaje.recurrencia
          );

          // Crear el siguiente mensaje programado
          await supabase.from("mensajes").insert({
            contenido: mensaje.contenido,
            estado: "programado",
            programado_para: nextDate.toISOString(),
            recurrencia: mensaje.recurrencia,
            plantilla_id: mensaje.plantilla_id,
          });
        }
      } catch (error) {
        console.error(`Error processing message ${mensaje.id}:`, error);
        
        // Marcar como fallido
        await supabase
          .from("mensajes")
          .update({ estado: "fallido" })
          .eq("id", mensaje.id);

        results.push({
          id: mensaje.id,
          status: "failed",
          error: error instanceof Error ? error.message : "Unknown error",
        });
      }
    }

    return NextResponse.json({
      message: `Procesados ${results.length} mensajes`,
      processed: results.length,
      results,
    });
  } catch (error) {
    console.error("Cron job error:", error);
    return NextResponse.json(
      { error: "Error interno del servidor" },
      { status: 500 }
    );
  }
}

/**
 * Calcula la próxima fecha según el tipo de recurrencia
 */
function calculateNextDate(
  currentDate: Date,
  recurrence: string
): Date {
  const next = new Date(currentDate);

  switch (recurrence) {
    case "diaria":
      next.setDate(next.getDate() + 1);
      break;
    case "semanal":
      next.setDate(next.getDate() + 7);
      break;
    case "mensual":
      next.setMonth(next.getMonth() + 1);
      break;
  }

  return next;
}


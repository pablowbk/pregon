import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/server";
import { getWhatsAppClient } from "@/lib/whatsapp/client";

export async function GET() {
  try {
    const supabase = createAdminClient();
    
    const { data: mensajes, error } = await supabase
      .from("mensajes")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(50);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(mensajes);
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json(
      { error: "Error al obtener mensajes" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { contenido, categoria, programado_para } = body;

    if (!contenido?.trim()) {
      return NextResponse.json(
        { error: "El contenido es requerido" },
        { status: 400 }
      );
    }

    const supabase = createAdminClient();

    // Determinar el estado del mensaje
    const estado = programado_para ? "programado" : "enviado";
    const enviado_en = programado_para ? null : new Date().toISOString();

    // Guardar el mensaje en la base de datos
    const { data: mensaje, error: insertError } = await supabase
      .from("mensajes")
      .insert({
        contenido: contenido.trim(),
        estado,
        programado_para: programado_para || null,
        enviado_en,
        recurrencia: "ninguna",
      })
      .select()
      .single();

    if (insertError) {
      console.error("Error inserting message:", insertError);
      return NextResponse.json(
        { error: "Error al guardar el mensaje" },
        { status: 500 }
      );
    }

    // Si no está programado, enviar inmediatamente
    if (!programado_para) {
      const whatsapp = getWhatsAppClient();

      if (!whatsapp.isConfigured()) {
        // WhatsApp no configurado, solo guardamos el mensaje
        return NextResponse.json({
          ...mensaje,
          warning: "Mensaje guardado pero WhatsApp no está configurado",
        });
      }

      // Obtener todos los suscriptores activos
      const { data: suscriptores, error: subsError } = await supabase
        .from("suscriptores")
        .select("id, telefono")
        .eq("activo", true);

      if (subsError) {
        console.error("Error fetching subscribers:", subsError);
        return NextResponse.json({
          ...mensaje,
          warning: "Mensaje guardado pero hubo error al obtener suscriptores",
        });
      }

      if (!suscriptores || suscriptores.length === 0) {
        return NextResponse.json({
          ...mensaje,
          warning: "Mensaje guardado pero no hay suscriptores activos",
        });
      }

      // Enviar a todos los suscriptores
      const phones = suscriptores.map((s) => s.telefono);
      const results = await whatsapp.sendBulkMessages(phones, contenido);

      // Registrar los envíos
      const registros = suscriptores.map((sub) => ({
        mensaje_id: mensaje.id,
        suscriptor_id: sub.id,
        estado: results.success.includes(sub.telefono) ? "enviado" : "fallido",
        error_mensaje: results.failed.find((f) => f.phone === sub.telefono)?.error || null,
      }));

      await supabase.from("registro_envios").insert(registros);

      return NextResponse.json({
        ...mensaje,
        enviados: results.success.length,
        fallidos: results.failed.length,
      });
    }

    return NextResponse.json(mensaje);
  } catch (error) {
    console.error("Error creating message:", error);
    return NextResponse.json(
      { error: "Error al procesar el mensaje" },
      { status: 500 }
    );
  }
}


export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type MessageStatus = "borrador" | "programado" | "enviado" | "fallido";
export type MessageCategory = "general" | "residuos" | "vacunacion" | "seguridad" | "eventos" | "emergencia";
export type RecurrenceType = "ninguna" | "diaria" | "semanal" | "mensual";
export type DeliveryStatus = "enviado" | "entregado" | "leido" | "fallido";

export interface Database {
  public: {
    Tables: {
      plantillas: {
        Row: {
          id: string;
          titulo: string;
          contenido: string;
          categoria: MessageCategory;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          titulo: string;
          contenido: string;
          categoria?: MessageCategory;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          titulo?: string;
          contenido?: string;
          categoria?: MessageCategory;
          updated_at?: string;
        };
      };
      mensajes: {
        Row: {
          id: string;
          contenido: string;
          estado: MessageStatus;
          programado_para: string | null;
          enviado_en: string | null;
          recurrencia: RecurrenceType;
          plantilla_id: string | null;
          whatsapp_message_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          contenido: string;
          estado?: MessageStatus;
          programado_para?: string | null;
          enviado_en?: string | null;
          recurrencia?: RecurrenceType;
          plantilla_id?: string | null;
          whatsapp_message_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          contenido?: string;
          estado?: MessageStatus;
          programado_para?: string | null;
          enviado_en?: string | null;
          recurrencia?: RecurrenceType;
          plantilla_id?: string | null;
          whatsapp_message_id?: string | null;
          updated_at?: string;
        };
      };
      suscriptores: {
        Row: {
          id: string;
          telefono: string;
          nombre: string | null;
          activo: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          telefono: string;
          nombre?: string | null;
          activo?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          telefono?: string;
          nombre?: string | null;
          activo?: boolean;
          updated_at?: string;
        };
      };
      registro_envios: {
        Row: {
          id: string;
          mensaje_id: string;
          suscriptor_id: string;
          estado: DeliveryStatus;
          whatsapp_status: string | null;
          error_mensaje: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          mensaje_id: string;
          suscriptor_id: string;
          estado?: DeliveryStatus;
          whatsapp_status?: string | null;
          error_mensaje?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          mensaje_id?: string;
          suscriptor_id?: string;
          estado?: DeliveryStatus;
          whatsapp_status?: string | null;
          error_mensaje?: string | null;
        };
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
  };
}

// Helper types
export type Plantilla = Database["public"]["Tables"]["plantillas"]["Row"];
export type PlantillaInsert = Database["public"]["Tables"]["plantillas"]["Insert"];
export type Mensaje = Database["public"]["Tables"]["mensajes"]["Row"];
export type MensajeInsert = Database["public"]["Tables"]["mensajes"]["Insert"];
export type MensajeUpdate = Database["public"]["Tables"]["mensajes"]["Update"];
export type Suscriptor = Database["public"]["Tables"]["suscriptores"]["Row"];
export type SuscriptorInsert = Database["public"]["Tables"]["suscriptores"]["Insert"];
export type RegistroEnvio = Database["public"]["Tables"]["registro_envios"]["Row"];
export type RegistroEnvioInsert = Database["public"]["Tables"]["registro_envios"]["Insert"];

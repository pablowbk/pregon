/**
 * WhatsApp Cloud API Client
 * Documentación: https://developers.facebook.com/docs/whatsapp/cloud-api
 */

const WHATSAPP_API_URL = "https://graph.facebook.com/v18.0";

interface WhatsAppMessage {
  messaging_product: "whatsapp";
  to: string;
  type: "text" | "template";
  text?: {
    body: string;
    preview_url?: boolean;
  };
  template?: {
    name: string;
    language: {
      code: string;
    };
    components?: Array<{
      type: string;
      parameters: Array<{
        type: string;
        text?: string;
      }>;
    }>;
  };
}

interface WhatsAppResponse {
  messaging_product: string;
  contacts: Array<{
    input: string;
    wa_id: string;
  }>;
  messages: Array<{
    id: string;
  }>;
}

interface WhatsAppError {
  error: {
    message: string;
    type: string;
    code: number;
    error_subcode?: number;
    fbtrace_id: string;
  };
}

export class WhatsAppClient {
  private phoneNumberId: string;
  private accessToken: string;

  constructor() {
    this.phoneNumberId = process.env.WHATSAPP_PHONE_NUMBER_ID!;
    this.accessToken = process.env.WHATSAPP_ACCESS_TOKEN!;

    if (!this.phoneNumberId || !this.accessToken) {
      console.warn(
        "⚠️ WhatsApp credentials not configured. Messages will not be sent."
      );
    }
  }

  private async request<T>(
    endpoint: string,
    method: "GET" | "POST" = "POST",
    body?: object
  ): Promise<T> {
    const response = await fetch(
      `${WHATSAPP_API_URL}/${this.phoneNumberId}${endpoint}`,
      {
        method,
        headers: {
          Authorization: `Bearer ${this.accessToken}`,
          "Content-Type": "application/json",
        },
        body: body ? JSON.stringify(body) : undefined,
      }
    );

    const data = await response.json();

    if (!response.ok) {
      const error = data as WhatsAppError;
      throw new Error(
        `WhatsApp API Error: ${error.error.message} (code: ${error.error.code})`
      );
    }

    return data as T;
  }

  /**
   * Envía un mensaje de texto simple
   */
  async sendTextMessage(
    phoneNumber: string,
    message: string
  ): Promise<WhatsAppResponse> {
    // Formatear número para Argentina si no tiene código de país
    const formattedPhone = this.formatPhoneNumber(phoneNumber);

    const payload: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "text",
      text: {
        body: message,
        preview_url: true,
      },
    };

    return this.request<WhatsAppResponse>("/messages", "POST", payload);
  }

  /**
   * Envía un mensaje usando una plantilla aprobada por WhatsApp
   */
  async sendTemplateMessage(
    phoneNumber: string,
    templateName: string,
    parameters?: string[]
  ): Promise<WhatsAppResponse> {
    const formattedPhone = this.formatPhoneNumber(phoneNumber);

    const payload: WhatsAppMessage = {
      messaging_product: "whatsapp",
      to: formattedPhone,
      type: "template",
      template: {
        name: templateName,
        language: {
          code: "es_AR",
        },
        components: parameters
          ? [
              {
                type: "body",
                parameters: parameters.map((text) => ({
                  type: "text",
                  text,
                })),
              },
            ]
          : undefined,
      },
    };

    return this.request<WhatsAppResponse>("/messages", "POST", payload);
  }

  /**
   * Envía un mensaje a múltiples destinatarios
   */
  async sendBulkMessages(
    phoneNumbers: string[],
    message: string
  ): Promise<{
    success: string[];
    failed: Array<{ phone: string; error: string }>;
  }> {
    const results = {
      success: [] as string[],
      failed: [] as Array<{ phone: string; error: string }>,
    };

    // WhatsApp Cloud API no tiene endpoint de bulk, enviamos uno por uno
    // con un pequeño delay para evitar rate limiting
    for (const phone of phoneNumbers) {
      try {
        await this.sendTextMessage(phone, message);
        results.success.push(phone);
        // Pequeño delay entre mensajes (100ms)
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (error) {
        results.failed.push({
          phone,
          error: error instanceof Error ? error.message : "Error desconocido",
        });
      }
    }

    return results;
  }

  /**
   * Formatea el número de teléfono para Argentina
   * Ejemplo: 1155551234 -> 5491155551234
   */
  private formatPhoneNumber(phone: string): string {
    // Remover espacios, guiones y paréntesis
    let cleaned = phone.replace(/[\s\-\(\)]/g, "");

    // Si empieza con +, removerlo
    if (cleaned.startsWith("+")) {
      cleaned = cleaned.substring(1);
    }

    // Si no empieza con código de país (54 para Argentina), agregarlo
    if (!cleaned.startsWith("54")) {
      // Si empieza con 0, removerlo (código de área nacional)
      if (cleaned.startsWith("0")) {
        cleaned = cleaned.substring(1);
      }
      // Si empieza con 15 (prefijo celular), removerlo
      if (cleaned.startsWith("15")) {
        cleaned = cleaned.substring(2);
      }
      cleaned = "549" + cleaned;
    }

    return cleaned;
  }

  /**
   * Verifica si el cliente está configurado
   */
  isConfigured(): boolean {
    return Boolean(this.phoneNumberId && this.accessToken);
  }
}

// Singleton instance
let whatsappClient: WhatsAppClient | null = null;

export function getWhatsAppClient(): WhatsAppClient {
  if (!whatsappClient) {
    whatsappClient = new WhatsAppClient();
  }
  return whatsappClient;
}

"use client";

import { useState, useEffect } from "react";
import {
  Settings,
  Database,
  MessageSquare,
  CheckCircle,
  XCircle,
  ExternalLink,
  Copy,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface ConfigStatus {
  supabase: boolean;
  whatsapp: boolean;
}

export default function ConfiguracionPage() {
  const [status, setStatus] = useState<ConfigStatus>({
    supabase: false,
    whatsapp: false,
  });
  const [isChecking, setIsChecking] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setWebhookUrl(`${window.location.origin}/api/whatsapp/webhook`);
    }
    checkStatus();
  }, []);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const response = await fetch("/api/config/status");
      const data = await response.json();
      setStatus(data);
    } catch {
      console.error("Error checking status");
    } finally {
      setIsChecking(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            Configuración
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Configurar conexiones y servicios
          </p>
        </div>
        <Button variant="outline" onClick={checkStatus} disabled={isChecking}>
          <RefreshCw
            className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`}
          />
          Verificar
        </Button>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-purple-100 dark:bg-purple-900/50">
                  <Database className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">
                    Supabase
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Base de datos
                  </p>
                </div>
              </div>
              {status.supabase ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="error" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  No configurado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-xl bg-green-100 dark:bg-green-900/50">
                  <MessageSquare className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">
                    WhatsApp
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    Cloud API
                  </p>
                </div>
              </div>
              {status.whatsapp ? (
                <Badge variant="success" className="gap-1">
                  <CheckCircle className="h-3 w-3" />
                  Conectado
                </Badge>
              ) : (
                <Badge variant="error" className="gap-1">
                  <XCircle className="h-3 w-3" />
                  No configurado
                </Badge>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Supabase Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Configurar Supabase
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-secondary-600 dark:text-secondary-300">
            Supabase es la base de datos gratuita que usamos para guardar
            mensajes y suscriptores.
          </p>

          <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-secondary-900 dark:text-secondary-50">
              Pasos:
            </h4>
            <ol className="text-sm text-secondary-600 dark:text-secondary-300 space-y-2 list-decimal list-inside">
              <li>
                Creá una cuenta en{" "}
                <a
                  href="https://supabase.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                >
                  supabase.com
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>
                Creá un nuevo proyecto (región: South America - São Paulo)
              </li>
              <li>Andá a Settings → API y copiá las credenciales</li>
              <li>
                Agregá las variables a tu archivo{" "}
                <code className="bg-secondary-200 dark:bg-secondary-700 px-1 rounded">
                  .env.local
                </code>
              </li>
              <li>Ejecutá el SQL de inicialización en el SQL Editor</li>
            </ol>
          </div>

          <a
            href="https://supabase.com/dashboard"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <ExternalLink className="h-4 w-4" />
              Abrir Supabase Dashboard
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* WhatsApp Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Configurar WhatsApp Cloud API
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-secondary-600 dark:text-secondary-300">
            La API de WhatsApp permite enviar mensajes a los suscriptores. Los
            primeros 1,000 mensajes/mes son gratis.
          </p>

          <div className="bg-secondary-50 dark:bg-secondary-800/50 rounded-lg p-4 space-y-3">
            <h4 className="font-medium text-secondary-900 dark:text-secondary-50">
              Pasos:
            </h4>
            <ol className="text-sm text-secondary-600 dark:text-secondary-300 space-y-2 list-decimal list-inside">
              <li>
                Creá una cuenta en{" "}
                <a
                  href="https://developers.facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-primary-600 dark:text-primary-400 hover:underline inline-flex items-center gap-1"
                >
                  Meta for Developers
                  <ExternalLink className="h-3 w-3" />
                </a>
              </li>
              <li>Creá una nueva app tipo &quot;Business&quot;</li>
              <li>Agregá el producto &quot;WhatsApp&quot;</li>
              <li>Configurá el número de teléfono de prueba</li>
              <li>Copiá el Phone Number ID y Access Token</li>
              <li>Configurá el Webhook con la URL de abajo</li>
            </ol>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
              Webhook URL (para configurar en Meta)
            </label>
            <div className="flex gap-2">
              <Input
                value={webhookUrl}
                readOnly
                className="font-mono text-sm"
              />
              <Button
                variant="outline"
                onClick={() => copyToClipboard(webhookUrl)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <a
            href="https://developers.facebook.com/apps"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Button variant="outline">
              <ExternalLink className="h-4 w-4" />
              Abrir Meta Developers
            </Button>
          </a>
        </CardContent>
      </Card>

      {/* Environment Variables Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Variables de Entorno
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-secondary-600 dark:text-secondary-300 mb-4">
            Copiá este template a tu archivo{" "}
            <code className="bg-secondary-100 dark:bg-secondary-700 px-1 rounded">
              .env.local
            </code>
            :
          </p>
          <pre className="bg-secondary-900 dark:bg-secondary-950 text-secondary-100 p-4 rounded-lg text-sm overflow-x-auto">
            {`# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJ...

# Admin
ADMIN_PASSWORD=tu_contraseña_segura

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_ACCESS_TOKEN=EAAG...
WHATSAPP_VERIFY_TOKEN=mi_token_secreto

# App
NEXT_PUBLIC_APP_URL=${
              typeof window !== "undefined"
                ? window.location.origin
                : "http://localhost:3000"
            }
CRON_SECRET=un_string_aleatorio_largo`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

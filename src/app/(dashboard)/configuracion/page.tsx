import { Suspense } from "react";
import { Settings, Database, MessageSquare, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  StatusOverview,
  StatusOverviewSkeleton,
} from "@/components/config/StatusOverview";

export default function ConfiguracionPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
          Configuración
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          Configurar conexiones y servicios
        </p>
      </div>

      {/* Status Overview - Client Component */}
      <Suspense fallback={<StatusOverviewSkeleton />}>
        <StatusOverview />
      </Suspense>

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
              <li>
                Andá a Settings → Data API / API Keys y copiá las credenciales
              </li>
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
              <li>Configurá el Webhook con la URL de arriba</li>
            </ol>
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
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJ...
SUPABASE_SECRET_KEY=eyJ...

# Admin
ADMIN_PASSWORD=tu_contraseña_segura

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=123456789
WHATSAPP_ACCESS_TOKEN=EAAG...
WHATSAPP_VERIFY_TOKEN=mi_token_secreto

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
CRON_SECRET=un_string_aleatorio_largo`}
          </pre>
        </CardContent>
      </Card>
    </div>
  );
}

import { Megaphone, MessageSquare, CheckCircle, Phone } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/lib/config";

export default function SuscribirsePage() {
  // Número de WhatsApp (se configuraría con el real)
  const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "5491100000000";
  const whatsappLink = `https://wa.me/${whatsappNumber}?text=ALTA`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-50">
      {/* Header */}
      <header className="bg-emerald-600 text-white py-6 px-4">
        <div className="max-w-lg mx-auto text-center">
          <div className="inline-flex p-3 rounded-2xl bg-white/20 mb-4">
            <Megaphone className="h-8 w-8" />
          </div>
          <h1 className="text-2xl font-bold">{config.organizationFullName}</h1>
          <p className="text-emerald-100 mt-1">{config.appDescription}</p>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-lg mx-auto px-4 py-8 space-y-6">
        {/* Main CTA */}
        <Card className="border-2 border-emerald-200 shadow-lg">
          <CardContent className="p-6 text-center">
            <div className="inline-flex p-4 rounded-full bg-green-100 mb-4">
              <MessageSquare className="h-10 w-10 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-slate-900 mb-2">
              ¡Suscribite a las Notificaciones!
            </h2>
            <p className="text-slate-600 mb-6">
              Recibí información importante del barrio directamente en tu WhatsApp.
            </p>
            <a
              href={whatsappLink}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-semibold py-4 px-6 rounded-xl transition-colors text-lg"
            >
              <svg className="h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              Suscribirme por WhatsApp
            </a>
          </CardContent>
        </Card>

        {/* Instructions */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              ¿Cómo funciona?
            </h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  1
                </div>
                <div>
                  <p className="font-medium text-slate-900">Tocá el botón verde</p>
                  <p className="text-sm text-slate-500">Se abrirá WhatsApp con un mensaje listo</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  2
                </div>
                <div>
                  <p className="font-medium text-slate-900">Enviá el mensaje &quot;ALTA&quot;</p>
                  <p className="text-sm text-slate-500">Esto confirma tu suscripción</p>
                </div>
              </div>
              <div className="flex gap-3">
                <div className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-sm">
                  3
                </div>
                <div>
                  <p className="font-medium text-slate-900">¡Listo!</p>
                  <p className="text-sm text-slate-500">Vas a recibir las notificaciones del barrio</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* What you'll receive */}
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-slate-900 mb-4">
              ¿Qué información vas a recibir?
            </h3>
            <ul className="space-y-3">
              {[
                "🗑️ Días de recolección de residuos",
                "💉 Campañas de vacunación",
                "🔒 Avisos de seguridad",
                "🎉 Eventos del barrio",
                "📢 Comunicados municipales",
                "🚨 Alertas de emergencia",
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-2 text-slate-700">
                  <CheckCircle className="h-4 w-4 text-emerald-500 flex-shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Unsubscribe info */}
        <p className="text-center text-sm text-slate-500 px-4">
          Podés darte de baja en cualquier momento enviando &quot;BAJA&quot; al mismo número.
        </p>

        {/* Footer */}
        <footer className="text-center pt-4 border-t border-slate-100">
          <p className="text-sm text-slate-400">
            {config.organizationFullName}
          </p>
          <p className="text-xs text-slate-300 mt-1">
            {config.appDescription} {config.appName}
          </p>
        </footer>
      </main>
    </div>
  );
}


import Link from "next/link";
import { Plus, MessageSquare, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function MensajesPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Mensajes</h1>
          <p className="text-slate-500 mt-1">
            Gestionar y enviar mensajes a la comunidad
          </p>
        </div>
        <Link href="/mensajes/nuevo">
          <Button>
            <Plus className="h-4 w-4" />
            Nuevo Mensaje
          </Button>
        </Link>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input placeholder="Buscar mensajes..." className="pl-10" />
      </div>

      {/* Messages List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Historial de Mensajes</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-slate-400">
            <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No hay mensajes todavía</p>
            <p className="text-sm mt-1">
              Los mensajes enviados aparecerán aquí
            </p>
            <Link href="/mensajes/nuevo" className="inline-block mt-4">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                Enviar primer mensaje
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

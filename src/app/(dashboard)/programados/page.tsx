import Link from "next/link";
import { Plus, Calendar, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function ProgramadosPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            Mensajes Programados
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Mensajes agendados para envío automático
          </p>
        </div>
        <Link href="/mensajes/nuevo">
          <Button>
            <Plus className="h-4 w-4" />
            Programar Mensaje
          </Button>
        </Link>
      </div>

      {/* Calendar placeholder */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            Próximos Envíos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-secondary-400 dark:text-secondary-500">
            <Clock className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No hay mensajes programados</p>
            <p className="text-sm mt-1">
              Programá un mensaje para que se envíe automáticamente
            </p>
            <Link href="/mensajes/nuevo" className="inline-block mt-4">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4" />
                Programar mensaje
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>

      {/* Info */}
      <Card className="border-tertiary-200 dark:border-tertiary-700 bg-tertiary-50 dark:bg-tertiary-900/30">
        <CardContent className="p-6">
          <h3 className="font-semibold text-tertiary-900 dark:text-tertiary-100 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Mensajes Recurrentes
          </h3>
          <p className="text-sm text-tertiary-700 dark:text-tertiary-300 mt-2">
            Podés configurar mensajes que se envíen automáticamente cada semana,
            por ejemplo para recordar los días de recolección de residuos.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import Link from "next/link";
import { Plus, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Plantillas de ejemplo para mostrar la estructura
const plantillasEjemplo = [
  {
    id: "1",
    titulo: "Recolección de Residuos",
    categoria: "residuos" as const,
    contenido: "🗑️ *Recordatorio de Recolección*\n\nMañana {dia} pasa el camión de residuos {tipo}.\n\n♻️ ¡Gracias por colaborar con el barrio!",
  },
  {
    id: "2",
    titulo: "Campaña de Vacunación",
    categoria: "vacunacion" as const,
    contenido: "💉 *Campaña de Vacunación*\n\n{fecha} en {lugar} se realizará una jornada de vacunación {tipo}.\n\nHorario: {horario}\n\n📋 Llevá tu DNI y carnet de vacunación.",
  },
];

export default function PlantillasPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">Plantillas</h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Mensajes predefinidos para usar rápidamente
          </p>
        </div>
        <Link href="/plantillas/nueva">
          <Button>
            <Plus className="h-4 w-4" />
            Nueva Plantilla
          </Button>
        </Link>
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {plantillasEjemplo.map((plantilla) => (
          <Card key={plantilla.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-base">{plantilla.titulo}</CardTitle>
                <Badge variant={plantilla.categoria}>
                  {plantilla.categoria}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-secondary-600 dark:text-secondary-300 whitespace-pre-wrap line-clamp-4">
                {plantilla.contenido}
              </p>
              <div className="flex gap-2 mt-4">
                <Button variant="outline" size="sm" className="flex-1">
                  Editar
                </Button>
                <Button size="sm" className="flex-1">
                  Usar
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Empty state info */}
      <Card className="border-secondary-200 dark:border-secondary-700 bg-secondary-50 dark:bg-secondary-800/50">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-secondary-200 dark:bg-secondary-700">
              <FileText className="h-5 w-5 text-secondary-600 dark:text-secondary-300" />
            </div>
            <div>
              <h3 className="font-semibold text-secondary-900 dark:text-secondary-50">
                Sobre las Plantillas
              </h3>
              <p className="text-sm text-secondary-600 dark:text-secondary-300 mt-1">
                Las plantillas te permiten guardar mensajes frecuentes con
                variables como {"{fecha}"}, {"{dia}"}, {"{lugar}"} que podés
                completar al momento de enviar.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}


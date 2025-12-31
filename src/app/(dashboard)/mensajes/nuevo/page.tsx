"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Send, Clock, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

const categorias = [
  { value: "general", label: "📢 General" },
  { value: "residuos", label: "🗑️ Residuos" },
  { value: "vacunacion", label: "💉 Vacunación" },
  { value: "seguridad", label: "🔒 Seguridad" },
  { value: "eventos", label: "🎉 Eventos" },
  { value: "emergencia", label: "🚨 Emergencia" },
];

const MAX_CHARS = 1000; // WhatsApp limit is ~4096 but keeping it shorter

export default function NuevoMensajePage() {
  const router = useRouter();
  const [contenido, setContenido] = useState("");
  const [categoria, setCategoria] = useState("general");
  const [programar, setProgramar] = useState(false);
  const [fechaProgramada, setFechaProgramada] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!contenido.trim()) {
      toast.error("El mensaje no puede estar vacío");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contenido: contenido.trim(),
          categoria,
          programado_para: programar ? fechaProgramada : null,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Error al enviar");
      }

      toast.success(
        programar
          ? "Mensaje programado correctamente"
          : "Mensaje enviado correctamente"
      );
      router.push("/mensajes");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Error al enviar el mensaje"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link href="/mensajes">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Nuevo Mensaje</h1>
          <p className="text-slate-500 mt-1">
            Redactá un mensaje para la comunidad
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Contenido del mensaje
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Categoría */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Categoría
              </label>
              <Select
                value={categoria}
                onChange={(e) => setCategoria(e.target.value)}
                options={categorias}
              />
            </div>

            {/* Mensaje */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">
                Mensaje
              </label>
              <Textarea
                value={contenido}
                onChange={(e) => setContenido(e.target.value)}
                placeholder="Escribí tu mensaje aquí...

Ejemplo:
📢 *Recordatorio de Recolección*

Mañana viernes 15/12 pasa el camión de residuos reciclables.
Recordá separar: 🥫 latas, 📦 cartón, 🍾 vidrio y 🧴 plásticos.

¡Gracias por colaborar! ♻️"
                maxLength={MAX_CHARS}
                charCount
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-xs text-slate-400">
                Podés usar *texto* para <strong>negrita</strong> y _texto_ para{" "}
                <em>cursiva</em>
              </p>
            </div>

            {/* Programar toggle */}
            <div className="flex items-center gap-3 p-4 bg-slate-50 rounded-lg">
              <input
                type="checkbox"
                id="programar"
                checked={programar}
                onChange={(e) => setProgramar(e.target.checked)}
                className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
              />
              <label
                htmlFor="programar"
                className="text-sm font-medium text-slate-700 cursor-pointer flex items-center gap-2"
              >
                <Clock className="h-4 w-4" />
                Programar para después
              </label>
            </div>

            {/* Fecha programada */}
            {programar && (
              <div className="space-y-2 animate-fade-in">
                <label className="text-sm font-medium text-slate-700">
                  Fecha y hora de envío
                </label>
                <Input
                  type="datetime-local"
                  value={fechaProgramada}
                  onChange={(e) => setFechaProgramada(e.target.value)}
                  min={new Date().toISOString().slice(0, 16)}
                  required={programar}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Preview */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">Vista Previa</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-100">
              <div className="flex items-center gap-2 mb-2">
                <Badge
                  variant={
                    categoria as
                      | "general"
                      | "residuos"
                      | "vacunacion"
                      | "seguridad"
                      | "eventos"
                      | "emergencia"
                  }
                >
                  {categorias.find((c) => c.value === categoria)?.label}
                </Badge>
              </div>
              <p className="text-slate-700 whitespace-pre-wrap text-sm">
                {contenido || "El mensaje aparecerá aquí..."}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3 mt-6">
          <Link href="/mensajes">
            <Button variant="outline" type="button">
              Cancelar
            </Button>
          </Link>
          <Button type="submit" isLoading={isLoading}>
            {programar ? (
              <>
                <Clock className="h-4 w-4" />
                Programar
              </>
            ) : (
              <>
                <Send className="h-4 w-4" />
                Enviar Ahora
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

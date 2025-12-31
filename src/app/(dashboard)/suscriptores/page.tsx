"use client";

import { useState } from "react";
import { Users, QrCode, Download, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function SuscriptoresPage() {
  const [showQR, setShowQR] = useState(false);
  const qrUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/suscribirse`
      : "";

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
            Suscriptores
          </h1>
          <p className="text-secondary-500 dark:text-secondary-400 mt-1">
            Vecinos que reciben las notificaciones
          </p>
        </div>
        <Button onClick={() => setShowQR(true)}>
          <QrCode className="h-4 w-4" />
          Ver Código QR
        </Button>
      </div>

      {/* QR Code Modal */}
      {showQR && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <Card className="w-full max-w-md animate-fade-in">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <QrCode className="h-5 w-5" />
                Código QR de Suscripción
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-white dark:bg-secondary-700 p-6 rounded-lg border-2 border-dashed border-secondary-200 dark:border-secondary-600 text-center">
                {/* QR Code placeholder - will be generated dynamically */}
                <div className="w-48 h-48 mx-auto bg-secondary-100 dark:bg-secondary-600 rounded-lg flex items-center justify-center">
                  <QrCode className="h-24 w-24 text-secondary-300 dark:text-secondary-400" />
                </div>
                <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-4">
                  Escaneá para suscribirte
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
                  Link de suscripción
                </label>
                <div className="flex gap-2">
                  <Input value={qrUrl} readOnly className="font-mono text-sm" />
                  <Button
                    variant="outline"
                    onClick={() => {
                      navigator.clipboard.writeText(qrUrl);
                    }}
                  >
                    Copiar
                  </Button>
                </div>
              </div>

              <p className="text-sm text-secondary-500 dark:text-secondary-400">
                Imprimí este código y colocalo en lugares visibles del barrio
                para que los vecinos puedan suscribirse fácilmente.
              </p>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1">
                  <Download className="h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button onClick={() => setShowQR(false)} className="flex-1">
                  Cerrar
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Search */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-secondary-400" />
        <Input placeholder="Buscar suscriptor..." className="pl-10" />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-primary-100 dark:bg-primary-900/50">
                <Users className="h-6 w-6 text-primary-600 dark:text-primary-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                  0
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Total suscriptores
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/50">
                <Phone className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                  0
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Activos
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary-100 dark:bg-secondary-700">
                <Users className="h-6 w-6 text-secondary-600 dark:text-secondary-300" />
              </div>
              <div>
                <p className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
                  0
                </p>
                <p className="text-sm text-secondary-500 dark:text-secondary-400">
                  Nuevos este mes
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Subscribers List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lista de Suscriptores</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-12 text-secondary-400 dark:text-secondary-500">
            <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
            <p className="font-medium">No hay suscriptores todavía</p>
            <p className="text-sm mt-1">
              Compartí el código QR para que los vecinos se suscriban
            </p>
            <Button
              variant="outline"
              size="sm"
              className="mt-4"
              onClick={() => setShowQR(true)}
            >
              <QrCode className="h-4 w-4" />
              Ver código QR
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

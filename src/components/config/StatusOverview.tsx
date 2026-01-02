"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Database,
  MessageSquare,
  CheckCircle,
  XCircle,
  RefreshCw,
  Copy,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import toast from "react-hot-toast";

interface ConfigStatus {
  supabase: boolean;
  whatsapp: boolean;
}

async function fetchConfigStatus(signal?: AbortSignal): Promise<ConfigStatus> {
  const response = await fetch("/api/config/status", { signal });
  if (!response.ok) {
    throw new Error("Failed to fetch config status");
  }
  return response.json();
}

function StatusCardsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary-200 dark:bg-secondary-700 animate-pulse">
                <div className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-24 bg-secondary-200 dark:bg-secondary-700 rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary-200 dark:bg-secondary-700 animate-pulse">
                <div className="h-6 w-6" />
              </div>
              <div className="space-y-2">
                <div className="h-4 w-20 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
                <div className="h-3 w-24 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
              </div>
            </div>
            <div className="h-6 w-24 bg-secondary-200 dark:bg-secondary-700 rounded-full animate-pulse" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export function StatusOverviewSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-end">
        <div className="h-10 w-24 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse" />
      </div>

      {/* Status cards skeleton */}
      <StatusCardsSkeleton />

      {/* Webhook URL skeleton */}
      <div className="space-y-2">
        <div className="h-4 w-48 bg-secondary-200 dark:bg-secondary-700 rounded animate-pulse" />
        <div className="flex gap-2">
          <div className="h-10 flex-1 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse" />
          <div className="h-10 w-10 bg-secondary-200 dark:bg-secondary-700 rounded-lg animate-pulse" />
        </div>
      </div>
    </div>
  );
}

export function StatusOverview() {
  const [status, setStatus] = useState<ConfigStatus | null>(null);
  const [isChecking, setIsChecking] = useState(true);

  const webhookUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}/api/whatsapp/webhook`;
  }, []);

  const checkStatus = useCallback(async (signal?: AbortSignal) => {
    setIsChecking(true);
    try {
      const data = await fetchConfigStatus(signal);
      setStatus(data);
    } catch (error) {
      // Ignore abort errors (component unmounted)
      if (error instanceof Error && error.name === "AbortError") {
        return;
      }
      console.error("Error checking status:", error);
    } finally {
      setIsChecking(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    checkStatus(controller.signal);

    return () => {
      controller.abort();
    };
  }, [checkStatus]);

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copiado al portapapeles");
  };

  return (
    <div className="space-y-6">
      {/* Verify Button */}
      <div className="flex items-center justify-end">
        <Button
          variant="outline"
          onClick={() => checkStatus()}
          disabled={isChecking}
        >
          <RefreshCw
            className={`h-4 w-4 ${isChecking ? "animate-spin" : ""}`}
          />
          Verificar
        </Button>
      </div>

      {/* Status Cards */}
      {isChecking || !status ? (
        <StatusCardsSkeleton />
      ) : (
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
      )}

      {/* Webhook URL */}
      <div className="space-y-2">
        <label className="text-sm font-medium text-secondary-700 dark:text-secondary-300">
          Webhook URL (para configurar en Meta)
        </label>
        <div className="flex gap-2">
          <Input value={webhookUrl} readOnly className="font-mono text-sm" />
          <Button variant="outline" onClick={() => copyToClipboard(webhookUrl)}>
            <Copy className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

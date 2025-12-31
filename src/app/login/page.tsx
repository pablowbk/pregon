"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Megaphone, Lock, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { config } from "@/lib/config";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams.get("redirect") || "/";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      console.log("apunto de hacer el fetch");
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      console.log("response", response);

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Error al iniciar sesión");
        return;
      }

      router.push(redirect);
      router.refresh();
    } catch {
      setError("Error de conexión. Intentá de nuevo.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium text-slate-300">
          Contraseña de administrador
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Ingresá la contraseña"
            className="pl-10 bg-slate-700 border-slate-600 text-white placeholder:text-slate-500 focus-visible:ring-emerald-500"
            required
            autoFocus
          />
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 text-sm text-red-400 bg-red-900/20 border border-red-800 rounded-lg p-3">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <Button type="submit" className="w-full h-11" isLoading={isLoading}>
        Ingresar
      </Button>
    </form>
  );
}

function LoginFormFallback() {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="h-4 w-32 bg-slate-700 rounded animate-pulse" />
        <div className="h-10 bg-slate-700 rounded-lg animate-pulse" />
      </div>
      <div className="h-11 bg-slate-700 rounded-lg animate-pulse" />
    </div>
  );
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-br from-slate-900 via-slate-800 to-emerald-900 p-4">
      {/* Background pattern */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-emerald-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000" />
      </div>

      <Card className="w-full max-w-md relative z-10 shadow-2xl border-slate-700 bg-slate-800/90 backdrop-blur">
        <CardContent className="p-8">
          {/* Logo */}
          <div className="text-center mb-8">
            <div className="inline-flex p-4 rounded-2xl bg-emerald-500 mb-4">
              <Megaphone className="h-10 w-10 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-white">{config.appName}</h1>
            <p className="text-slate-400 mt-1">{config.organizationFullName}</p>
          </div>

          {/* Form wrapped in Suspense */}
          <Suspense fallback={<LoginFormFallback />}>
            <LoginForm />
          </Suspense>

          {/* Footer */}
          <p className="text-center text-xs text-slate-500 mt-8">
            {config.appDescription}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}

import {
  MessageSquare,
  Users,
  Calendar,
  CheckCircle,
  ArrowUpRight,
  Clock,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";
import { config } from "@/lib/config";

// Stats cards data - esto vendrá de la base de datos
const stats = [
  {
    title: "Mensajes Enviados",
    value: "0",
    subtitle: "Este mes",
    icon: MessageSquare,
    color: "bg-primary-500",
  },
  {
    title: "Suscriptores",
    value: "0",
    subtitle: "Activos",
    icon: Users,
    color: "bg-blue-500",
  },
  {
    title: "Programados",
    value: "0",
    subtitle: "Pendientes",
    icon: Calendar,
    color: "bg-tertiary-500",
  },
  {
    title: "Tasa de Entrega",
    value: "—",
    subtitle: "Último mes",
    icon: CheckCircle,
    color: "bg-purple-500",
  },
];

const quickActions = [
  {
    title: "Enviar Mensaje",
    description: "Enviar un mensaje ahora",
    href: "/mensajes/nuevo",
    icon: MessageSquare,
  },
  {
    title: "Programar Envío",
    description: "Agendar para después",
    href: "/programados/nuevo",
    icon: Clock,
  },
  {
    title: "Ver Suscriptores",
    description: "Gestionar lista",
    href: "/suscriptores",
    icon: Users,
  },
];

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-secondary-900 dark:text-secondary-50">
          ¡Bienvenido al Panel! 👋
        </h1>
        <p className="text-secondary-500 dark:text-secondary-400 mt-1">
          {config.organizationFullName} - {config.appDescription}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-secondary-900 dark:text-secondary-50 mt-1">
                    {stat.value}
                  </p>
                  <p className="text-xs text-secondary-400 dark:text-secondary-500 mt-1">
                    {stat.subtitle}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${stat.color}`}>
                  <stat.icon className="h-6 w-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-4">
          Acciones Rápidas
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {quickActions.map((action) => (
            <Link key={action.title} href={action.href}>
              <Card className="hover:shadow-md hover:border-primary-200 dark:hover:border-primary-700 transition-all cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary-50 dark:bg-primary-900/50 group-hover:bg-primary-100 dark:group-hover:bg-primary-800/50 transition-colors">
                      <action.icon className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-secondary-300 dark:text-secondary-600 group-hover:text-primary-500 transition-colors" />
                  </div>
                  <h3 className="font-semibold text-secondary-900 dark:text-secondary-50 mt-4">
                    {action.title}
                  </h3>
                  <p className="text-sm text-secondary-500 dark:text-secondary-400 mt-1">
                    {action.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 className="text-lg font-semibold text-secondary-900 dark:text-secondary-50 mb-4">
          Actividad Reciente
        </h2>
        <Card>
          <CardContent className="p-8">
            <div className="text-center text-secondary-400 dark:text-secondary-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-3 opacity-50" />
              <p>No hay actividad reciente</p>
              <p className="text-sm mt-1">
                Los mensajes enviados aparecerán aquí
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Setup Banner */}
      <Card className="border-tertiary-200 dark:border-tertiary-700 bg-tertiary-50 dark:bg-tertiary-900/30">
        <CardContent className="p-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded-lg bg-tertiary-100 dark:bg-tertiary-800/50">
              <Clock className="h-5 w-5 text-tertiary-600 dark:text-tertiary-400" />
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-tertiary-900 dark:text-tertiary-100">
                Configuración Pendiente
              </h3>
              <p className="text-sm text-tertiary-700 dark:text-tertiary-300 mt-1">
                Para empezar a enviar mensajes, necesitás configurar:
              </p>
              <ul className="text-sm text-tertiary-700 dark:text-tertiary-300 mt-2 space-y-1">
                <li>• Conectar con Supabase (base de datos)</li>
                <li>• Configurar WhatsApp Cloud API</li>
                <li>• Generar el código QR para suscriptores</li>
              </ul>
              <Link
                href="/configuracion"
                className="inline-flex items-center gap-1 text-sm font-medium text-tertiary-800 dark:text-tertiary-200 hover:text-tertiary-900 dark:hover:text-tertiary-100 mt-3"
              >
                Ir a Configuración
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

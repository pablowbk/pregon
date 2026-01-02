# 📢 Pregón - Delegación Costa Norte

Sistema de notificaciones comunitarias por WhatsApp para Delegación Costa Norte.

## 🚀 Características

- ✅ Enviar mensajes a toda la comunidad por WhatsApp
- ✅ Programar mensajes para envío futuro
- ✅ Mensajes recurrentes (diarios, semanales, mensuales)
- ✅ Plantillas de mensajes reutilizables
- ✅ Suscripción por código QR
- ✅ Panel de administración seguro
- ✅ Categorías: residuos, vacunación, seguridad, eventos, emergencias

## 💰 Costos

| Servicio                 | Costo                            |
| ------------------------ | -------------------------------- |
| Vercel (hosting)         | $0 (free tier)                   |
| Supabase (base de datos) | $0 (free tier: 500MB)            |
| WhatsApp Cloud API       | $0 (primeros 1,000 mensajes/mes) |
| **Total**                | **$0/mes**                       |

## 📋 Requisitos Previos

1. Cuenta en [Vercel](https://vercel.com) (gratis)
2. Cuenta en [Supabase](https://supabase.com) (gratis)
3. Cuenta en [Meta for Developers](https://developers.facebook.com) (gratis)
4. Node.js 18+ instalado

## 🛠️ Instalación

### 1. Clonar e instalar

```bash
cd /home/pablo/repos/pregon
npm install
```

### 2. Configurar variables de entorno

Copiá el archivo de ejemplo:

```bash
cp .env.local.example .env.local
```

Editá `.env.local` con tus credenciales (ver sección de configuración abajo).

### 3. Iniciar en desarrollo

```bash
npm run dev
```

Abrí [http://localhost:3000](http://localhost:3000)

## ⚙️ Configuración

### Supabase (Base de Datos)

1. Creá una cuenta en [supabase.com](https://supabase.com)
2. Creá un nuevo proyecto (Región: South America - São Paulo)
3. Esperá que se inicialice (~2 minutos)
4. Andá a **Settings → Data API**
5. Copiá: `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
6. Andá a **Settings → API Keys**
7. Copiá:
   - `Publishable key` default → `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY`
   - `Secret keys` default → `SUPABASE_SECRET_KEY`
8. Andá a **SQL Editor** y ejecutá el contenido de `supabase/schema.sql`

### WhatsApp Cloud API

1. Andá a [developers.facebook.com](https://developers.facebook.com)
2. Creá una app tipo **Business**
3. Agregá el producto **WhatsApp**
4. En WhatsApp → Getting Started:
   - Copiá el **Phone Number ID** → `WHATSAPP_PHONE_NUMBER_ID`
   - Generá un **Access Token** → `WHATSAPP_ACCESS_TOKEN`
5. En WhatsApp → Configuration:
   - Webhook URL: `https://tu-dominio.vercel.app/api/whatsapp/webhook`
   - Verify Token: elegí uno y ponelo en `WHATSAPP_VERIFY_TOKEN`
   - Suscribite a: `messages`

### Variables de Entorno Completas

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NNEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY=eyJhbGc...
SUPABASE_SECRET_KEY=eyJhbGc...

# Admin (elegí una contraseña segura)
ADMIN_PASSWORD=MiContraseñaSegura123!

# WhatsApp
WHATSAPP_PHONE_NUMBER_ID=123456789012345
WHATSAPP_ACCESS_TOKEN=EAAGxxxx...
WHATSAPP_VERIFY_TOKEN=mi_token_secreto_123

# App
NEXT_PUBLIC_APP_URL=https://pregon.vercel.app
CRON_SECRET=un_string_aleatorio_muy_largo_aqui
```

## 🚀 Deploy a Vercel

1. Subí el código a GitHub
2. Andá a [vercel.com](https://vercel.com) y conectá el repo
3. Agregá las variables de entorno en Settings → Environment Variables
4. Deploy!

## 📱 Uso

### Suscripción de Vecinos

Los vecinos pueden suscribirse de dos formas:

1. **Código QR**: Escaneando el código QR que genera el sistema
2. **Directo**: Enviando "ALTA" al número de WhatsApp

Para darse de baja, envían "BAJA".

### Enviar Mensajes

1. Ingresá al panel con la contraseña
2. Andá a **Mensajes → Nuevo Mensaje**
3. Escribí el contenido y elegí la categoría
4. Enviá ahora o programá para después

### Mensajes Programados

El sistema revisa cada 5 minutos si hay mensajes para enviar.
Los mensajes recurrentes se re-programan automáticamente.

## 🔧 Estructura del Proyecto

```
pregon/
├── src/
│   ├── app/
│   │   ├── (dashboard)/      # Panel de admin
│   │   ├── api/              # API routes
│   │   ├── login/            # Página de login
│   │   └── suscribirse/      # Página pública de suscripción
│   ├── components/
│   │   ├── ui/               # Componentes reutilizables
│   │   └── layout/           # Layout components
│   ├── lib/
│   │   ├── supabase/         # Cliente de Supabase
│   │   ├── whatsapp/         # Cliente de WhatsApp API
│   │   └── utils.ts          # Utilidades
│   └── types/                # TypeScript types
├── supabase/
│   └── schema.sql            # Schema de base de datos
└── vercel.json               # Configuración de cron jobs
```

## 📞 Soporte

Para soporte técnico, contactar a pablo.weisbek@gmail.com

## 📄 Licencia

Desarrollado para Delegación Costa Norte.

---

Hecho con ❤️ para la comunidad

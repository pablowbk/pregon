-- =============================================
-- PREGÓN - Delegación Costa Norte
-- Schema de Base de Datos para Supabase
-- =============================================
-- 
-- Instrucciones:
-- 1. Andá a tu proyecto en Supabase Dashboard
-- 2. Hacé clic en "SQL Editor" en el menú lateral
-- 3. Pegá todo este código y ejecutalo
-- =============================================

-- Habilitar UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- TABLA: plantillas
-- Plantillas de mensajes reutilizables
-- =============================================
CREATE TABLE IF NOT EXISTS plantillas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  titulo TEXT NOT NULL,
  contenido TEXT NOT NULL,
  categoria TEXT DEFAULT 'general' CHECK (categoria IN ('general', 'residuos', 'vacunacion', 'seguridad', 'eventos', 'emergencia')),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: mensajes
-- Historial de mensajes enviados y programados
-- =============================================
CREATE TABLE IF NOT EXISTS mensajes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  contenido TEXT NOT NULL,
  estado TEXT DEFAULT 'borrador' CHECK (estado IN ('borrador', 'programado', 'enviado', 'fallido')),
  programado_para TIMESTAMPTZ,
  enviado_en TIMESTAMPTZ,
  recurrencia TEXT DEFAULT 'ninguna' CHECK (recurrencia IN ('ninguna', 'diaria', 'semanal', 'mensual')),
  plantilla_id UUID REFERENCES plantillas(id) ON DELETE SET NULL,
  whatsapp_message_id TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: suscriptores
-- Vecinos que reciben las notificaciones
-- =============================================
CREATE TABLE IF NOT EXISTS suscriptores (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  telefono TEXT UNIQUE NOT NULL,
  nombre TEXT,
  activo BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- TABLA: registro_envios
-- Log de cada envío individual a cada suscriptor
-- =============================================
CREATE TABLE IF NOT EXISTS registro_envios (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  mensaje_id UUID NOT NULL REFERENCES mensajes(id) ON DELETE CASCADE,
  suscriptor_id UUID NOT NULL REFERENCES suscriptores(id) ON DELETE CASCADE,
  estado TEXT DEFAULT 'enviado' CHECK (estado IN ('enviado', 'entregado', 'leido', 'fallido')),
  whatsapp_status TEXT,
  error_mensaje TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =============================================
-- ÍNDICES para mejor performance
-- =============================================
CREATE INDEX IF NOT EXISTS idx_mensajes_estado ON mensajes(estado);
CREATE INDEX IF NOT EXISTS idx_mensajes_programado_para ON mensajes(programado_para) WHERE programado_para IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_suscriptores_activo ON suscriptores(activo) WHERE activo = TRUE;
CREATE INDEX IF NOT EXISTS idx_suscriptores_telefono ON suscriptores(telefono);
CREATE INDEX IF NOT EXISTS idx_registro_envios_mensaje ON registro_envios(mensaje_id);

-- =============================================
-- TRIGGER: Actualizar updated_at automáticamente
-- =============================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_plantillas_updated_at
  BEFORE UPDATE ON plantillas
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_mensajes_updated_at
  BEFORE UPDATE ON mensajes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_suscriptores_updated_at
  BEFORE UPDATE ON suscriptores
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- Habilitamos RLS pero permitimos acceso con service_role
-- =============================================
ALTER TABLE plantillas ENABLE ROW LEVEL SECURITY;
ALTER TABLE mensajes ENABLE ROW LEVEL SECURITY;
ALTER TABLE suscriptores ENABLE ROW LEVEL SECURITY;
ALTER TABLE registro_envios ENABLE ROW LEVEL SECURITY;

-- Políticas para permitir acceso con service_role key
CREATE POLICY "Allow service role full access on plantillas" ON plantillas
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on mensajes" ON mensajes
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on suscriptores" ON suscriptores
  FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Allow service role full access on registro_envios" ON registro_envios
  FOR ALL USING (auth.role() = 'service_role');

-- =============================================
-- DATOS DE EJEMPLO (opcional, podés comentar)
-- =============================================
/*
INSERT INTO plantillas (titulo, contenido, categoria) VALUES
('Recolección de Residuos', '🗑️ *Recordatorio de Recolección*

Mañana pasa el camión de residuos reciclables.

Recordá separar:
🥫 Latas
📦 Cartón  
🍾 Vidrio
🧴 Plásticos

♻️ ¡Gracias por colaborar con el barrio!', 'residuos'),

('Vacunación de Mascotas', '💉 *Campaña de Vacunación*

Este sábado se realizará una jornada de vacunación antirrábica GRATUITA para perros y gatos.

📍 Plaza Central
🕐 9:00 a 14:00 hs

📋 Llevá a tu mascota con correa/transportadora.

¡Los esperamos!', 'vacunacion');
*/

-- =============================================
-- ¡Listo! Tu base de datos está configurada.
-- =============================================


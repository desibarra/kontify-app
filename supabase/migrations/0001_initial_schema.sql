-- ============================================
-- KONTIFY INITIAL SCHEMA
-- Migration: 0001_initial_schema
-- Created: 2025-11-21
-- ============================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABLE: profiles
-- Extiende auth.users con información adicional
-- ============================================

CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'expert', 'admin')),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Índices para profiles
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);

-- Trigger para actualizar updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: experts
-- Información específica de expertos
-- ============================================

CREATE TABLE IF NOT EXISTS public.experts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  profile_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  specialty TEXT NOT NULL,
  rating DECIMAL(3, 2) DEFAULT 0.00 CHECK (rating >= 0 AND rating <= 5),
  hourly_rate DECIMAL(10, 2) DEFAULT 0.00 CHECK (hourly_rate >= 0),
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'active', 'inactive', 'suspended')),
  bio TEXT,
  years_experience INTEGER DEFAULT 0 CHECK (years_experience >= 0),
  certifications TEXT[],
  languages TEXT[] DEFAULT ARRAY['es'],
  availability_hours JSONB DEFAULT '{"monday": [], "tuesday": [], "wednesday": [], "thursday": [], "friday": [], "saturday": [], "sunday": []}'::jsonb,
  total_consultations INTEGER DEFAULT 0,
  total_revenue DECIMAL(12, 2) DEFAULT 0.00,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: Un profile solo puede ser expert una vez
  UNIQUE(profile_id)
);

-- Índices para experts
CREATE INDEX IF NOT EXISTS idx_experts_profile_id ON public.experts(profile_id);
CREATE INDEX IF NOT EXISTS idx_experts_specialty ON public.experts(specialty);
CREATE INDEX IF NOT EXISTS idx_experts_status ON public.experts(status);
CREATE INDEX IF NOT EXISTS idx_experts_rating ON public.experts(rating DESC);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_experts_updated_at
  BEFORE UPDATE ON public.experts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- ============================================
-- TABLE: leads
-- Solicitudes de consulta de usuarios
-- ============================================

CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  expert_id UUID REFERENCES public.experts(id) ON DELETE SET NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  specialty TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in_progress', 'closed', 'cancelled')),
  priority TEXT NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
  budget DECIMAL(10, 2) CHECK (budget >= 0),
  estimated_hours INTEGER CHECK (estimated_hours > 0),
  deadline TIMESTAMPTZ,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  closed_at TIMESTAMPTZ
);

-- Índices para leads
CREATE INDEX IF NOT EXISTS idx_leads_user_id ON public.leads(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_expert_id ON public.leads(expert_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON public.leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_specialty ON public.leads(specialty);
CREATE INDEX IF NOT EXISTS idx_leads_created_at ON public.leads(created_at DESC);

-- Trigger para actualizar updated_at
CREATE TRIGGER update_leads_updated_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Trigger para actualizar closed_at cuando status = 'closed'
CREATE OR REPLACE FUNCTION update_lead_closed_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.status = 'closed' AND OLD.status != 'closed' THEN
    NEW.closed_at = NOW();
  ELSIF NEW.status != 'closed' THEN
    NEW.closed_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leads_closed_at
  BEFORE UPDATE ON public.leads
  FOR EACH ROW
  EXECUTE FUNCTION update_lead_closed_at();

-- ============================================
-- TABLE: messages
-- Mensajes entre usuarios y expertos
-- ============================================

CREATE TABLE IF NOT EXISTS public.messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
  sender_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  receiver_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  read_at TIMESTAMPTZ,
  attachments JSONB DEFAULT '[]'::jsonb,
  metadata JSONB DEFAULT '{}'::jsonb,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  -- Constraint: sender y receiver deben ser diferentes
  CHECK (sender_id != receiver_id)
);

-- Índices para messages
CREATE INDEX IF NOT EXISTS idx_messages_lead_id ON public.messages(lead_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_messages_receiver_id ON public.messages(receiver_id);
CREATE INDEX IF NOT EXISTS idx_messages_is_read ON public.messages(is_read);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON public.messages(created_at DESC);

-- Trigger para actualizar read_at cuando is_read = true
CREATE OR REPLACE FUNCTION update_message_read_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_read = TRUE AND OLD.is_read = FALSE THEN
    NEW.read_at = NOW();
  ELSIF NEW.is_read = FALSE THEN
    NEW.read_at = NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_messages_read_at
  BEFORE UPDATE ON public.messages
  FOR EACH ROW
  EXECUTE FUNCTION update_message_read_at();

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Habilitar RLS en todas las tablas
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.experts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- ============================================
-- RLS POLICIES: profiles
-- ============================================

-- Política: Los usuarios pueden ver todos los perfiles públicos
CREATE POLICY "Public profiles are viewable by everyone"
  ON public.profiles
  FOR SELECT
  USING (true);

-- Política: Los usuarios solo pueden actualizar su propio perfil
CREATE POLICY "Users can update own profile"
  ON public.profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Política: Los usuarios pueden insertar su propio perfil
CREATE POLICY "Users can insert own profile"
  ON public.profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- RLS POLICIES: experts
-- ============================================

-- Política: Cualquiera puede ver expertos activos
CREATE POLICY "Active experts are viewable by everyone"
  ON public.experts
  FOR SELECT
  USING (status = 'active');

-- Política: Los expertos pueden ver su propio perfil (incluso si no está activo)
CREATE POLICY "Experts can view own profile"
  ON public.experts
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.id = experts.profile_id
    )
  );

-- Política: Los expertos pueden actualizar su propio perfil
CREATE POLICY "Experts can update own profile"
  ON public.experts
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.id = experts.profile_id
    )
  );

-- Política: Los usuarios con role='expert' pueden insertar su perfil de experto
CREATE POLICY "Users with expert role can insert expert profile"
  ON public.experts
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.profiles
      WHERE profiles.id = auth.uid()
      AND profiles.role = 'expert'
      AND profiles.id = profile_id
    )
  );

-- ============================================
-- RLS POLICIES: leads
-- ============================================

-- Política: Los usuarios pueden ver sus propios leads
CREATE POLICY "Users can view own leads"
  ON public.leads
  FOR SELECT
  USING (auth.uid() = user_id);

-- Política: Los expertos pueden ver leads asignados a ellos
CREATE POLICY "Experts can view assigned leads"
  ON public.leads
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.experts
      WHERE experts.id = leads.expert_id
      AND experts.profile_id = auth.uid()
    )
  );

-- Política: Los usuarios pueden crear sus propios leads
CREATE POLICY "Users can create own leads"
  ON public.leads
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Política: Los usuarios pueden actualizar sus propios leads
CREATE POLICY "Users can update own leads"
  ON public.leads
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Política: Los expertos pueden actualizar leads asignados
CREATE POLICY "Experts can update assigned leads"
  ON public.leads
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.experts
      WHERE experts.id = leads.expert_id
      AND experts.profile_id = auth.uid()
    )
  );

-- ============================================
-- RLS POLICIES: messages
-- ============================================

-- Política: Los usuarios pueden ver mensajes donde son sender o receiver
CREATE POLICY "Users can view own messages"
  ON public.messages
  FOR SELECT
  USING (
    auth.uid() = sender_id OR auth.uid() = receiver_id
  );

-- Política: Los usuarios pueden enviar mensajes
CREATE POLICY "Users can send messages"
  ON public.messages
  FOR INSERT
  WITH CHECK (auth.uid() = sender_id);

-- Política: Los usuarios pueden actualizar mensajes donde son receiver (marcar como leído)
CREATE POLICY "Users can update received messages"
  ON public.messages
  FOR UPDATE
  USING (auth.uid() = receiver_id);

-- ============================================
-- FUNCTIONS: Helper functions
-- ============================================

-- Función: Crear perfil automáticamente al registrarse
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger: Crear perfil al registrar usuario
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Función: Obtener estadísticas de experto
CREATE OR REPLACE FUNCTION public.get_expert_stats(expert_uuid UUID)
RETURNS TABLE (
  total_leads BIGINT,
  active_leads BIGINT,
  closed_leads BIGINT,
  unread_messages BIGINT,
  avg_rating DECIMAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    COUNT(DISTINCT l.id) AS total_leads,
    COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'in_progress') AS active_leads,
    COUNT(DISTINCT l.id) FILTER (WHERE l.status = 'closed') AS closed_leads,
    COUNT(DISTINCT m.id) FILTER (WHERE m.is_read = FALSE AND m.receiver_id = (
      SELECT profile_id FROM public.experts WHERE id = expert_uuid
    )) AS unread_messages,
    (SELECT rating FROM public.experts WHERE id = expert_uuid) AS avg_rating
  FROM public.leads l
  LEFT JOIN public.messages m ON m.lead_id = l.id
  WHERE l.expert_id = expert_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- SEED DATA (Opcional - para desarrollo)
-- ============================================

-- Comentar en producción
-- INSERT INTO public.profiles (id, email, full_name, role) VALUES
--   ('00000000-0000-0000-0000-000000000001', 'admin@kontify.com', 'Admin Kontify', 'admin'),
--   ('00000000-0000-0000-0000-000000000002', 'expert@kontify.com', 'Expert Demo', 'expert'),
--   ('00000000-0000-0000-0000-000000000003', 'user@kontify.com', 'User Demo', 'user');

-- ============================================
-- COMMENTS
-- ============================================

COMMENT ON TABLE public.profiles IS 'Perfiles de usuario extendidos de auth.users';
COMMENT ON TABLE public.experts IS 'Información específica de expertos';
COMMENT ON TABLE public.leads IS 'Solicitudes de consulta de usuarios';
COMMENT ON TABLE public.messages IS 'Mensajes entre usuarios y expertos';

COMMENT ON COLUMN public.experts.availability_hours IS 'Horarios de disponibilidad por día de la semana (JSON)';
COMMENT ON COLUMN public.leads.metadata IS 'Metadata adicional del lead (JSON)';
COMMENT ON COLUMN public.messages.attachments IS 'Archivos adjuntos (JSON array)';

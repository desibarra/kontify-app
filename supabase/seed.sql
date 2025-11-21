-- ============================================
-- KONTIFY SEED DATA (CORREGIDO PARA TU PROYECTO)
-- ============================================

-- 1. INSERTAR/ACTUALIZAR PERFILES
-- Usamos los IDs reales que me mostraste en tu captura de Supabase
INSERT INTO public.profiles (id, email, full_name, avatar_url, role)
VALUES
  -- Tu Usuario Admin (ID Real)
  ('992566c1-93d8-4d5f-9773-6380148e866c', 'admin@kontify.com', 'Admin Kontify', 'https://i.pravatar.cc/300?img=1', 'admin'),
  
  -- Tu Usuario Experto "Ana García" (ID Real)
  ('c3bafc13-0bf3-4925-9431-761da22e5475', 'expert1@kontify.com', 'Lic. Ana García', 'https://i.pravatar.cc/300?img=5', 'expert')

ON CONFLICT (id) DO UPDATE
SET full_name = EXCLUDED.full_name, avatar_url = EXCLUDED.avatar_url, role = EXCLUDED.role;

-- 2. INSERTAR EXPERTOS
-- Solo podemos insertar a Ana García porque es la única que tiene un usuario real creado
INSERT INTO public.experts (id, profile_id, specialty, rating, hourly_rate, status, bio, years_experience, certifications, languages, total_consultations)
VALUES
  -- Abogado (Ana García)
  (
    'e0000000-0000-0000-0000-000000000001', -- Este ID puede ser inventado porque es generado por la app, pero debe ser hex válido
    'c3bafc13-0bf3-4925-9431-761da22e5475', -- ¡IMPORTANTE! Aquí va el ID REAL de Ana García
    'Legal',
    4.9,
    1200.00,
    'active',
    'Abogada especialista en derecho civil y mercantil. Más de 10 años ganando casos difíciles.',
    10,
    ARRAY['Licenciatura en Derecho', 'Maestría en Derecho Corporativo'],
    ARRAY['Español', 'Inglés'],
    150
  )
ON CONFLICT (id) DO UPDATE
SET specialty = EXCLUDED.specialty, bio = EXCLUDED.bio, hourly_rate = EXCLUDED.hourly_rate, status = 'active';

-- 3. INSERTAR LEADS (Solicitudes de trabajo)
INSERT INTO public.leads (id, user_id, expert_id, title, description, specialty, status, priority, budget)
VALUES
  (
    'a0000000-0000-0000-0000-000000000001', -- ID del Lead (Empieza con 'a' para ser UUID válido)
    '992566c1-93d8-4d5f-9773-6380148e866c', -- ID REAL de tu Admin (quien pide el servicio)
    'e0000000-0000-0000-0000-000000000001', -- ID del Experto asignado (Ana García)
    'Revisión de Contrato Arrendamiento',
    'Necesito revisar las cláusulas de un contrato de local comercial antes de firmar.',
    'Legal',
    'in_progress',
    'high',
    2000.00
  )
ON CONFLICT (id) DO NOTHING;
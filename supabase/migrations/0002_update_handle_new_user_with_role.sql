-- ============================================
-- ACTUALIZACIÓN: Trigger handle_new_user con soporte para role
-- ============================================
-- Fecha: 2025-11-22
-- Propósito: Capturar el campo "role" desde raw_user_meta_data al crear perfil
-- 
-- INSTRUCCIONES:
-- Ejecuta este script en tu Dashboard de Supabase:
-- 1. Ve a SQL Editor
-- 2. Pega este código
-- 3. Clic en "Run"
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    -- ✅ NUEVO: Captura el role desde metadata
    -- Si no viene role, defaultea a 'user'
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar que el trigger existe
-- (No es necesario recrearlo, solo actualizamos la función)
SELECT 
  trigger_name, 
  event_manipulation, 
  event_object_table 
FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- PRUEBA (Opcional)
-- ============================================
-- Para probar, registra un usuario desde tu app
-- y verifica que el role se guardó correctamente:
-- 
-- SELECT id, email, full_name, role, created_at 
-- FROM public.profiles 
-- ORDER BY created_at DESC 
-- LIMIT 5;
-- ============================================

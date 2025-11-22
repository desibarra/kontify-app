-- ============================================
-- CORRECCIÓN DEL SISTEMA DE ROLES - PASO A PASO
-- Ejecuta este script COMPLETO en Supabase SQL Editor
-- ============================================

-- ============================================
-- PASO 1: Crear ENUM user_role (si no existe)
-- ============================================
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
    CREATE TYPE public.user_role AS ENUM ('user', 'entrepreneur', 'expert', 'admin');
    RAISE NOTICE '✅ ENUM user_role creado exitosamente';
  ELSE
    RAISE NOTICE 'ℹ️ ENUM user_role ya existe, omitiendo creación';
  END IF;
END $$;

-- ============================================
-- PASO 2: Actualizar función handle_new_user
-- Versión SEGURA que NO requiere ENUM en la columna
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    -- ✅ Captura role desde metadata, default a 'user'
    -- ✅ Funciona con columna TEXT (no requiere cast a ENUM)
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================
-- PASO 3: Verificar y crear trigger (si no existe)
-- ============================================
DO $$
BEGIN
  -- Verificar si el trigger existe
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.triggers 
    WHERE trigger_name = 'on_auth_user_created'
  ) THEN
    -- Crear trigger si no existe
    CREATE TRIGGER on_auth_user_created
      AFTER INSERT ON auth.users
      FOR EACH ROW
      EXECUTE FUNCTION public.handle_new_user();
    
    RAISE NOTICE '✅ Trigger on_auth_user_created creado exitosamente';
  ELSE
    RAISE NOTICE 'ℹ️ Trigger on_auth_user_created ya existe';
  END IF;
END $$;

-- ============================================
-- REPORTE FINAL - VERIFICACIÓN COMPLETA
-- ============================================

SELECT '═══════════════════════════════════════' AS separador;
SELECT '✅ CORRECCIÓN COMPLETADA - REPORTE FINAL' AS resultado;
SELECT '═══════════════════════════════════════' AS separador;

-- Tabla 1: Estado del ENUM
SELECT 
  '1️⃣ ENUM user_role' AS componente,
  CASE 
    WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') 
    THEN '✅ EXISTE'
    ELSE '❌ NO EXISTE'
  END AS estado,
  COALESCE(
    (SELECT string_agg(enumlabel::text, ', ' ORDER BY enumsortorder) 
     FROM pg_enum e JOIN pg_type t ON e.enumtypid = t.oid 
     WHERE t.typname = 'user_role'),
    'N/A'
  ) AS valores;

-- Tabla 2: Estado de la columna
SELECT 
  '2️⃣ Columna profiles.role' AS componente,
  data_type || ' (' || udt_name || ')' AS estado,
  'default: ' || COALESCE(column_default, 'ninguno') AS valores
FROM information_schema.columns
WHERE table_schema = 'public' 
  AND table_name = 'profiles' 
  AND column_name = 'role';

-- Tabla 3: Estado de la función
SELECT 
  '3️⃣ Función handle_new_user' AS componente,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
      WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
    ) 
    THEN '✅ EXISTE'
    ELSE '❌ NO EXISTE'
  END AS estado,
  'Captura role desde metadata' AS valores;

-- Tabla 4: Estado del trigger
SELECT 
  '4️⃣ Trigger on_auth_user_created' AS componente,
  CASE 
    WHEN EXISTS (
      SELECT 1 FROM information_schema.triggers 
      WHERE trigger_name = 'on_auth_user_created'
    )
    THEN '✅ EXISTE'
    ELSE '❌ NO EXISTE'
  END AS estado,
  COALESCE(
    (SELECT event_manipulation || ' ON ' || event_object_schema || '.' || event_object_table
     FROM information_schema.triggers 
     WHERE trigger_name = 'on_auth_user_created' LIMIT 1),
    'N/A'
  ) AS valores;

-- Tabla 5: Distribución de roles
SELECT 
  '5️⃣ Distribución de roles' AS componente,
  role AS estado,
  COUNT(*)::text || ' usuarios' AS valores
FROM public.profiles
GROUP BY role
ORDER BY COUNT(*) DESC;

-- Tabla 6: Constraints
SELECT 
  '6️⃣ Constraints en role' AS componente,
  conname AS estado,
  pg_get_constraintdef(oid) AS valores
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass 
  AND conname LIKE '%role%';

-- ============================================
-- CÓDIGO COMPLETO DE LA FUNCIÓN (para verificación)
-- ============================================
SELECT 
  '📜 CÓDIGO COMPLETO DE handle_new_user():' AS info,
  pg_get_functiondef(p.oid) AS codigo
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'handle_new_user';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================

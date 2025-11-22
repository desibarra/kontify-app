-- ============================================
-- CORRECCIÓN SEGURA DEL SISTEMA DE ROLES
-- ⚠️ NO EJECUTAR SIN ANTES VERIFICAR
-- ============================================
-- Este script aplica las correcciones necesarias basadas en
-- los resultados de VERIFY_ROLES_SYSTEM.sql
-- ============================================

-- ============================================
-- PARTE 1: CREAR ENUM user_role (si no existe)
-- ============================================
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') THEN
        CREATE TYPE public.user_role AS ENUM ('user', 'entrepreneur', 'expert');
        RAISE NOTICE '✅ ENUM user_role creado exitosamente';
    ELSE
        RAISE NOTICE 'ℹ️ ENUM user_role ya existe, omitiendo creación';
    END IF;
END $$;

-- Verificar creación
SELECT 
    'ENUM user_role creado:' AS resultado,
    enumlabel AS valor,
    enumsortorder AS orden
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;

-- ============================================
-- PARTE 2: CONVERTIR COLUMNA profiles.role a ENUM
-- ⚠️ SOLO SI LA COLUMNA ES TIPO TEXT
-- ============================================

-- Primero, verificar valores actuales y normalizar si es necesario
-- (convertir 'admin' a 'expert' si existe)
UPDATE public.profiles 
SET role = 'expert' 
WHERE role = 'admin';

-- Ahora convertir la columna
DO $$
BEGIN
    -- Verificar si la columna ya es ENUM
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_schema = 'public' 
        AND table_name = 'profiles' 
        AND column_name = 'role'
        AND udt_name = 'user_role'
    ) THEN
        RAISE NOTICE 'ℹ️ La columna profiles.role ya es tipo user_role';
    ELSE
        -- Convertir a ENUM
        ALTER TABLE public.profiles 
        ALTER COLUMN role TYPE public.user_role 
        USING role::public.user_role;
        
        RAISE NOTICE '✅ Columna profiles.role convertida a ENUM user_role';
    END IF;
END $$;

-- Verificar conversión
SELECT 
    'Tipo de columna profiles.role:' AS verificacion,
    column_name,
    data_type,
    udt_name
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'role';

-- ============================================
-- PARTE 3: ACTUALIZAR FUNCIÓN handle_new_user
-- ============================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', ''),
    COALESCE(NEW.raw_user_meta_data->>'role', 'user')::public.user_role
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Verificar actualización
SELECT 
    '✅ Función handle_new_user actualizada' AS resultado,
    pg_get_functiondef(p.oid) AS definicion
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';

-- ============================================
-- PARTE 4: RECREAR TRIGGER (si es necesario)
-- ============================================

-- Eliminar trigger existente si hay alguno
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Crear trigger nuevo
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();

-- Verificar creación
SELECT 
    '✅ Trigger on_auth_user_created configurado' AS resultado,
    trigger_name,
    event_manipulation,
    event_object_table,
    action_timing,
    action_statement
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================
-- VERIFICACIÓN FINAL
-- ============================================

SELECT '═══════════════════════════════════════' AS separador;
SELECT '✅ CORRECCIÓN COMPLETADA' AS resultado;
SELECT '═══════════════════════════════════════' AS separador;

-- Resumen final
SELECT 
    'RESUMEN FINAL:' AS seccion,
    (SELECT COUNT(*) FROM pg_type WHERE typname = 'user_role') AS enum_existe,
    (SELECT udt_name FROM information_schema.columns 
     WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') AS tipo_columna,
    (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
     WHERE n.nspname = 'public' AND p.proname = 'handle_new_user') AS funcion_existe,
    (SELECT COUNT(*) FROM information_schema.triggers 
     WHERE trigger_name = 'on_auth_user_created') AS trigger_existe;

-- ============================================
-- FIN DE CORRECCIÓN
-- ============================================

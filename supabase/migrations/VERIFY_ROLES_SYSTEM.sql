-- ============================================
-- VERIFICACIÓN COMPLETA DEL SISTEMA DE ROLES
-- NO MODIFICA NADA - SOLO REPORTA ESTADO
-- ============================================
-- Ejecuta este script en Supabase Dashboard SQL Editor
-- Copia y pega el resultado completo aquí para análisis
-- ============================================

-- 1️⃣ VERIFICAR EXISTENCIA DEL ENUM user_role
SELECT 
    '🔍 PASO 1: Verificar ENUM user_role' AS check_step,
    CASE 
        WHEN EXISTS (SELECT 1 FROM pg_type WHERE typname = 'user_role') 
        THEN '✅ ENUM user_role EXISTE'
        ELSE '❌ ENUM user_role NO EXISTE'
    END AS status;

-- Mostrar valores del ENUM si existe
SELECT 
    '📋 Valores del ENUM user_role:' AS info,
    enumlabel AS enum_value,
    enumsortorder AS sort_order
FROM pg_enum e
JOIN pg_type t ON e.enumtypid = t.oid
WHERE t.typname = 'user_role'
ORDER BY e.enumsortorder;

-- ============================================

-- 2️⃣ VERIFICAR TIPO DE COLUMNA profiles.role
SELECT 
    '🔍 PASO 2: Tipo de columna profiles.role' AS check_step,
    column_name,
    data_type,
    udt_name,
    column_default,
    is_nullable
FROM information_schema.columns
WHERE table_schema = 'public'
    AND table_name = 'profiles'
    AND column_name = 'role';

-- ============================================

-- 3️⃣ VERIFICAR FUNCIÓN handle_new_user
SELECT 
    '🔍 PASO 3: Función handle_new_user' AS check_step,
    CASE 
        WHEN EXISTS (
            SELECT 1 FROM pg_proc p
            JOIN pg_namespace n ON p.pronamespace = n.oid
            WHERE n.nspname = 'public' 
            AND p.proname = 'handle_new_user'
        ) 
        THEN '✅ Función handle_new_user EXISTE'
        ELSE '❌ Función handle_new_user NO EXISTE'
    END AS status;

-- Mostrar código de la función
SELECT 
    '📜 Código actual de handle_new_user:' AS info,
    pg_get_functiondef(p.oid) AS function_definition
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' 
AND p.proname = 'handle_new_user';

-- ============================================

-- 4️⃣ VERIFICAR TRIGGER on_auth_user_created
SELECT 
    '🔍 PASO 4: Trigger on_auth_user_created' AS check_step,
    trigger_name,
    event_manipulation AS event,
    event_object_schema AS schema,
    event_object_table AS table,
    action_timing AS timing,
    action_statement AS action
FROM information_schema.triggers
WHERE trigger_name = 'on_auth_user_created';

-- ============================================

-- 5️⃣ VERIFICAR DATOS EXISTENTES EN profiles.role
SELECT 
    '📊 PASO 5: Distribución actual de roles' AS info,
    role,
    COUNT(*) AS total_users
FROM public.profiles
GROUP BY role
ORDER BY total_users DESC;

-- ============================================

-- 6️⃣ VERIFICAR CONSTRAINTS DE LA COLUMNA role
SELECT 
    '🔒 Constraints en profiles.role:' AS info,
    conname AS constraint_name,
    contype AS constraint_type,
    pg_get_constraintdef(oid) AS constraint_definition
FROM pg_constraint
WHERE conrelid = 'public.profiles'::regclass
    AND conname LIKE '%role%';

-- ============================================
-- FIN DE VERIFICACIÓN
-- ============================================
-- Copia TODO el resultado y pégalo en el chat

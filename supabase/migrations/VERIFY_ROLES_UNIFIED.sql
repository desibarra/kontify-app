-- ============================================
-- VERIFICACIÓN UNIFICADA DEL SISTEMA DE ROLES
-- VERSION MEJORADA - MUESTRA TODO EN UNA TABLA
-- ============================================

WITH 
-- Paso 1: Verificar ENUM
enum_check AS (
  SELECT 
    1 as orden,
    '🔍 PASO 1: ENUM user_role' AS verificacion,
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
    ) AS detalles
),

-- Paso 2: Verificar tipo de columna
column_check AS (
  SELECT 
    2 as orden,
    '🔍 PASO 2: Columna profiles.role' AS verificacion,
    udt_name AS estado,
    'default: ' || COALESCE(column_default, 'ninguno') || ', nullable: ' || is_nullable AS detalles
  FROM information_schema.columns
  WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role'
),

-- Paso 3: Verificar función
function_check AS (
  SELECT 
    3 as orden,
    '🔍 PASO 3: Función handle_new_user' AS verificacion,
    CASE 
      WHEN EXISTS (
        SELECT 1 FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid
        WHERE n.nspname = 'public' AND p.proname = 'handle_new_user'
      ) 
      THEN '✅ EXISTE'
      ELSE '❌ NO EXISTE'
    END AS estado,
    'Ver código en query separada' AS detalles
),

-- Paso 4: Verificar trigger
trigger_check AS (
  SELECT 
    4 as orden,
    '🔍 PASO 4: Trigger on_auth_user_created' AS verificacion,
    CASE 
      WHEN EXISTS (SELECT 1 FROM information_schema.triggers WHERE trigger_name = 'on_auth_user_created')
      THEN '✅ EXISTE'
      ELSE '❌ NO EXISTE'
    END AS estado,
    COALESCE(
      (SELECT action_timing || ' ' || event_manipulation || ' ON ' || event_object_table
       FROM information_schema.triggers 
       WHERE trigger_name = 'on_auth_user_created' LIMIT 1),
      'N/A'
    ) AS detalles
),

-- Paso 5: Verificar distribución de roles
roles_distribution AS (
  SELECT 
    5 as orden,
    '📊 PASO 5: Distribución de roles' AS verificacion,
    COUNT(*)::text || ' usuarios totales' AS estado,
    string_agg(role || ': ' || count::text, ', ') AS detalles
  FROM (
    SELECT role, COUNT(*) as count 
    FROM public.profiles 
    GROUP BY role 
    ORDER BY count DESC
  ) t
),

-- Paso 6: Verificar constraints
constraint_check AS (
  SELECT 
    6 as orden,
    '🔒 PASO 6: Constraints en role' AS verificacion,
    conname AS estado,
    pg_get_constraintdef(oid) AS detalles
  FROM pg_constraint
  WHERE conrelid = 'public.profiles'::regclass AND conname LIKE '%role%'
  LIMIT 1
)

-- Unir todo en una tabla
SELECT * FROM enum_check
UNION ALL SELECT * FROM column_check
UNION ALL SELECT * FROM function_check
UNION ALL SELECT * FROM trigger_check
UNION ALL SELECT * FROM roles_distribution
UNION ALL SELECT * FROM constraint_check
ORDER BY orden;

-- ============================================
-- QUERY ADICIONAL: Código de la función (si existe)
-- ============================================
SELECT 
  '📜 CÓDIGO DE handle_new_user():' AS info,
  pg_get_functiondef(p.oid) AS codigo_completo
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'handle_new_user';

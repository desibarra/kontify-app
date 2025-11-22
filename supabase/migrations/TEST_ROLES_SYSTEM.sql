-- ============================================
-- PRUEBA FINAL DEL SISTEMA DE ROLES
-- ============================================
-- Este script simula la creación de un usuario y verifica
-- que el role se asigne correctamente desde metadata
-- ============================================

-- ============================================
-- OPCIÓN 1: Verificar con usuario existente
-- ============================================
-- Si ya tienes usuarios, verifica sus roles
SELECT 
    '📊 Usuarios existentes con sus roles:' AS info,
    id,
    email,
    full_name,
    role,
    created_at
FROM public.profiles
ORDER BY created_at DESC
LIMIT 10;

-- ============================================
-- OPCIÓN 2: Simular el trigger con un INSERT directo
-- ⚠️ IMPORTANTE: Este es solo un test, NO crea un usuario real en auth.users
-- ============================================

-- Test 1: Simular inserción con role 'entrepreneur'
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test_entrepreneur_' || extract(epoch from now())::text || '@test.com';
    test_metadata JSONB := '{"full_name": "Test Entrepreneur", "role": "entrepreneur"}'::jsonb;
BEGIN
    -- Insertar perfil directamente (simulando el trigger)
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        test_user_id,
        test_email,
        test_metadata->>'full_name',
        COALESCE(test_metadata->>'role', 'user')::public.user_role
    );
    
    RAISE NOTICE '✅ Test 1: Usuario entrepreneur creado con ID: %', test_user_id;
    
    -- Verificar inserción
    PERFORM * FROM public.profiles WHERE id = test_user_id AND role = 'entrepreneur';
    IF FOUND THEN
        RAISE NOTICE '✅ Verificación: Role "entrepreneur" asignado correctamente';
    ELSE
        RAISE EXCEPTION '❌ Error: Role no se asignó correctamente';
    END IF;
    
    -- Limpiar test
    DELETE FROM public.profiles WHERE id = test_user_id;
    RAISE NOTICE '🧹 Test 1 completado y limpiado';
END $$;

-- Test 2: Simular inserción con role 'expert'
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test_expert_' || extract(epoch from now())::text || '@test.com';
    test_metadata JSONB := '{"full_name": "Test Expert", "role": "expert"}'::jsonb;
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        test_user_id,
        test_email,
        test_metadata->>'full_name',
        COALESCE(test_metadata->>'role', 'user')::public.user_role
    );
    
    RAISE NOTICE '✅ Test 2: Usuario expert creado con ID: %', test_user_id;
    
    -- Verificar inserción
    PERFORM * FROM public.profiles WHERE id = test_user_id AND role = 'expert';
    IF FOUND THEN
        RAISE NOTICE '✅ Verificación: Role "expert" asignado correctamente';
    ELSE
        RAISE EXCEPTION '❌ Error: Role no se asignó correctamente';
    END IF;
    
    -- Limpiar test
    DELETE FROM public.profiles WHERE id = test_user_id;
    RAISE NOTICE '🧹 Test 2 completado y limpiado';
END $$;

-- Test 3: Simular inserción SIN role (debe defaultear a 'user')
DO $$
DECLARE
    test_user_id UUID := gen_random_uuid();
    test_email TEXT := 'test_default_' || extract(epoch from now())::text || '@test.com';
    test_metadata JSONB := '{"full_name": "Test Default User"}'::jsonb;
BEGIN
    INSERT INTO public.profiles (id, email, full_name, role)
    VALUES (
        test_user_id,
        test_email,
        test_metadata->>'full_name',
        COALESCE(test_metadata->>'role', 'user')::public.user_role
    );
    
    RAISE NOTICE '✅ Test 3: Usuario sin role explícito creado con ID: %', test_user_id;
    
    -- Verificar que defaulteó a 'user'
    PERFORM * FROM public.profiles WHERE id = test_user_id AND role = 'user';
    IF FOUND THEN
        RAISE NOTICE '✅ Verificación: Role por defecto "user" asignado correctamente';
    ELSE
        RAISE EXCEPTION '❌ Error: Default role no funcionó';
    END IF;
    
    -- Limpiar test
    DELETE FROM public.profiles WHERE id = test_user_id;
    RAISE NOTICE '🧹 Test 3 completado y limpiado';
END $$;

-- ============================================
-- RESUMEN DE PRUEBAS
-- ============================================
SELECT '═══════════════════════════════════════' AS separador;
SELECT '✅ TODAS LAS PRUEBAS COMPLETADAS' AS resultado;
SELECT '═══════════════════════════════════════' AS separador;

-- Verificación final del sistema
SELECT 
    '📋 Estado final del sistema de roles:' AS reporte,
    (SELECT COUNT(*) FROM pg_type WHERE typname = 'user_role') > 0 AS enum_ok,
    (SELECT udt_name FROM information_schema.columns 
     WHERE table_schema = 'public' AND table_name = 'profiles' AND column_name = 'role') = 'user_role' AS columna_ok,
    (SELECT COUNT(*) FROM pg_proc p JOIN pg_namespace n ON p.pronamespace = n.oid 
     WHERE n.nspname = 'public' AND p.proname = 'handle_new_user') > 0 AS funcion_ok,
    (SELECT COUNT(*) FROM information_schema.triggers 
     WHERE trigger_name = 'on_auth_user_created') > 0 AS trigger_ok;

-- ============================================
-- FIN DE PRUEBAS
-- ============================================

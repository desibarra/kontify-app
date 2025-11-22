-- ============================================================================
-- FIX: RLS POLICIES PARA TABLA PROFILES
-- ============================================================================
-- Ejecutar en Supabase SQL Editor
-- CAMBIOS:
-- - Remover política permisiva "Public profiles are viewable by everyone"
-- - Agregar política restrictiva para usuarios
-- - Agregar políticas para expertos

-- ============================================================================
-- PASO 1: REMOVER POLÍTICA PERMISIVA
-- ============================================================================

DROP POLICY IF EXISTS "Public profiles are viewable by everyone" ON profiles;

-- ============================================================================
-- PASO 2: AGREGAR NUEVA POLÍTICA - Usuarios ven su propio perfil
-- ============================================================================

CREATE POLICY "Users can view own profile"
  ON profiles
  FOR SELECT
  USING (
    auth.uid() = id
  );

-- ============================================================================
-- PASO 3: AGREGAR POLÍTICA - Admins ven todos los perfiles
-- ============================================================================

CREATE POLICY "Admins can view all profiles"
  ON profiles
  FOR SELECT
  USING (
    (
      SELECT role 
      FROM profiles 
      WHERE id = auth.uid()
    ) = 'admin'
  );

-- ============================================================================
-- PASO 4: AGREGAR POLÍTICA - Ver perfiles de expertos activos
-- ============================================================================

CREATE POLICY "Public can view active expert profiles"
  ON profiles
  FOR SELECT
  USING (
    id IN (
      SELECT user_id 
      FROM experts 
      WHERE status = 'active'
    )
  );

-- ============================================================================
-- PASO 5: UPDATE POLICY - Usuarios actualizar su propio perfil
-- ============================================================================

CREATE POLICY "Users can update own profile"
  ON profiles
  FOR UPDATE
  USING (
    auth.uid() = id
  )
  WITH CHECK (
    auth.uid() = id
  );

-- ============================================================================
-- PASO 6: INSERT POLICY - Solo durante signup
-- ============================================================================

CREATE POLICY "Users can create own profile on signup"
  ON profiles
  FOR INSERT
  WITH CHECK (
    auth.uid() = id
  );

-- ============================================================================
-- VERIFICACIÓN
-- ============================================================================

SELECT 
  policy_name,
  qual,
  with_check
FROM pg_policies
WHERE tablename = 'profiles'
ORDER BY policy_name;

-- Fix has_verified_role permissions and security

-- 1. Ensure the function exists with a safe search path and defaults to SECURITY INVOKER
CREATE OR REPLACE FUNCTION public.has_verified_role(_user_id uuid, _role public.app_role)
RETURNS boolean
LANGUAGE sql
STABLE
SET search_path = ''
AS $$
  -- We must fully qualify public.user_roles because search_path is empty
  SELECT EXISTS (
    SELECT 1 
    FROM public.user_roles 
    WHERE user_id = _user_id 
      AND role = _role 
      AND verification = 'verified'
  );
$$;

-- 2. Revoke execute from PUBLIC and anon
REVOKE ALL ON FUNCTION public.has_verified_role(uuid, public.app_role) FROM PUBLIC;
REVOKE ALL ON FUNCTION public.has_verified_role(uuid, public.app_role) FROM anon;

-- 3. Grant execute to authenticated
GRANT EXECUTE ON FUNCTION public.has_verified_role(uuid, public.app_role) TO authenticated;

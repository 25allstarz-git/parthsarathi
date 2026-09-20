
REVOKE ALL ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.has_verified_role(uuid, public.app_role) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.can_read_case(uuid) FROM PUBLIC, anon, authenticated;
REVOKE ALL ON FUNCTION public.register_role(public.app_role, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_role(public.app_role, text) TO authenticated;

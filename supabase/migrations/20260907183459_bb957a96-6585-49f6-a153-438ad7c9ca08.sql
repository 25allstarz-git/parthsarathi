REVOKE ALL ON FUNCTION public.review_lawyer_application(uuid, verification_status, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_lawyer_application(uuid, verification_status, text) TO authenticated;
REVOKE ALL ON FUNCTION public.register_role(app_role, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_role(app_role, text) TO authenticated;
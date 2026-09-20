-- Apply this after the original phone-verification migration on hosted projects.
-- A phone stored on auth.users is not proof that the owner completed the OTP.
CREATE OR REPLACE FUNCTION public.register_role(_role app_role, _credential_id text DEFAULT NULL::text)
 RETURNS user_roles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  _uid uuid := auth.uid();
  _row public.user_roles;
  _status public.verification_status;
  _verified boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _role = 'admin' THEN RAISE EXCEPTION 'Administrator access cannot be self-assigned'; END IF;

  SELECT EXISTS (
    SELECT 1 FROM auth.users u
    WHERE u.id = _uid AND u.phone_confirmed_at IS NOT NULL
  ) INTO _verified;

  SELECT * INTO _row FROM public.user_roles WHERE user_id = _uid LIMIT 1;
  IF FOUND THEN
    IF _row.role = 'citizen' AND _row.verification <> 'verified' AND _verified THEN
      UPDATE public.user_roles SET verification = 'verified' WHERE user_id = _uid RETURNING * INTO _row;
    END IF;
    RETURN _row;
  END IF;

  IF _role = 'citizen' THEN
    IF NOT _verified THEN RAISE EXCEPTION 'Mobile number verification is required before activating a citizen account'; END IF;
    _status := 'verified';
  ELSIF _role = 'lawyer' THEN
    _status := 'pending';
  ELSIF _credential_id IS NOT NULL AND length(trim(_credential_id)) >= 6 THEN
    _status := 'verified';
  ELSE
    _status := 'pending';
  END IF;

  INSERT INTO public.user_roles (user_id, role, verification, credential_id)
  VALUES (_uid, _role, _status, _credential_id) RETURNING * INTO _row;
  RETURN _row;
END; $function$;

REVOKE ALL ON FUNCTION public.register_role(app_role, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.register_role(app_role, text) TO authenticated;

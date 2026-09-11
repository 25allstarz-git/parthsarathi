-- 1. Replace the register_role function to restrict the length >= 6 auto-verification 
-- explicitly to judge and law_enforcement.
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
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _role = 'admin' THEN RAISE EXCEPTION 'Administrator access cannot be self-assigned'; END IF;

  SELECT * INTO _row FROM public.user_roles WHERE user_id = _uid LIMIT 1;
  IF FOUND THEN
    -- If they are a citizen and not yet verified, we can verify them automatically since Google OAuth is trusted.
    IF _row.role = 'citizen' AND _row.verification <> 'verified' THEN
      UPDATE public.user_roles SET verification = 'verified' WHERE user_id = _uid RETURNING * INTO _row;
    END IF;
    RETURN _row;
  END IF;

  IF _role = 'citizen' THEN
    _status := 'verified';
  ELSIF _role = 'lawyer' THEN
    _status := 'pending';
  ELSIF _role IN ('judge', 'law_enforcement') AND _credential_id IS NOT NULL AND length(trim(_credential_id)) >= 6 THEN
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

-- 2. Update the admin review function to use PS-ADV- instead of NYS-ADV-
CREATE OR REPLACE FUNCTION public.review_lawyer_application(_user_id uuid, _decision verification_status, _note text DEFAULT NULL::text)
 RETURNS text
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _uid uuid := auth.uid(); _code text; _attempt int := 0; _exists boolean;
BEGIN
  IF _uid IS NULL OR NOT public.has_role(_uid, 'admin') THEN
    RAISE EXCEPTION 'Only administrators can review advocate applications';
  END IF;
  IF _decision NOT IN ('verified', 'rejected') THEN
    RAISE EXCEPTION 'Decision must be verified or rejected';
  END IF;

  UPDATE public.lawyer_verification_requests
     SET status = _decision, review_note = _note, reviewed_by = _uid, reviewed_at = now()
   WHERE user_id = _user_id;

  IF _decision = 'rejected' THEN
    UPDATE public.user_roles SET verification = 'rejected' WHERE user_id = _user_id AND role = 'lawyer';
    INSERT INTO public.notifications (user_id, title, body, kind)
    VALUES (_user_id, 'Advocate verification not approved',
            COALESCE(_note, 'Your Bar Council credentials could not be verified. You may re-submit with a clearer certificate.'), 'warning');
    RETURN NULL;
  END IF;

  SELECT advocate_code INTO _code FROM public.user_roles WHERE user_id = _user_id AND role = 'lawyer';
  IF _code IS NULL THEN
    LOOP
      _attempt := _attempt + 1;
      _code := 'PS-ADV-' || lpad(((abs(('x' || encode(gen_random_bytes(4), 'hex'))::bit(32)::bigint)) % 1000000)::text, 6, '0');
      SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE advocate_code = _code) INTO _exists;
      EXIT WHEN NOT _exists;
      IF _attempt > 20 THEN RAISE EXCEPTION 'Could not allocate an advocate code'; END IF;
    END LOOP;
  END IF;

  UPDATE public.user_roles SET verification = 'verified', advocate_code = _code
   WHERE user_id = _user_id AND role = 'lawyer';

  INSERT INTO public.notifications (user_id, title, body, kind)
  VALUES (_user_id, 'Advocate verification approved',
          'Your ParthSarathi Advocate Code is ' || _code || ' — use it to sign in.', 'success');

  RETURN _code;
END; $function$;

REVOKE ALL ON FUNCTION public.review_lawyer_application(uuid, verification_status, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.review_lawyer_application(uuid, verification_status, text) TO authenticated;

-- 1. Citizen Aadhaar verification records (server-written only)
CREATE TABLE public.citizen_verifications (
  user_id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  method text NOT NULL DEFAULT 'otp',
  identifier_hash text NOT NULL UNIQUE,
  masked_identifier text NOT NULL,
  verified_at timestamptz,
  consent_given_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.citizen_verifications TO authenticated;
GRANT ALL ON public.citizen_verifications TO service_role;
ALTER TABLE public.citizen_verifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "citizen_verifications_select_own" ON public.citizen_verifications
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE TRIGGER trg_citizen_verifications_updated BEFORE UPDATE ON public.citizen_verifications
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 2. Advocate applications
CREATE TABLE public.lawyer_verification_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  applicant_email text,
  bar_council_number text NOT NULL,
  document_path text,
  document_name text,
  status public.verification_status NOT NULL DEFAULT 'pending',
  review_note text,
  reviewed_by uuid REFERENCES auth.users(id),
  reviewed_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.lawyer_verification_requests TO authenticated;
GRANT ALL ON public.lawyer_verification_requests TO service_role;
ALTER TABLE public.lawyer_verification_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lvr_select_own" ON public.lawyer_verification_requests
  FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "lvr_select_admin" ON public.lawyer_verification_requests
  FOR SELECT TO authenticated USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "lvr_insert_own" ON public.lawyer_verification_requests
  FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());
CREATE POLICY "lvr_update_own_pending" ON public.lawyer_verification_requests
  FOR UPDATE TO authenticated USING (user_id = auth.uid() AND status = 'pending')
  WITH CHECK (user_id = auth.uid() AND status = 'pending');
CREATE TRIGGER trg_lvr_updated BEFORE UPDATE ON public.lawyer_verification_requests
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- 3. Advocate code lives on the private user_roles row
ALTER TABLE public.user_roles ADD COLUMN IF NOT EXISTS advocate_code text;
CREATE UNIQUE INDEX IF NOT EXISTS user_roles_advocate_code_key ON public.user_roles (advocate_code) WHERE advocate_code IS NOT NULL;

-- 4. Registration rules
CREATE OR REPLACE FUNCTION public.register_role(_role app_role, _credential_id text DEFAULT NULL::text)
 RETURNS user_roles
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE _uid uuid := auth.uid(); _row public.user_roles; _status public.verification_status; _verified boolean;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF _role = 'admin' THEN RAISE EXCEPTION 'Administrator access cannot be self-assigned'; END IF;

  SELECT EXISTS (SELECT 1 FROM public.citizen_verifications cv WHERE cv.user_id = _uid AND cv.verified_at IS NOT NULL)
    INTO _verified;

  SELECT * INTO _row FROM public.user_roles WHERE user_id = _uid LIMIT 1;
  IF FOUND THEN
    IF _row.role = 'citizen' AND _row.verification <> 'verified' AND _verified THEN
      UPDATE public.user_roles SET verification = 'verified' WHERE user_id = _uid RETURNING * INTO _row;
    END IF;
    RETURN _row;
  END IF;

  IF _role = 'citizen' THEN
    IF NOT _verified THEN RAISE EXCEPTION 'Aadhaar verification is required before activating a citizen account'; END IF;
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

-- 5. Admin decision on an advocate application
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
      _code := 'NYS-ADV-' || lpad(((abs(('x' || encode(gen_random_bytes(4), 'hex'))::bit(32)::bigint)) % 1000000)::text, 6, '0');
      SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE advocate_code = _code) INTO _exists;
      EXIT WHEN NOT _exists;
      IF _attempt > 20 THEN RAISE EXCEPTION 'Could not allocate an advocate code'; END IF;
    END LOOP;
  END IF;

  UPDATE public.user_roles SET verification = 'verified', advocate_code = _code
   WHERE user_id = _user_id AND role = 'lawyer';

  INSERT INTO public.notifications (user_id, title, body, kind)
  VALUES (_user_id, 'Advocate verification approved',
          'Your NyaySetu Advocate Code is ' || _code || ' — use it to sign in.', 'success');

  RETURN _code;
END; $function$;
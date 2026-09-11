
ALTER TABLE public.cases ADD COLUMN IF NOT EXISTS assigned_lawyer_profile_id uuid REFERENCES public.lawyer_profiles(id) ON DELETE SET NULL;

CREATE OR REPLACE FUNCTION public.respond_to_case(_case_id uuid, _decision public.request_status, _note text DEFAULT NULL)
RETURNS public.cases LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _case public.cases; _profile_id uuid; _lawyer_name text;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  IF NOT public.has_verified_role(_uid, 'lawyer') THEN RAISE EXCEPTION 'Only verified advocates can respond to cases'; END IF;
  SELECT * INTO _case FROM public.cases WHERE id = _case_id;
  IF NOT FOUND THEN RAISE EXCEPTION 'Case not found'; END IF;
  SELECT id, full_name INTO _profile_id, _lawyer_name FROM public.lawyer_profiles WHERE user_id = _uid;

  INSERT INTO public.case_requests (case_id, lawyer_id, lawyer_profile_id, citizen_id, status, note)
  VALUES (_case_id, _uid, _profile_id, _case.citizen_id, _decision, _note)
  ON CONFLICT DO NOTHING;

  UPDATE public.case_requests SET status = _decision, note = COALESCE(_note, note)
  WHERE case_id = _case_id AND lawyer_id = _uid;

  IF _decision = 'accepted' THEN
    IF _case.assigned_lawyer_id IS NOT NULL AND _case.assigned_lawyer_id <> _uid THEN
      RAISE EXCEPTION 'This case has already been assigned';
    END IF;
    UPDATE public.cases SET assigned_lawyer_id = _uid, assigned_lawyer_profile_id = _profile_id, status = 'assigned'
    WHERE id = _case_id RETURNING * INTO _case;
    IF _case.citizen_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, body, kind, case_id)
      VALUES (_case.citizen_id, 'Case accepted', COALESCE(_lawyer_name,'An advocate') || ' has accepted ' || _case.case_number || '. You can now message them securely.', 'success', _case_id);
    END IF;
  ELSE
    IF _case.assigned_lawyer_id = _uid THEN
      UPDATE public.cases SET assigned_lawyer_id = NULL, assigned_lawyer_profile_id = NULL, status = 'pending'
      WHERE id = _case_id RETURNING * INTO _case;
    END IF;
    IF _case.citizen_id IS NOT NULL THEN
      INSERT INTO public.notifications (user_id, title, body, kind, case_id)
      VALUES (_case.citizen_id, 'Case not taken up', COALESCE(_lawyer_name,'An advocate') || ' declined ' || _case.case_number || '. Recommended advocates are available for this matter.', 'warning', _case_id);
    END IF;
  END IF;
  RETURN _case;
END; $$;

REVOKE ALL ON FUNCTION public.respond_to_case(uuid, public.request_status, text) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.respond_to_case(uuid, public.request_status, text) TO authenticated;

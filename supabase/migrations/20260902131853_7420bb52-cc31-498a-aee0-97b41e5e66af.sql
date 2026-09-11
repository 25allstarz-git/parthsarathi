
CREATE TYPE public.app_role AS ENUM ('citizen','lawyer','judge','law_enforcement');
CREATE TYPE public.verification_status AS ENUM ('pending','verified','rejected');
CREATE TYPE public.case_urgency AS ENUM ('critical','high','medium','low');
CREATE TYPE public.case_status AS ENUM ('pending','active','assigned','closed');
CREATE TYPE public.request_status AS ENUM ('pending','accepted','rejected');

CREATE OR REPLACE FUNCTION public.set_updated_at() RETURNS TRIGGER
LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL DEFAULT '',
  email text,
  phone text,
  city text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.profiles TO authenticated;
GRANT ALL ON public.profiles TO service_role;
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_select_own" ON public.profiles FOR SELECT TO authenticated USING (id = auth.uid());
CREATE POLICY "profiles_insert_own" ON public.profiles FOR INSERT TO authenticated WITH CHECK (id = auth.uid());
CREATE POLICY "profiles_update_own" ON public.profiles FOR UPDATE TO authenticated USING (id = auth.uid()) WITH CHECK (id = auth.uid());
CREATE TRIGGER trg_profiles_updated BEFORE UPDATE ON public.profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  verification public.verification_status NOT NULL DEFAULT 'pending',
  credential_id text,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);
GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "user_roles_select_own" ON public.user_roles FOR SELECT TO authenticated USING (user_id = auth.uid());

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role);
$$;

CREATE OR REPLACE FUNCTION public.has_verified_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role AND verification = 'verified');
$$;

CREATE OR REPLACE FUNCTION public.register_role(_role public.app_role, _credential_id text DEFAULT NULL)
RETURNS public.user_roles LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
DECLARE _uid uuid := auth.uid(); _row public.user_roles; _status public.verification_status;
BEGIN
  IF _uid IS NULL THEN RAISE EXCEPTION 'Not authenticated'; END IF;
  SELECT * INTO _row FROM public.user_roles WHERE user_id = _uid LIMIT 1;
  IF FOUND THEN RETURN _row; END IF;
  IF _role = 'citizen' THEN _status := 'verified';
  ELSIF _credential_id IS NOT NULL AND length(trim(_credential_id)) >= 6 THEN _status := 'verified';
  ELSE _status := 'pending'; END IF;
  INSERT INTO public.user_roles (user_id, role, verification, credential_id)
  VALUES (_uid, _role, _status, _credential_id) RETURNING * INTO _row;
  RETURN _row;
END; $$;
GRANT EXECUTE ON FUNCTION public.register_role(public.app_role, text) TO authenticated;

CREATE TABLE public.lawyer_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  specializations text[] NOT NULL DEFAULT '{}',
  experience_years int NOT NULL DEFAULT 0,
  cases_handled int NOT NULL DEFAULT 0,
  success_rate int NOT NULL DEFAULT 0,
  bar_council_id text,
  court text,
  city text,
  languages text[] NOT NULL DEFAULT '{}',
  bio text,
  consultation_fee int NOT NULL DEFAULT 0,
  is_available boolean NOT NULL DEFAULT true,
  rating numeric(2,1) NOT NULL DEFAULT 4.5,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.lawyer_profiles TO authenticated;
GRANT ALL ON public.lawyer_profiles TO service_role;
ALTER TABLE public.lawyer_profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "lawyers_readable_by_signed_in" ON public.lawyer_profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "lawyers_insert_own" ON public.lawyer_profiles FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid() AND public.has_role(auth.uid(),'lawyer'));
CREATE POLICY "lawyers_update_own" ON public.lawyer_profiles FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());
CREATE TRIGGER trg_lawyer_updated BEFORE UPDATE ON public.lawyer_profiles FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.cases (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_number text NOT NULL UNIQUE,
  filing_number text,
  title text NOT NULL,
  description text,
  category text NOT NULL DEFAULT 'General',
  urgency public.case_urgency NOT NULL DEFAULT 'medium',
  status public.case_status NOT NULL DEFAULT 'pending',
  court text,
  parties jsonb NOT NULL DEFAULT '[]'::jsonb,
  citizen_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  assigned_lawyer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  is_demo boolean NOT NULL DEFAULT false,
  processing_stage text NOT NULL DEFAULT 'complete',
  filed_on date DEFAULT current_date,
  next_hearing date,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_cases_citizen ON public.cases(citizen_id);
CREATE INDEX idx_cases_lawyer ON public.cases(assigned_lawyer_id);
GRANT SELECT, INSERT, UPDATE ON public.cases TO authenticated;
GRANT ALL ON public.cases TO service_role;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;
CREATE POLICY "cases_select_citizen" ON public.cases FOR SELECT TO authenticated USING (citizen_id = auth.uid());
CREATE POLICY "cases_select_assigned_lawyer" ON public.cases FOR SELECT TO authenticated USING (assigned_lawyer_id = auth.uid());
CREATE POLICY "cases_select_queue_lawyer" ON public.cases FOR SELECT TO authenticated USING (status = 'pending' AND public.has_verified_role(auth.uid(),'lawyer'));
CREATE POLICY "cases_select_judicial" ON public.cases FOR SELECT TO authenticated USING (public.has_verified_role(auth.uid(),'judge') OR public.has_verified_role(auth.uid(),'law_enforcement'));
CREATE POLICY "cases_insert_own" ON public.cases FOR INSERT TO authenticated WITH CHECK (citizen_id = auth.uid());
CREATE POLICY "cases_update_own" ON public.cases FOR UPDATE TO authenticated USING (citizen_id = auth.uid()) WITH CHECK (citizen_id = auth.uid());
CREATE POLICY "cases_update_assigned_lawyer" ON public.cases FOR UPDATE TO authenticated USING (assigned_lawyer_id = auth.uid()) WITH CHECK (assigned_lawyer_id = auth.uid());
CREATE TRIGGER trg_cases_updated BEFORE UPDATE ON public.cases FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE TABLE public.case_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  lawyer_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  lawyer_profile_id uuid REFERENCES public.lawyer_profiles(id) ON DELETE CASCADE,
  citizen_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  status public.request_status NOT NULL DEFAULT 'pending',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.case_requests TO authenticated;
GRANT ALL ON public.case_requests TO service_role;
ALTER TABLE public.case_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY "requests_select_citizen" ON public.case_requests FOR SELECT TO authenticated USING (citizen_id = auth.uid());
CREATE POLICY "requests_select_lawyer" ON public.case_requests FOR SELECT TO authenticated USING (lawyer_id = auth.uid());
CREATE POLICY "requests_insert_citizen" ON public.case_requests FOR INSERT TO authenticated WITH CHECK (citizen_id = auth.uid());
CREATE POLICY "requests_update_lawyer" ON public.case_requests FOR UPDATE TO authenticated USING (lawyer_id = auth.uid()) WITH CHECK (lawyer_id = auth.uid());
CREATE POLICY "requests_update_citizen" ON public.case_requests FOR UPDATE TO authenticated USING (citizen_id = auth.uid()) WITH CHECK (citizen_id = auth.uid());
CREATE TRIGGER trg_requests_updated BEFORE UPDATE ON public.case_requests FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE OR REPLACE FUNCTION public.can_read_case(_case_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.cases c WHERE c.id = _case_id AND (
      c.citizen_id = auth.uid()
      OR c.assigned_lawyer_id = auth.uid()
      OR (public.has_verified_role(auth.uid(),'lawyer') AND (c.status = 'pending' OR EXISTS (
            SELECT 1 FROM public.case_requests r WHERE r.case_id = c.id AND r.lawyer_id = auth.uid())))
      OR public.has_verified_role(auth.uid(),'judge')
      OR public.has_verified_role(auth.uid(),'law_enforcement')
    ));
$$;

CREATE TABLE public.case_documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  storage_path text,
  mime_type text,
  size_bytes bigint NOT NULL DEFAULT 0,
  page_count int,
  ocr_text text,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, DELETE ON public.case_documents TO authenticated;
GRANT ALL ON public.case_documents TO service_role;
ALTER TABLE public.case_documents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "docs_select" ON public.case_documents FOR SELECT TO authenticated USING (public.can_read_case(case_id));
CREATE POLICY "docs_insert" ON public.case_documents FOR INSERT TO authenticated WITH CHECK (uploaded_by = auth.uid() AND public.can_read_case(case_id));
CREATE POLICY "docs_delete_own" ON public.case_documents FOR DELETE TO authenticated USING (uploaded_by = auth.uid());

CREATE TABLE public.case_analyses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  summary text NOT NULL DEFAULT '',
  category text,
  urgency public.case_urgency,
  urgency_reason text,
  extracted_facts jsonb NOT NULL DEFAULT '[]'::jsonb,
  key_dates jsonb NOT NULL DEFAULT '[]'::jsonb,
  parties jsonb NOT NULL DEFAULT '[]'::jsonb,
  legal_insights jsonb NOT NULL DEFAULT '[]'::jsonb,
  similar_cases jsonb NOT NULL DEFAULT '[]'::jsonb,
  precedents jsonb NOT NULL DEFAULT '[]'::jsonb,
  recommended_specializations text[] NOT NULL DEFAULT '{}',
  model text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.case_analyses TO authenticated;
GRANT ALL ON public.case_analyses TO service_role;
ALTER TABLE public.case_analyses ENABLE ROW LEVEL SECURITY;
CREATE POLICY "analyses_select" ON public.case_analyses FOR SELECT TO authenticated USING (public.can_read_case(case_id));
CREATE POLICY "analyses_insert" ON public.case_analyses FOR INSERT TO authenticated WITH CHECK (public.can_read_case(case_id));

CREATE TABLE public.case_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid NOT NULL REFERENCES public.cases(id) ON DELETE CASCADE,
  sender_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  sender_name text NOT NULL DEFAULT '',
  sender_role public.app_role NOT NULL DEFAULT 'citizen',
  body text NOT NULL DEFAULT '',
  attachment_name text,
  attachment_path text,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_messages_case ON public.case_messages(case_id, created_at);
GRANT SELECT, INSERT ON public.case_messages TO authenticated;
GRANT ALL ON public.case_messages TO service_role;
ALTER TABLE public.case_messages ENABLE ROW LEVEL SECURITY;
CREATE POLICY "messages_select" ON public.case_messages FOR SELECT TO authenticated USING (
  EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.citizen_id = auth.uid() OR c.assigned_lawyer_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM public.case_requests r WHERE r.case_id = case_id AND (r.lawyer_id = auth.uid() OR r.citizen_id = auth.uid())));
CREATE POLICY "messages_insert" ON public.case_messages FOR INSERT TO authenticated WITH CHECK (
  sender_id = auth.uid() AND (
  EXISTS (SELECT 1 FROM public.cases c WHERE c.id = case_id AND (c.citizen_id = auth.uid() OR c.assigned_lawyer_id = auth.uid()))
  OR EXISTS (SELECT 1 FROM public.case_requests r WHERE r.case_id = case_id AND (r.lawyer_id = auth.uid() OR r.citizen_id = auth.uid()))));

CREATE TABLE public.hearings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  case_number text NOT NULL,
  court text NOT NULL,
  court_room text,
  judge_name text,
  party_name text,
  hearing_date date NOT NULL,
  hearing_time text,
  purpose text,
  status text NOT NULL DEFAULT 'scheduled',
  item_no int,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX idx_hearings_date ON public.hearings(hearing_date);
GRANT SELECT ON public.hearings TO authenticated;
GRANT ALL ON public.hearings TO service_role;
ALTER TABLE public.hearings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "hearings_select_signed_in" ON public.hearings FOR SELECT TO authenticated USING (true);

CREATE TABLE public.notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title text NOT NULL,
  body text,
  kind text NOT NULL DEFAULT 'info',
  case_id uuid REFERENCES public.cases(id) ON DELETE CASCADE,
  is_read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE ON public.notifications TO authenticated;
GRANT ALL ON public.notifications TO service_role;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "notifications_select_own" ON public.notifications FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "notifications_insert" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "notifications_update_own" ON public.notifications FOR UPDATE TO authenticated USING (user_id = auth.uid()) WITH CHECK (user_id = auth.uid());

CREATE TABLE public.precedents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  citation text NOT NULL,
  title text NOT NULL,
  court text NOT NULL,
  year int NOT NULL,
  category text NOT NULL,
  holding text NOT NULL,
  relevance_note text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT ON public.precedents TO authenticated;
GRANT ALL ON public.precedents TO service_role;
ALTER TABLE public.precedents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "precedents_select_signed_in" ON public.precedents FOR SELECT TO authenticated USING (true);

CREATE TABLE public.access_log (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  action text NOT NULL,
  target text,
  created_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT ON public.access_log TO authenticated;
GRANT ALL ON public.access_log TO service_role;
ALTER TABLE public.access_log ENABLE ROW LEVEL SECURITY;
CREATE POLICY "access_log_own" ON public.access_log FOR SELECT TO authenticated USING (user_id = auth.uid());
CREATE POLICY "access_log_insert_own" ON public.access_log FOR INSERT TO authenticated WITH CHECK (user_id = auth.uid());

INSERT INTO public.lawyer_profiles (full_name, specializations, experience_years, cases_handled, success_rate, bar_council_id, court, city, languages, bio, consultation_fee, is_available, rating) VALUES
('Adv. Meera Krishnan', ARRAY['Family Law','Matrimonial Disputes','Domestic Violence'], 14, 412, 78, 'BCI/DL/2011/4482', 'Delhi High Court', 'New Delhi', ARRAY['English','Hindi','Malayalam'], 'Practices primarily in matrimonial and family disputes before the Delhi High Court and district family courts, with a focus on mediated settlements.', 3500, true, 4.8),
('Adv. Rajat Bhargava', ARRAY['Criminal Law','Bail Matters','Economic Offences'], 19, 690, 71, 'BCI/MH/2006/1183', 'Bombay High Court', 'Mumbai', ARRAY['English','Hindi','Marathi'], 'Criminal defence counsel with extensive trial experience in economic offences and anticipatory bail before the Bombay High Court.', 6000, true, 4.7),
('Adv. Sneha Patil', ARRAY['Property Law','Land Disputes','Succession'], 11, 305, 74, 'BCI/MH/2014/7719', 'Bombay High Court', 'Pune', ARRAY['English','Marathi','Hindi'], 'Advises on title verification, partition suits and succession certificates across Maharashtra revenue and civil courts.', 2800, true, 4.6),
('Adv. Arun Deshpande', ARRAY['Consumer Protection','Insurance Claims','Service Deficiency'], 9, 248, 82, 'BCI/KA/2016/2290', 'Karnataka State Consumer Commission', 'Bengaluru', ARRAY['English','Kannada','Hindi'], 'Appears regularly before district and state consumer commissions in insurance repudiation and builder-delay matters.', 2200, true, 4.5),
('Adv. Fatima Sheikh', ARRAY['Labour & Employment','Industrial Disputes','Wrongful Termination'], 16, 377, 69, 'BCI/TG/2009/5561', 'Telangana High Court', 'Hyderabad', ARRAY['English','Telugu','Urdu','Hindi'], 'Represents workmen and unions in industrial disputes, gratuity and wrongful termination references.', 3200, false, 4.6),
('Adv. Vikram Nair', ARRAY['Cyber Law','Data Protection','Financial Fraud'], 8, 164, 76, 'BCI/KL/2017/8834', 'Kerala High Court', 'Kochi', ARRAY['English','Malayalam','Hindi'], 'Handles online financial fraud, IT Act prosecutions and data-protection compliance advisory.', 4000, true, 4.7),
('Adv. Priya Raghavan', ARRAY['Constitutional Law','Writ Petitions','Public Interest Litigation'], 22, 520, 66, 'BCI/TN/2003/1027', 'Madras High Court', 'Chennai', ARRAY['English','Tamil','Hindi'], 'Senior counsel appearing in constitutional challenges, service writs and public interest litigation.', 8500, true, 4.9),
('Adv. Harpreet Singh', ARRAY['Motor Accident Claims','Personal Injury','Insurance Claims'], 12, 431, 80, 'BCI/PB/2013/3345', 'Punjab & Haryana High Court', 'Chandigarh', ARRAY['English','Punjabi','Hindi'], 'Focuses on Motor Accident Claims Tribunal compensation matters and insurer liability disputes.', 2500, true, 4.5),
('Adv. Ananya Bose', ARRAY['Corporate Law','Contract Disputes','Arbitration'], 15, 288, 73, 'BCI/WB/2010/6602', 'Calcutta High Court', 'Kolkata', ARRAY['English','Bengali','Hindi'], 'Commercial disputes counsel with a practice in domestic arbitration and shareholder disputes.', 5500, true, 4.6),
('Adv. Mohan Yadav', ARRAY['Criminal Law','Cheque Bounce','Recovery'], 7, 196, 84, 'BCI/UP/2018/9911', 'Allahabad High Court', 'Lucknow', ARRAY['English','Hindi'], 'Handles Section 138 Negotiable Instruments Act prosecutions and summary recovery matters.', 1800, true, 4.4);

INSERT INTO public.cases (case_number, filing_number, title, description, category, urgency, status, court, parties, is_demo, filed_on, next_hearing) VALUES
('W.P.(C) 1189/2026','DLHC/WP/001189/2026','Sunita Rathore v. Delhi Development Authority','Writ petition challenging cancellation of an allotted plot without a hearing.','Constitutional Law','high','active','Delhi High Court','[{"role":"Petitioner","name":"Sunita Rathore"},{"role":"Respondent","name":"Delhi Development Authority"}]',true,'2026-02-11','2026-09-14'),
('CRL.A. 482/2026','BHC/CRLA/000482/2026','State of Maharashtra v. Nikhil Sawant','Appeal against conviction under Sections 420 and 468 IPC in a housing investment scheme.','Criminal Law','critical','active','Bombay High Court','[{"role":"Appellant","name":"Nikhil Sawant"},{"role":"Respondent","name":"State of Maharashtra"}]',true,'2026-01-28','2026-09-09'),
('C.S. 774/2026','MHC/CS/000774/2026','Ramesh Iyer v. Lakshmi Iyer','Partition suit concerning ancestral property in Mylapore between siblings.','Property Law','medium','pending','Madras High Court','[{"role":"Plaintiff","name":"Ramesh Iyer"},{"role":"Defendant","name":"Lakshmi Iyer"}]',true,'2026-03-19','2026-09-22'),
('CC/318/2026','KSCDRC/CC/000318/2026','Anil Kumar v. Sunrise Constructions Pvt Ltd','Consumer complaint for possession delay of 41 months and refund with interest.','Consumer Protection','high','pending','Karnataka State Consumer Commission','[{"role":"Complainant","name":"Anil Kumar"},{"role":"Opposite Party","name":"Sunrise Constructions Pvt Ltd"}]',true,'2026-04-02','2026-09-11'),
('MACP 209/2026','PHHC/MACP/000209/2026','Gurpreet Kaur v. Northern Insurance Co. Ltd','Motor accident compensation claim following a fatal highway collision on NH-44.','Motor Accident Claims','high','active','Punjab & Haryana High Court','[{"role":"Claimant","name":"Gurpreet Kaur"},{"role":"Respondent","name":"Northern Insurance Co. Ltd"}]',true,'2026-02-24','2026-09-16'),
('HMA 611/2026','DLHC/HMA/000611/2026','Kavita Sharma v. Deepak Sharma','Petition for dissolution of marriage with interim maintenance under Section 24 HMA.','Family Law','medium','pending','Delhi High Court','[{"role":"Petitioner","name":"Kavita Sharma"},{"role":"Respondent","name":"Deepak Sharma"}]',true,'2026-05-06','2026-09-19'),
('ID 87/2026','TGHC/ID/000087/2026','Telangana Workers Union v. Deccan Textiles Ltd','Industrial dispute over retrenchment of 68 workmen without statutory notice.','Labour & Employment','critical','active','Telangana High Court','[{"role":"Applicant","name":"Telangana Workers Union"},{"role":"Respondent","name":"Deccan Textiles Ltd"}]',true,'2026-01-15','2026-09-08'),
('CRL.M.C. 1442/2026','KHC/CRLMC/001442/2026','Rahul Menon v. State of Kerala','Quashing petition in an IT Act matter arising from an alleged phishing network.','Cyber Law','high','pending','Kerala High Court','[{"role":"Petitioner","name":"Rahul Menon"},{"role":"Respondent","name":"State of Kerala"}]',true,'2026-04-21','2026-09-25'),
('ARB.P. 96/2026','CHC/ARBP/000096/2026','Bose Enterprises v. Eastern Logistics Ltd','Application under Section 11 for appointment of an arbitrator in a freight contract dispute.','Corporate Law','low','pending','Calcutta High Court','[{"role":"Applicant","name":"Bose Enterprises"},{"role":"Respondent","name":"Eastern Logistics Ltd"}]',true,'2026-06-01','2026-10-02'),
('CC/1207/2026','ALD/CC/001207/2026','Shalini Verma v. Manoj Traders','Complaint under Section 138 of the Negotiable Instruments Act for dishonoured cheques.','Criminal Law','medium','closed','Allahabad High Court','[{"role":"Complainant","name":"Shalini Verma"},{"role":"Accused","name":"Manoj Traders"}]',true,'2025-11-12',NULL),
('W.P.(C) 2033/2026','TNHC/WP/002033/2026','Coastal Fishermen Welfare Assn v. State of Tamil Nadu','Public interest litigation on rehabilitation of displaced fishing families.','Constitutional Law','medium','active','Madras High Court','[{"role":"Petitioner","name":"Coastal Fishermen Welfare Assn"},{"role":"Respondent","name":"State of Tamil Nadu"}]',true,'2026-03-05','2026-09-29'),
('O.S. 455/2026','BCC/OS/000455/2026','Farida Begum v. Hyderabad Municipal Corporation','Suit for injunction against demolition of a residential structure pending title dispute.','Property Law','critical','active','Telangana High Court','[{"role":"Plaintiff","name":"Farida Begum"},{"role":"Defendant","name":"Hyderabad Municipal Corporation"}]',true,'2026-05-27','2026-09-10');

INSERT INTO public.hearings (case_id, case_number, court, court_room, judge_name, party_name, hearing_date, hearing_time, purpose, status, item_no)
SELECT c.id, c.case_number, c.court, 'Court No. ' || ((row_number() OVER (ORDER BY c.case_number)) % 9 + 1),
  (ARRAY['Hon''ble Justice A. R. Menon','Hon''ble Justice S. Kulkarni','Hon''ble Justice N. Bhatt','Hon''ble Justice L. Ramanathan','Hon''ble Justice P. Chatterjee'])[(row_number() OVER (ORDER BY c.case_number)) % 5 + 1],
  (c.parties->0->>'name'),
  COALESCE(c.next_hearing, current_date + 21),
  (ARRAY['10:30 AM','11:15 AM','12:00 PM','02:15 PM','03:00 PM'])[(row_number() OVER (ORDER BY c.case_number)) % 5 + 1],
  (ARRAY['Final arguments','Framing of issues','Interim application','Evidence','Directions','Admission'])[(row_number() OVER (ORDER BY c.case_number)) % 6 + 1],
  'scheduled', (row_number() OVER (ORDER BY c.case_number))::int
FROM public.cases c WHERE c.is_demo;

INSERT INTO public.hearings (case_id, case_number, court, court_room, judge_name, party_name, hearing_date, hearing_time, purpose, status, item_no)
SELECT c.id, c.case_number, c.court, 'Court No. 4', 'Hon''ble Justice A. R. Menon', (c.parties->0->>'name'), current_date,
  (ARRAY['10:30 AM','11:00 AM','11:45 AM','02:30 PM','03:45 PM'])[(row_number() OVER (ORDER BY c.case_number)) % 5 + 1],
  (ARRAY['Mentioning','Interim application','Directions','Evidence','Final arguments'])[(row_number() OVER (ORDER BY c.case_number)) % 5 + 1],
  'listed', (row_number() OVER (ORDER BY c.case_number))::int
FROM public.cases c WHERE c.is_demo LIMIT 8;

INSERT INTO public.precedents (citation, title, court, year, category, holding, relevance_note) VALUES
('(1978) 1 SCC 248','Maneka Gandhi v. Union of India','Supreme Court of India',1978,'Constitutional Law','Procedure established by law under Article 21 must be fair, just and reasonable, not arbitrary or oppressive.','Cited where an administrative order is passed without affording a hearing.'),
('(1997) 6 SCC 241','Vishaka v. State of Rajasthan','Supreme Court of India',1997,'Labour & Employment','Laid down binding guidelines on prevention of sexual harassment at the workplace pending legislation.','Relevant to workplace grievance and employer duty of care.'),
('(2014) 8 SCC 273','Arnesh Kumar v. State of Bihar','Supreme Court of India',2014,'Criminal Law','Police must justify the necessity of arrest for offences punishable up to seven years; notice under Section 41A is the norm.','Frequently relied on in bail and anticipatory bail applications.'),
('(2017) 10 SCC 1','Justice K. S. Puttaswamy v. Union of India','Supreme Court of India',2017,'Cyber Law','Recognised informational privacy as a fundamental right under Article 21.','Cited in data-protection and surveillance challenges.'),
('(2006) 4 SCC 1','Rameshwari Devi v. State of Bihar','Supreme Court of India',2006,'Family Law','Clarified entitlement to family pension where the validity of a second marriage was in question.','Useful in maintenance and succession disputes.'),
('(2019) 8 SCC 416','Perry Kansagra v. Smriti Madan Kansagra','Supreme Court of India',2019,'Family Law','Welfare of the child is the paramount consideration in custody determinations.','Cited in contested custody and visitation matters.'),
('(2004) 3 SCC 1','Rajesh Kumar v. Oriental Insurance','Supreme Court of India',2004,'Motor Accident Claims','Just compensation must account for future prospects and consortium.','Applied in fatal-accident compensation computation.'),
('(2020) 5 SCC 757','Pioneer Urban Land v. Govindan Raghavan','Supreme Court of India',2020,'Consumer Protection','One-sided builder-buyer agreement clauses amount to unfair trade practice.','Directly relevant to possession-delay refund claims.'),
('(2010) 8 SCC 24','Central Inland Water Transport v. Brojo Nath','Supreme Court of India',2010,'Labour & Employment','Unconscionable service contract terms are void as opposed to public policy.','Cited in wrongful termination references.'),
('(2021) 2 SCC 1','Vidya Drolia v. Durga Trading Corporation','Supreme Court of India',2021,'Corporate Law','Set out the scope of arbitrability and the referral court''s limited review under Section 11.','Applied in Section 11 arbitrator appointment applications.'),
('(2018) 1 SCC 130','Shayara Bano v. Union of India','Supreme Court of India',2018,'Family Law','Instant triple talaq held unconstitutional and set aside.','Cited in matrimonial validity disputes.'),
('(2012) 6 SCC 353','Suresh Kumar Koushal v. Naz Foundation','Supreme Court of India',2012,'Constitutional Law','Discussed the standard for judicial review of statutory provisions on constitutional grounds.','Cited for review-standard propositions.');

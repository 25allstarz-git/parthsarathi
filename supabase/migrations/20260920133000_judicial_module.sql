-- Create extension for pgvector if it doesn't exist
CREATE EXTENSION IF NOT EXISTS vector;

-- Table: judicial_cases
CREATE TABLE IF NOT EXISTS public.judicial_cases (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_number TEXT NOT NULL,
    title TEXT,
    description TEXT,
    ai_summary TEXT,
    urgency_level TEXT CHECK (urgency_level IN ('high', 'medium', 'low', 'unknown')) DEFAULT 'unknown',
    legal_category TEXT,
    missing_info_flags TEXT[],
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    created_by UUID REFERENCES auth.users(id)
);

-- Table: judicial_events (for timeline)
CREATE TABLE IF NOT EXISTS public.judicial_events (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID REFERENCES public.judicial_cases(id) ON DELETE CASCADE,
    event_date DATE,
    event_description TEXT NOT NULL,
    extracted_entities JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: judicial_embeddings (for semantic search)
CREATE TABLE IF NOT EXISTS public.judicial_embeddings (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID REFERENCES public.judicial_cases(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    embedding vector(768), -- adjust dimension based on gemini embedding model
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Table: judicial_audit_logs
CREATE TABLE IF NOT EXISTS public.judicial_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    case_id UUID REFERENCES public.judicial_cases(id) ON DELETE SET NULL,
    user_id UUID REFERENCES auth.users(id),
    action TEXT NOT NULL,
    accessed_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.judicial_cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judicial_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judicial_embeddings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.judicial_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check for judicial role
CREATE OR REPLACE FUNCTION public.is_judicial_user()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (auth.jwt() -> 'app_metadata' ->> 'role') = 'judicial_role';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- RLS Policies
CREATE POLICY "Judicial users can view all cases" ON public.judicial_cases
    FOR SELECT USING (public.is_judicial_user());

CREATE POLICY "Judicial users can insert cases" ON public.judicial_cases
    FOR INSERT WITH CHECK (public.is_judicial_user());

CREATE POLICY "Judicial users can update cases" ON public.judicial_cases
    FOR UPDATE USING (public.is_judicial_user());

CREATE POLICY "Judicial users can view case events" ON public.judicial_events
    FOR SELECT USING (public.is_judicial_user());

CREATE POLICY "Judicial users can insert case events" ON public.judicial_events
    FOR INSERT WITH CHECK (public.is_judicial_user());

CREATE POLICY "Judicial users can view embeddings" ON public.judicial_embeddings
    FOR SELECT USING (public.is_judicial_user());

CREATE POLICY "Judicial users can insert embeddings" ON public.judicial_embeddings
    FOR INSERT WITH CHECK (public.is_judicial_user());

CREATE POLICY "Judicial users can view audit logs" ON public.judicial_audit_logs
    FOR SELECT USING (public.is_judicial_user());

CREATE POLICY "Users can insert their own audit logs" ON public.judicial_audit_logs
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage setup (if not already existing)
INSERT INTO storage.buckets (id, name, public) 
VALUES ('judicial_documents', 'judicial_documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS
CREATE POLICY "Judicial users can view documents" ON storage.objects
    FOR SELECT USING (bucket_id = 'judicial_documents' AND public.is_judicial_user());

CREATE POLICY "Judicial users can upload documents" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'judicial_documents' AND public.is_judicial_user());

-- Trigger to log case access (on select) - Note: Postgres triggers on SELECT are not standard. 
-- For strict audit logging of SELECTs, we must insert explicitly via API/RPC.

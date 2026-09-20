-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Add embedding column to precedents
ALTER TABLE precedents ADD COLUMN IF NOT EXISTS embedding vector(768);

-- Create case_embeddings table
CREATE TABLE IF NOT EXISTS case_embeddings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    case_id uuid NOT NULL REFERENCES cases(id) ON DELETE CASCADE,
    embedding vector(768) NOT NULL,
    created_at timestamptz DEFAULT now()
);

-- Add indexes for vector operations
CREATE INDEX IF NOT EXISTS precedents_embedding_idx ON precedents USING ivfflat (embedding vector_cosine_ops);
CREATE INDEX IF NOT EXISTS case_embeddings_embedding_idx ON case_embeddings USING ivfflat (embedding vector_cosine_ops);

-- Enable RLS on case_embeddings
ALTER TABLE case_embeddings ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for case_embeddings (broad read access like case_analyses)
CREATE POLICY "Enable read access for all users" ON case_embeddings FOR SELECT USING (true);
CREATE POLICY "Enable insert for authenticated users" ON case_embeddings FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Enable update for authenticated users" ON case_embeddings FOR UPDATE TO authenticated USING (true);

-- Create match_precedents RPC
CREATE OR REPLACE FUNCTION match_precedents(query_embedding vector(768), match_count int DEFAULT 8)
RETURNS TABLE (
    id uuid,
    citation text,
    title text,
    court text,
    year int,
    category text,
    holding text,
    similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
    RETURN QUERY
    SELECT
        p.id,
        p.citation,
        p.title,
        p.court,
        p.year,
        p.category,
        p.holding,
        1 - (p.embedding <=> query_embedding) AS similarity
    FROM precedents p
    WHERE p.embedding IS NOT NULL
    ORDER BY p.embedding <=> query_embedding
    LIMIT match_count;
END;
$$;

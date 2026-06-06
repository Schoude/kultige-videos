-- ==========================================
-- STEP 1: Prepare the Table and Vector Column
-- ==========================================

-- Drop the old column if it exists to avoid type conflicts
ALTER TABLE public.videos DROP COLUMN IF EXISTS fts;

-- Add the new bilingually generated FTS column
ALTER TABLE public.videos
ADD COLUMN fts tsvector
GENERATED ALWAYS AS (
  to_tsvector('german', coalesce(title,'') || ' ' || coalesce(description,'')) ||
  to_tsvector('english', coalesce(title,'') || ' ' || coalesce(description,''))
) STORED;


-- ==========================================
-- STEP 2: Optimize with a GIN Index
-- ==========================================

CREATE INDEX IF NOT EXISTS videos_fts_gin
ON public.videos
USING gin (fts);


CREATE INDEX IF NOT EXISTS videos_title_trgm_idx
ON public.videos USING gin (title gin_trgm_ops);

CREATE INDEX IF NOT EXISTS videos_desc_trgm_idx
ON public.videos USING gin (description gin_trgm_ops);

-- ==========================================
-- STEP 3: Create the Bilingual Search Function
-- ==========================================

-- 1. Drop the function to reset the return signature
DROP FUNCTION IF EXISTS public.search_videos_ranked(text);

-- 2. Recreate with the updated column types and new url_id column
CREATE OR REPLACE FUNCTION public.search_videos_ranked(
  query text
)
RETURNS TABLE (
  id uuid,
  title text,
  description text,
  view_count int4,
  url_id varchar,
  rank real
)
LANGUAGE plpgsql
AS $$
DECLARE
  search_query tsquery := websearch_to_tsquery('english', query) ||
                          websearch_to_tsquery('german', query);
BEGIN
  RETURN QUERY
  SELECT
    v.id,
    v.title,
    v.description,
    v.view_count,
    v.url_id,
    -- Combine FTS rank with Trigram similarity scores (weighted)
    (
      ts_rank(v.fts, search_query) +
      (similarity(v.title, query) * 2.0) + -- Title typos handled
      coalesce(similarity(v.description, query), 0) -- Description typos handled
    )::real AS rank
  FROM public.videos v
  WHERE
    v.fts @@ search_query  -- Matches FTS rules OR...
    OR v.title % query     -- Matches fuzzy title OR...
    OR v.description % query -- Matches fuzzy description
  ORDER BY rank DESC;
END;
$$;

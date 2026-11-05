-- ==============================================================================
-- LetterGarden Database Schema, Indexes, and Full-Text Search Migration
-- Target Database: PostgreSQL 15+ (Supabase)
-- ==============================================================================

-- 1. Enable UUID Extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. Public Letters Table
CREATE TABLE IF NOT EXISTS public_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    share_code VARCHAR(12) NOT NULL UNIQUE,
    recipient VARCHAR(100) NOT NULL,
    author VARCHAR(100),
    content TEXT NOT NULL,
    flowers JSONB NOT NULL DEFAULT '[]'::jsonb,
    handwriting VARCHAR(50) NOT NULL DEFAULT 'dancing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Private Gardens (Rooms/Spaces) Table
CREATE TABLE IF NOT EXISTS gardens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code VARCHAR(8) NOT NULL UNIQUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Private Letters Table
CREATE TABLE IF NOT EXISTS private_letters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    garden_id UUID NOT NULL REFERENCES gardens(id) ON DELETE CASCADE,
    share_code VARCHAR(12) NOT NULL UNIQUE,
    recipient VARCHAR(100) NOT NULL,
    author VARCHAR(100),
    content TEXT NOT NULL,
    flowers JSONB NOT NULL DEFAULT '[]'::jsonb,
    handwriting VARCHAR(50) NOT NULL DEFAULT 'dancing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ==============================================================================
-- INDEXING STRATEGY
-- ==============================================================================

-- Index 1: B-Tree Index on public_letters(created_at DESC)
-- RATIONALE: Optimizes server-side range pagination (ORDER BY created_at DESC LIMIT X OFFSET Y).
-- Converts an O(N) sequential table scan + memory sort into an O(log N) index scan backward.
CREATE INDEX IF NOT EXISTS idx_public_letters_created_at 
ON public_letters (created_at DESC);

-- Index 2: B-Tree Unique Index on public_letters(share_code)
-- RATIONALE: Enables O(1) point lookups when deep-linking to a single note (/note/[code]).
CREATE UNIQUE INDEX IF NOT EXISTS idx_public_letters_share_code 
ON public_letters (share_code);

-- Index 3: B-Tree Unique Index on gardens(code)
-- RATIONALE: Enables O(1) verification when users enter or share a private garden code.
CREATE UNIQUE INDEX IF NOT EXISTS idx_gardens_code 
ON gardens (code);

-- Index 4: Composite B-Tree Index on private_letters(garden_id, created_at DESC)
-- RATIONALE: Satisfies both the foreign-key filter (WHERE garden_id = ?) and the sort
-- (ORDER BY created_at DESC) in a single unified index traversal.
CREATE INDEX IF NOT EXISTS idx_private_letters_garden_created 
ON private_letters (garden_id, created_at DESC);

-- Index 5: B-Tree Unique Index on private_letters(share_code)
CREATE UNIQUE INDEX IF NOT EXISTS idx_private_letters_share_code 
ON private_letters (share_code);

-- ==============================================================================
-- FULL-TEXT SEARCH (FTS) CONFIGURATION
-- ==============================================================================

-- Add generated tsvector column combining recipient, author, and note content
ALTER TABLE public_letters 
ADD COLUMN IF NOT EXISTS search_vector tsvector 
GENERATED ALWAYS AS (
    to_tsvector('english', 
        coalesce(recipient, '') || ' ' || 
        coalesce(author, '') || ' ' || 
        coalesce(content, '')
    )
) STORED;

-- Index 6: GIN (Generalized Inverted Index) on search_vector
-- RATIONALE: GIN maps individual lexemes to list of matching row IDs, enabling sub-millisecond
-- full-text search across thousands of letters using @@ websearch_to_tsquery().
CREATE INDEX IF NOT EXISTS idx_public_letters_fts 
ON public_letters USING GIN (search_vector);

-- ================================================================
-- DDL: Add denormalized columns, create view, set up RLS
-- Data population happens in seed.sql (runs after migrations)
-- ================================================================

-- topics: frontend expects company_name, university_name, field_names, field_ids
ALTER TABLE topics ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS university_name TEXT;
ALTER TABLE topics ADD COLUMN IF NOT EXISTS field_names TEXT[] DEFAULT '{}';
ALTER TABLE topics ADD COLUMN IF NOT EXISTS field_ids UUID[] DEFAULT '{}';

-- supervisors: frontend expects university_name, field_names, field_ids, expertise
ALTER TABLE supervisors ADD COLUMN IF NOT EXISTS university_name TEXT;
ALTER TABLE supervisors ADD COLUMN IF NOT EXISTS field_names TEXT[] DEFAULT '{}';
ALTER TABLE supervisors ADD COLUMN IF NOT EXISTS field_ids UUID[] DEFAULT '{}';
ALTER TABLE supervisors ADD COLUMN IF NOT EXISTS expertise TEXT;

-- experts: frontend expects company_name, field_ids, expertise
ALTER TABLE experts ADD COLUMN IF NOT EXISTS company_name TEXT;
ALTER TABLE experts ADD COLUMN IF NOT EXISTS field_ids UUID[] DEFAULT '{}';
ALTER TABLE experts ADD COLUMN IF NOT EXISTS expertise TEXT;

-- companies: frontend expects topic_count
ALTER TABLE companies ADD COLUMN IF NOT EXISTS topic_count INTEGER DEFAULT 0;

-- student_profiles view (normalized students has UUID id, frontend expects TEXT source_id)
CREATE OR REPLACE VIEW student_profiles AS
SELECT
  s.source_id AS id,
  s.first_name,
  s.last_name,
  s.email,
  s.degree,
  u.name AS university_name,
  sp.name AS study_program_name,
  s.skills,
  COALESCE(
    (SELECT array_agg(f.name ORDER BY f.name)
     FROM student_fields sf
     JOIN fields f ON f.id = sf.field_id
     WHERE sf.student_id = s.id),
    '{}'::text[]
  ) AS field_names,
  COALESCE(s.about, '') AS bio
FROM students s
LEFT JOIN universities u ON u.id = s.university_id
LEFT JOIN study_programs sp ON sp.id = s.study_program_id;

-- RLS for people table (created in 20260320000000)
ALTER TABLE people ENABLE ROW LEVEL SECURITY;
CREATE POLICY "people read public"
  ON people FOR SELECT
  TO anon, authenticated
  USING (true);

-- RLS for projects table (created in 20260320000000)
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "projects read public"
  ON projects FOR SELECT
  TO anon, authenticated
  USING (true);

-- Grant on the view
GRANT SELECT ON student_profiles TO anon, authenticated;

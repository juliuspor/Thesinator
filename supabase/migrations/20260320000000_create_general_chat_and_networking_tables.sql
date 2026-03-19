-- Chat sessions for general-chat edge function
CREATE TABLE IF NOT EXISTS chat_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  agent_type TEXT NOT NULL DEFAULT 'general',
  student_id TEXT,
  metadata JSONB DEFAULT '{}',
  status TEXT NOT NULL DEFAULT 'active',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Chat messages for general-chat edge function
CREATE TABLE IF NOT EXISTS chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES chat_sessions(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_chat_messages_session_id ON chat_messages(session_id);
CREATE INDEX IF NOT EXISTS idx_chat_sessions_student_id ON chat_sessions(student_id);

-- Networking sessions for networking edge function
CREATE TABLE IF NOT EXISTS networking_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id TEXT,
  questionnaire JSONB DEFAULT '{}',
  matches JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Networking swipes
CREATE TABLE IF NOT EXISTS networking_swipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES networking_sessions(id) ON DELETE CASCADE,
  persona_name TEXT NOT NULL,
  swipe_action TEXT NOT NULL CHECK (swipe_action IN ('skip', 'connect', 'save')),
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX IF NOT EXISTS idx_networking_swipes_session_id ON networking_swipes(session_id);

-- Tables for browse features (if they don't exist yet)
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT DEFAULT '',
  about TEXT,
  size TEXT DEFAULT '',
  domains TEXT[] DEFAULT '{}',
  topic_count INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS fields (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS supervisors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  title TEXT DEFAULT '',
  university_id UUID,
  university_name TEXT,
  research_interests TEXT[] DEFAULT '{}',
  expertise TEXT,
  field_names TEXT[] DEFAULT '{}',
  field_ids UUID[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS experts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT,
  title TEXT DEFAULT '',
  company_id UUID,
  company_name TEXT,
  offer_interviews BOOLEAN DEFAULT false,
  expertise TEXT,
  field_ids UUID[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS people (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  type TEXT NOT NULL CHECK (type IN ('supervisor', 'expert')),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  title TEXT DEFAULT '',
  institution_name TEXT DEFAULT '',
  institution_type TEXT DEFAULT 'university' CHECK (institution_type IN ('university', 'company')),
  about TEXT DEFAULT '',
  research_interests TEXT[] DEFAULT '{}',
  objectives TEXT[] DEFAULT '{}',
  offer_interviews BOOLEAN DEFAULT false,
  field_ids UUID[] DEFAULT '{}',
  field_names TEXT[] DEFAULT '{}'
);

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  motivation TEXT,
  state TEXT DEFAULT 'proposed',
  student_id TEXT,
  topic_id UUID,
  topic_title TEXT,
  company_name TEXT,
  university_name TEXT,
  supervisor_names TEXT[] DEFAULT '{}',
  expert_names TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE IF NOT EXISTS students (
  id TEXT PRIMARY KEY,
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  email TEXT NOT NULL,
  degree TEXT DEFAULT '',
  university_name TEXT DEFAULT '',
  study_program_name TEXT DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  field_names TEXT[] DEFAULT '{}',
  bio TEXT DEFAULT ''
);

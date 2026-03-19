// --- Agent Types ---
export type AgentType = "general" | "onboarding" | "initial_onboarding" | "qa" | "networking" | "thesis_proposal";

// --- Networking (Gini Connect) ---
export interface PersonaMatch {
  id?: string;
  name: string;
  title: string;
  institution: string;
  type: "mentor" | "expert" | "professor" | "alumni";
  field_badges: string[];
  research_focus: string;
  bio: string;
  scores: {
    fit: number;
    future_benefit: number;
    rating: number;
  };
  match_reason: string;
  benefit_description: string;
}

export interface GenerateMatchesRequest {
  student_id: string;
  type: string;
  field: string;
  goal: string;
  details: string;
}

export interface GenerateMatchesResponse {
  session_id: string;
  matches: PersonaMatch[];
}

export interface SwipeAction {
  session_id: string;
  persona_name: string;
  action: "skip" | "connect" | "save";
}

export interface ChatStartResponse {
  session_id: string;
  greeting: string;
  persona: PersonaMatch;
}

// --- Session ---
export interface SessionCreateRequest {
  student_id: string;
  agent_type: AgentType;
  metadata?: Record<string, unknown>;
}

export interface SessionCreateResponse {
  session_id: string;
  agent_type: string;
  greeting: string;
}

export interface FinalizeResponse {
  session_id: string;
  status: string;
  output: Record<string, unknown>;
  completion_level: "mvp" | "good" | "optimal";
}

// --- Chat ---
export interface ChatRequest {
  session_id: string;
  content: string;
}

export type SSEEvent =
  | { event: "text_delta"; data: { text: string } }
  | { event: "done"; data: { metadata?: Record<string, unknown> } }
  | { event: "error"; data: { message: string } };

// --- Voice ---
export interface TranscriptResponse {
  transcript: string;
  language: string;
}

// --- WebSocket Talk Mode (Client → Server) ---
export type WSClientMessage =
  | { type: "audio_input"; audio: string }
  | { type: "audio_commit" }
  | { type: "interrupt" }
  | { type: "ping" };

// --- WebSocket Talk Mode (Server → Client) ---
export type WSServerMessage =
  | { type: "transcript_partial"; text: string }
  | { type: "transcript_final"; text: string }
  | { type: "response_text"; text: string; is_final: boolean }
  | { type: "audio_output"; audio: string }
  | { type: "speech_state"; speaking: boolean }
  | { type: "done"; metadata?: Record<string, unknown> }
  | { type: "response_done" }
  | { type: "error"; message: string; recoverable: boolean }
  | { type: "pong" }
  | { type: "interrupt_ack" };

// --- Browse Types ---

export interface Company {
  id: string;
  name: string;
  description: string;
  about: string | null;
  size: string;
  domains: string[];
  topic_count?: number;
}

export interface CompanyDetail {
  company: Company;
  topics: TopicDetail[];
  experts: Expert[];
}

export interface Field {
  id: string;
  name: string;
}

export interface TopicSupervisor {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  research_interests?: string[];
}

export interface TopicExpert {
  id: string;
  title: string;
  first_name: string;
  last_name: string;
  expertise?: string;
  company_id?: string;
}

export interface Topic {
  id: string;
  title: string;
  description: string;
  type: "topic" | "job";
  employment: "yes" | "no" | "open";
  employment_type: string | null;
  workplace_type: string | null;
  degrees: string[];
  company_id: string | null;
  university_id: string | null;
  field_ids?: string[];
}

export interface TopicDetail extends Topic {
  company_name?: string;
  university_name?: string;
  field_names: string[];
  supervisors: TopicSupervisor[];
  experts: TopicExpert[];
}

export interface Supervisor {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  title: string;
  university_id: string;
  university_name?: string;
  research_interests: string[];
  expertise?: string;
  field_names?: string[];
  field_ids?: string[];
}

export interface Expert {
  id: string;
  first_name: string;
  last_name: string;
  email?: string;
  title: string;
  company_id: string;
  company_name?: string;
  offer_interviews?: boolean;
  expertise?: string;
  field_ids?: string[];
}

// --- People (unified) ---

export interface Person {
  id: string;
  type: "supervisor" | "expert";
  first_name: string;
  last_name: string;
  title: string;
  institution_name: string;
  institution_type: "university" | "company";
  about: string;
  research_interests: string[];
  objectives: string[];
  offer_interviews: boolean;
  field_ids: string[];
  field_names: string[];
}

// --- Featured Topics ---

export interface FeaturedTopic {
  id: string;
  title: string;
  description: string;
  type: string;
  employment: string;
  degrees: string[];
  company_name: string | null;
  university_name: string | null;
  field_names: string[];
}

// --- Thesis Projects ---

export interface ThesisProject {
  id: string;
  title: string;
  description: string | null;
  motivation: string | null;
  state: string;
  student_id: string;
  topic_id: string | null;
  topic_title: string | null;
  company_name: string | null;
  university_name: string | null;
  supervisor_names: string[];
  expert_names: string[];
  created_at: string | null;
  updated_at: string | null;
}

// --- Student Profile ---

export interface StudentProfile {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  degree: string;
  university_name: string;
  study_program_name: string;
  skills: string[];
  field_names: string[];
  bio: string;
}

// --- UI ---
export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: number;
  isStreaming?: boolean;
}

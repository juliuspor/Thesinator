export type InputMode = "mcq" | "text" | "speech";

export type PinnedItem = {
  id: string;
  questionId: number;
  text: string;
  pinnedAt: string;
};

export type ContextSnapshot = {
  goal_type: string | null;
  target_industry: string[];
  preferred_cities: string[];
  remote_ok: boolean | null;
  future_vision: string | null;
  paid_required: boolean | null;
  duration_months: number | null;
  nda_ok: boolean | null;
  publish_required: boolean | null;
  existing_ideas: string[];
  refined_interests: string[];
  depth_preference: string | null;
  pinned_items: PinnedItem[];
};

export const DEFAULT_CONTEXT_SNAPSHOT: ContextSnapshot = {
  goal_type: null,
  target_industry: [],
  preferred_cities: [],
  remote_ok: null,
  future_vision: null,
  paid_required: null,
  duration_months: null,
  nda_ok: null,
  publish_required: null,
  existing_ideas: [],
  refined_interests: [],
  depth_preference: null,
  pinned_items: [],
};

export type ThesinatorQuestion = {
  id: number;
  question: string;
  options: string[];
};

export const THESINATOR_QUESTIONS: ThesinatorQuestion[] = [
  {
    id: 1,
    question: "Which area fascinates you the most?",
    options: [
      "Technology & IT",
      "Business & Management",
      "Design & Creativity",
      "Research & Science",
      "Social Impact & Society",
    ],
  },
  {
    id: 2,
    question: "Do you want to collaborate with a company?",
    options: ["Yes, definitely", "Probably yes", "Not sure", "Probably not", "No"],
  },
  {
    id: 3,
    question: "Where do you see yourself after graduation?",
    options: [
      "Large Company (Google, Apple...)",
      "Founding a Startup",
      "Consulting (McKinsey...)",
      "Research & Academia",
      "Still Unsure",
    ],
  },
];

const trimString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  const normalized = value
    .map((item) => trimString(item))
    .filter((item): item is string => item !== null);

  return [...new Set(normalized)];
};

const normalizeBoolean = (value: unknown): boolean | null => {
  if (typeof value === "boolean") {
    return value;
  }

  return null;
};

const normalizeDuration = (value: unknown): number | null => {
  if (typeof value === "number" && Number.isFinite(value) && value > 0 && value <= 24) {
    return Math.round(value);
  }

  return null;
};

const normalizePinnedItems = (value: unknown): PinnedItem[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value.filter((item): item is PinnedItem => {
    if (!item || typeof item !== "object") {
      return false;
    }
    const candidate = item as Record<string, unknown>;
    return (
      typeof candidate.id === "string" &&
      typeof candidate.questionId === "number" &&
      typeof candidate.text === "string" &&
      typeof candidate.pinnedAt === "string"
    );
  });
};

export const sanitizeSnapshotPatch = (patch: unknown): Partial<ContextSnapshot> => {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return {};
  }

  const source = patch as Record<string, unknown>;
  const out: Partial<ContextSnapshot> = {};

  if (source.goal_type !== undefined) {
    out.goal_type = trimString(source.goal_type);
  }

  if (source.target_industry !== undefined) {
    out.target_industry = normalizeStringArray(source.target_industry);
  }

  if (source.preferred_cities !== undefined) {
    out.preferred_cities = normalizeStringArray(source.preferred_cities);
  }

  if (source.remote_ok !== undefined) {
    out.remote_ok = normalizeBoolean(source.remote_ok);
  }

  if (source.future_vision !== undefined) {
    out.future_vision = trimString(source.future_vision);
  }

  if (source.paid_required !== undefined) {
    out.paid_required = normalizeBoolean(source.paid_required);
  }

  if (source.duration_months !== undefined) {
    out.duration_months = normalizeDuration(source.duration_months);
  }

  if (source.nda_ok !== undefined) {
    out.nda_ok = normalizeBoolean(source.nda_ok);
  }

  if (source.publish_required !== undefined) {
    out.publish_required = normalizeBoolean(source.publish_required);
  }

  if (source.existing_ideas !== undefined) {
    out.existing_ideas = normalizeStringArray(source.existing_ideas);
  }

  if (source.refined_interests !== undefined) {
    out.refined_interests = normalizeStringArray(source.refined_interests);
  }

  if (source.depth_preference !== undefined) {
    out.depth_preference = trimString(source.depth_preference);
  }

  if (source.pinned_items !== undefined) {
    out.pinned_items = normalizePinnedItems(source.pinned_items);
  }

  return out;
};

const coerceSnapshot = (value: unknown): ContextSnapshot => {
  const patch = sanitizeSnapshotPatch(value);

  return {
    ...DEFAULT_CONTEXT_SNAPSHOT,
    ...patch,
    target_industry: patch.target_industry ?? DEFAULT_CONTEXT_SNAPSHOT.target_industry,
    preferred_cities: patch.preferred_cities ?? DEFAULT_CONTEXT_SNAPSHOT.preferred_cities,
    existing_ideas: patch.existing_ideas ?? DEFAULT_CONTEXT_SNAPSHOT.existing_ideas,
    refined_interests: patch.refined_interests ?? DEFAULT_CONTEXT_SNAPSHOT.refined_interests,
    pinned_items: patch.pinned_items ?? DEFAULT_CONTEXT_SNAPSHOT.pinned_items,
  };
};

export const mergeContextSnapshot = (existing: unknown, patch: unknown): ContextSnapshot => {
  const base = coerceSnapshot(existing);
  const cleanPatch = sanitizeSnapshotPatch(patch);

  return {
    ...base,
    ...cleanPatch,
    target_industry: cleanPatch.target_industry ?? base.target_industry,
    preferred_cities: cleanPatch.preferred_cities ?? base.preferred_cities,
    existing_ideas: cleanPatch.existing_ideas ?? base.existing_ideas,
    refined_interests: cleanPatch.refined_interests ?? base.refined_interests,
    pinned_items: cleanPatch.pinned_items ?? base.pinned_items,
  };
};

export const extractJsonObject = (text: string): Record<string, unknown> | null => {
  try {
    const parsed = JSON.parse(text);
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    // Fall back to slicing below.
  }

  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  try {
    const parsed = JSON.parse(text.slice(start, end + 1));
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      return parsed as Record<string, unknown>;
    }
  } catch {
    return null;
  }

  return null;
};

export const isInputMode = (value: unknown): value is InputMode => {
  return value === "mcq" || value === "text" || value === "speech";
};

export const defaultAssistantIntro = (firstQuestion: ThesinatorQuestion): string => {
  return `Hi, I am Thesinator. I will ask three short questions and adapt my guidance based on your answers. Let's start with question ${firstQuestion.id}.`;
};

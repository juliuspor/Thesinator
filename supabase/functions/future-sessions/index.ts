import { createClient } from "npm:@supabase/supabase-js@2.49.8";

type PinnedItem = {
  id: string;
  questionId: number;
  text: string;
  pinnedAt: string;
};

type ContextSnapshot = {
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

type TopTopicRow = {
  rank: number;
  topic_id: string;
  title: string;
  final_score: number;
  vector_score: number;
  structured_score: number;
  reason: Record<string, unknown> | null;
};

type EntitySummary = {
  id: string;
  name: string;
  subtitle?: string | null;
  summary?: string | null;
  href?: string | null;
};

type AlumniExample = {
  id: string;
  full_name: string;
  thesis_title: string;
  current_role: string;
  current_company: string;
  graduation_year: number;
};

type TopicBundle = {
  id: string;
  title: string;
  description: string;
  type: string;
  locationCity: string | null;
  remoteOk: boolean | null;
  durationMonths: number | null;
  paid: boolean | null;
  ndaRequired: boolean | null;
  publishAllowed: boolean | null;
  company: EntitySummary | null;
  university: EntitySummary | null;
  supervisors: EntitySummary[];
  experts: EntitySummary[];
  fields: string[];
};

type FutureCard = {
  future_id?: string;
  source: "matched" | "generated";
  rank: number;
  display_rank?: number;
  future_headline: string;
  future_role: string;
  future_organization: string;
  future_path_snapshot: string;
  thesis_title: string;
  thesis_summary: string;
  why_fit: string;
  theme: string;
  topic_id: string | null;
  source_topic_ids: string[];
  grounding: {
    company: EntitySummary | null;
    university: EntitySummary | null;
    supervisors: EntitySummary[];
    experts: EntitySummary[];
    fields: string[];
  };
  alumni_examples: AlumniExample[];
  saved?: boolean;
  simulation_status?: "queued" | "preparing" | "ready" | "failed";
  swarm_impact?: SwarmImpact | null;
};

type FutureDetail = {
  hero_title: string;
  hero_summary: string;
  opening_note: string;
  why_this_path: string;
  future_self_intro: string;
  story_beat: string;
  persona_brief: string;
  milestones: Array<{ title: string; detail: string }>;
};

type FutureMapNode = {
  id: string;
  type: "future" | "thesis" | "company" | "university" | "supervisor" | "expert";
  label: string;
  summary: string;
};

type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

type GraphBuildStatus = "queued" | "preparing" | "ready" | "failed";

type GraphPreviewNode = {
  id: string;
  label: string;
  type:
    | "student"
    | "thesis"
    | "company"
    | "university"
    | "supervisor"
    | "expert"
    | "organization"
    | "other";
  summary: string;
};

type GraphPreviewEdge = {
  id: string;
  source: string;
  target: string;
  label: string;
};

type GraphBuildEvent = {
  timestamp: string | null;
  message: string | null;
  stage_label: string | null;
  status: string | null;
  progress: number | null;
  error: string | null;
};

type GraphBuildState = {
  status: GraphBuildStatus;
  stage_label: string | null;
  progress: number;
  mirofish_project_id: string | null;
  task_id: string | null;
  graph_id: string | null;
  error: string | null;
  preview_nodes: GraphPreviewNode[];
  preview_edges: GraphPreviewEdge[];
  events: GraphBuildEvent[];
};

type SwarmStatus = "queued" | "preparing" | "running" | "ready" | "failed";

type SwarmAction = {
  round_num: number;
  timestamp: string | null;
  platform: string | null;
  agent_id: number;
  agent_name: string;
  action_type: string;
  action_args: Record<string, unknown>;
  result: string | null;
  success: boolean;
};

type SwarmState = {
  status: SwarmStatus;
  stage_label: string | null;
  progress: number;
  simulation_id: string | null;
  prepare_task_id: string | null;
  runner_status: string | null;
  latest_actions: SwarmAction[];
  events: GraphBuildEvent[];
  error: string | null;
  metrics: {
    twitter_actions_count: number;
    reddit_actions_count: number;
    total_actions_count: number;
  };
};

type SwarmImpactDecision = "up" | "steady" | "down";

type SwarmImpact = {
  decision: SwarmImpactDecision;
  display_delta: number;
  why_this_path: string;
  future_self_angle: string;
  risks: string[];
  evidence: string[];
};

type FinalizationStatus = "queued" | "preparing" | "ready" | "failed";

type FinalizationState = {
  status: FinalizationStatus;
  stage_label: string | null;
  progress: number;
  error: string | null;
};

type FutureViewState = {
  graph_build: GraphBuildState;
  swarm: SwarmState;
  finalization: FinalizationState;
};

type SessionContext = {
  sessionId: string;
  snapshot: ContextSnapshot;
  transcriptText: string;
  profileDocument: string;
  topTopicRows: TopTopicRow[];
  topicBundles: Map<string, TopicBundle>;
};

const DEFAULT_CONTEXT_SNAPSHOT: ContextSnapshot = {
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

const FIXED_SCENARIO_PROMPT =
  "Simulate a five-year thesis-to-career future in which the student chooses this thesis path and grows into a concrete future self. Stay grounded in the linked Studyond entities, and keep the outcome practical, personal, and student-readable.";

const FIXED_GRAPH_PROMPT =
  "Build a stakeholder-first thesis graph for Marvin Heine's thesis journey. Anchor the graph around Marvin Heine (marvin.heine@student.hpi.de) as the student, prefer known thesis stakeholders from the provided data, avoid placeholder labels like unknown student, create meaningful links between the student, thesis directions, companies, universities, supervisors, and experts, and only infer nearby organizations when strongly supported by the seed.";

const FIXED_SWARM_PROMPT =
  "Simulate a thesis-to-career future around this student's top thesis directions. Let the student, supervisors, experts, universities, companies, and nearby organizations shape the outcome. Keep the run practical, grounded, and useful for a live student-facing future view.";

const DEFAULT_SUGGESTED_PROMPTS = [
  "What surprised you most about this path?",
  "What would you do earlier if you could start again?",
  "How should I prepare before I commit to this thesis?",
];

const EMPTY_GRAPH_BUILD_STATE: GraphBuildState = {
  status: "queued",
  stage_label: null,
  progress: 0,
  mirofish_project_id: null,
  task_id: null,
  graph_id: null,
  error: null,
  preview_nodes: [],
  preview_edges: [],
  events: [],
};

const EMPTY_SWARM_STATE: SwarmState = {
  status: "queued",
  stage_label: null,
  progress: 0,
  simulation_id: null,
  prepare_task_id: null,
  runner_status: null,
  latest_actions: [],
  events: [],
  error: null,
  metrics: {
    twitter_actions_count: 0,
    reddit_actions_count: 0,
    total_actions_count: 0,
  },
};

const EMPTY_SWARM_IMPACT: SwarmImpact = {
  decision: "steady",
  display_delta: 0,
  why_this_path: "This path stayed aligned with the student's base thesis direction.",
  future_self_angle: "This future self speaks about turning the thesis into visible proof early.",
  risks: [],
  evidence: [],
};

const EMPTY_FINALIZATION_STATE: FinalizationState = {
  status: "queued",
  stage_label: null,
  progress: 0,
  error: null,
};

const LOCAL_MIROFISH_API_URL = "http://host.docker.internal:5001";
const LEGACY_LOCAL_MIROFISH_API_URL = "http://127.0.0.1:5001";
const LOCAL_SUPABASE_HOSTS = new Set(["127.0.0.1", "localhost", "host.docker.internal", "kong"]);
const LOCAL_MIROFISH_LOOPBACK_HOSTS = new Set(["127.0.0.1", "localhost"]);

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
};

const json = (status: number, payload: unknown) =>
  new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });

const errorResponse = (status: number, message: string) => json(status, { error: message });

const trimString = (value: unknown): string | null => {
  if (typeof value !== "string") {
    return null;
  }

  const trimmed = value.trim();
  return trimmed.length > 0 ? trimmed : null;
};

const isLocalSupabaseUrl = (value: string | null): boolean => {
  if (!value) {
    return false;
  }

  try {
    return LOCAL_SUPABASE_HOSTS.has(new URL(value).hostname);
  } catch {
    return false;
  }
};

const isLoopbackUrl = (value: string | null): boolean => {
  if (!value) {
    return false;
  }

  try {
    return LOCAL_MIROFISH_LOOPBACK_HOSTS.has(new URL(value).hostname);
  } catch {
    return false;
  }
};

const resolveMiroFishApiUrls = (): string[] => {
  const configuredUrl = trimString(Deno.env.get("MIROFISH_API_URL"));
  const supabaseUrl = trimString(Deno.env.get("SUPABASE_URL"));
  const isLocal = isLocalSupabaseUrl(supabaseUrl);

  if (configuredUrl && (!isLocal || !isLoopbackUrl(configuredUrl))) {
    return [configuredUrl];
  }

  if (isLocal) {
    return configuredUrl
      ? [LOCAL_MIROFISH_API_URL, configuredUrl, LEGACY_LOCAL_MIROFISH_API_URL]
      : [LOCAL_MIROFISH_API_URL, LEGACY_LOCAL_MIROFISH_API_URL];
  }

  if (configuredUrl) {
    return [configuredUrl];
  }

  throw new Error("MIROFISH_API_URL is not configured for the edge runtime.");
};

const truncateText = (value: string, maxLength = 220): string => {
  const trimmed = value.trim();
  if (trimmed.length <= maxLength) {
    return trimmed;
  }

  return `${trimmed.slice(0, Math.max(0, maxLength - 1)).trim()}…`;
};

const clampProgress = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(0, Math.min(100, Math.round(value)));
};

const normalizeStringArray = (value: unknown): string[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return [...new Set(value.map((item) => trimString(item)).filter((item): item is string => Boolean(item)))];
};

const normalizeAlumniExample = (value: unknown): AlumniExample | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const source = value as Record<string, unknown>;
  const id = trimString(source.id);
  const fullName = trimString(source.full_name);
  const thesisTitle = trimString(source.thesis_title);
  const currentRole = trimString(source.current_role);
  const currentCompany = trimString(source.current_company);
  const graduationYear =
    typeof source.graduation_year === "number" && Number.isFinite(source.graduation_year)
      ? Math.round(source.graduation_year)
      : null;

  if (!id || !fullName || !thesisTitle || !currentRole || !currentCompany || !graduationYear) {
    return null;
  }

  return {
    id,
    full_name: fullName,
    thesis_title: thesisTitle,
    current_role: currentRole,
    current_company: currentCompany,
    graduation_year: graduationYear,
  };
};

const normalizeAlumniExamples = (value: unknown): AlumniExample[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => normalizeAlumniExample(item))
    .filter((item): item is AlumniExample => Boolean(item))
    .slice(0, 1);
};

const toPromptSafeFutureCard = (card: FutureCard) => {
  const { alumni_examples: _alumniExamples, ...promptSafeCard } = card;
  return promptSafeCard;
};

const coerceSnapshot = (value: unknown): ContextSnapshot => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return DEFAULT_CONTEXT_SNAPSHOT;
  }

  const source = value as Record<string, unknown>;

  return {
    goal_type: trimString(source.goal_type),
    target_industry: normalizeStringArray(source.target_industry),
    preferred_cities: normalizeStringArray(source.preferred_cities),
    remote_ok: typeof source.remote_ok === "boolean" ? source.remote_ok : null,
    future_vision: trimString(source.future_vision),
    paid_required: typeof source.paid_required === "boolean" ? source.paid_required : null,
    duration_months:
      typeof source.duration_months === "number" && Number.isFinite(source.duration_months)
        ? Math.round(source.duration_months)
        : null,
    nda_ok: typeof source.nda_ok === "boolean" ? source.nda_ok : null,
    publish_required: typeof source.publish_required === "boolean" ? source.publish_required : null,
    existing_ideas: normalizeStringArray(source.existing_ideas),
    refined_interests: normalizeStringArray(source.refined_interests),
    depth_preference: trimString(source.depth_preference),
    pinned_items: Array.isArray(source.pinned_items)
      ? (source.pinned_items as PinnedItem[]).filter(
          (item) =>
            item &&
            typeof item === "object" &&
            typeof item.id === "string" &&
            typeof item.questionId === "number" &&
            typeof item.text === "string" &&
            typeof item.pinnedAt === "string",
        )
      : [],
  };
};

const extractJsonObject = (input: string): Record<string, unknown> | null => {
  const start = input.indexOf("{");
  const end = input.lastIndexOf("}");

  if (start === -1 || end === -1 || end <= start) {
    return null;
  }

  const candidate = input.slice(start, end + 1);

  try {
    const parsed = JSON.parse(candidate);
    return parsed && typeof parsed === "object" && !Array.isArray(parsed)
      ? (parsed as Record<string, unknown>)
      : null;
  } catch {
    return null;
  }
};

const toSafeJsonArray = <T>(value: unknown, fallback: T[]): T[] => {
  if (!Array.isArray(value)) {
    return fallback;
  }

  return value as T[];
};

const getClients = () => {
  const supabaseUrl = Deno.env.get("SUPABASE_URL");
  const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY.");
  }

  const adminClient = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  return { adminClient, supabaseUrl };
};

const callAnthropicJson = async (systemPrompt: string, userPrompt: string) => {
  const anthropicKey = Deno.env.get("ANTHROPIC_API_KEY");
  if (!anthropicKey) {
    return null;
  }

  const model = Deno.env.get("ANTHROPIC_MODEL") ?? "claude-3-5-sonnet-latest";
  const response = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": anthropicKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model,
      max_tokens: 1800,
      temperature: 0.5,
      system: systemPrompt,
      messages: [{ role: "user", content: userPrompt }],
    }),
  });

  if (!response.ok) {
    console.error("Anthropic request failed", response.status, await response.text());
    return null;
  }

  const payload = await response.json();
  const content = Array.isArray(payload.content)
    ? payload.content
        .filter((item: Record<string, unknown>) => item.type === "text")
        .map((item: Record<string, unknown>) => String(item.text ?? ""))
        .join("\n")
    : "";

  return extractJsonObject(content);
};

const inferTheme = (bundle: TopicBundle) => {
  const haystack = [
    bundle.title,
    bundle.description,
    bundle.company?.name ?? "",
    bundle.company?.subtitle ?? "",
    ...bundle.fields,
  ]
    .join(" ")
    .toLowerCase();

  if (/(ai|artificial intelligence|machine learning|data|analytics|nlp|computer vision)/.test(haystack)) {
    return { theme: "AI & Data", role: "Applied AI Lead" };
  }

  if (/(design|ux|wearable|human-computer|interface|creative)/.test(haystack)) {
    return { theme: "Design & Experience", role: "Product Experience Strategist" };
  }

  if (/(sustain|climate|energy|renewable|carbon)/.test(haystack)) {
    return { theme: "Sustainability & Systems", role: "Sustainability Innovation Manager" };
  }

  if (/(supply chain|operations|retail|platform|strategy|business|finance|marketing)/.test(haystack)) {
    return { theme: "Business & Strategy", role: "Innovation Strategy Lead" };
  }

  if (/(health|med|pharma|clinical|bio)/.test(haystack)) {
    return { theme: "Health & Life Sciences", role: "Digital Health Program Lead" };
  }

  return { theme: "Applied Research", role: "Research & Innovation Manager" };
};

const buildMatchedFutureCard = (bundle: TopicBundle, row: TopTopicRow): FutureCard => {
  const inferred = inferTheme(bundle);
  const organization = bundle.company?.name ?? bundle.university?.name ?? "a partner organization";
  const thesisSummary = truncateText(bundle.description, 180);
  const whyFitParts = [
    bundle.fields.length > 0 ? `It stays close to your interests in ${bundle.fields.slice(0, 2).join(" and ")}.` : null,
    bundle.remoteOk ? "It also keeps a flexible working setup on the table." : null,
    bundle.company?.name ? `The path is grounded in a real collaboration with ${bundle.company.name}.` : null,
  ].filter((part): part is string => Boolean(part));

  return {
    source: "matched",
    rank: row.rank,
    future_headline: `Future You, ${inferred.role} at ${organization}`,
    future_role: inferred.role,
    future_organization: organization,
    future_path_snapshot: truncateText(
      `Five years after choosing this thesis, you are known for turning ${inferred.theme.toLowerCase()} work into decisions that matter at ${organization}.`,
      150,
    ),
    thesis_title: bundle.title,
    thesis_summary: thesisSummary,
    why_fit: truncateText(
      whyFitParts.join(" ") ||
        `This path stays tightly grounded in the thesis signals you gave Thesinator and in the Studyond entities attached to this topic.`,
      180,
    ),
    theme: inferred.theme,
    topic_id: bundle.id,
    source_topic_ids: [bundle.id],
    grounding: {
      company: bundle.company,
      university: bundle.university,
      supervisors: bundle.supervisors.slice(0, 2),
      experts: bundle.experts.slice(0, 2),
      fields: bundle.fields,
    },
    alumni_examples: [],
  };
};

const buildFallbackGeneratedCard = (
  bundle: TopicBundle,
  rank: number,
  existingTitles: Set<string>,
): FutureCard => {
  const inferred = inferTheme(bundle);
  const organization = bundle.company?.name ?? bundle.university?.name ?? "a partner organization";
  let thesisTitle = `Applied Extension: ${bundle.title}`;
  if (existingTitles.has(thesisTitle.toLowerCase())) {
    thesisTitle = `${bundle.fields[0] ?? inferred.theme} Studio Thesis with ${organization}`;
  }

  existingTitles.add(thesisTitle.toLowerCase());

  return {
    source: "generated",
    rank,
    future_headline: `Future You, ${inferred.role} shaping ${organization}`,
    future_role: inferred.role,
    future_organization: organization,
    future_path_snapshot: truncateText(
      `You use this thesis as a bridge into a broader ${inferred.theme.toLowerCase()} path, moving from one concrete project into a role with more ownership at ${organization}.`,
      150,
    ),
    thesis_title: thesisTitle,
    thesis_summary: truncateText(
      `A generated thesis path inspired by ${bundle.title} and the surrounding Studyond ecosystem around ${organization}.`,
      180,
    ),
    why_fit: truncateText(
      `This generated path stays close to your session signals while pushing the topic into a slightly bolder, future-facing direction.`,
      170,
    ),
    theme: inferred.theme,
    topic_id: null,
    source_topic_ids: [bundle.id],
    grounding: {
      company: bundle.company,
      university: bundle.university,
      supervisors: bundle.supervisors.slice(0, 2),
      experts: bundle.experts.slice(0, 2),
      fields: bundle.fields,
    },
    alumni_examples: [],
  };
};

const buildGeneratedCards = async (input: {
  context: SessionContext;
  candidateBundles: TopicBundle[];
  existingTitles: Set<string>;
}): Promise<FutureCard[]> => {
  const { context, candidateBundles, existingTitles } = input;
  const anthropicResult = await callAnthropicJson(
    "You create calm, grounded thesis futures for students. Return JSON only with a top-level key generated_futures. Never include probabilities or engine language.",
    JSON.stringify(
      {
        task: "Create five generated thesis futures that feel novel but remain grounded in the provided Studyond catalog context.",
        rules: [
          "Return exactly five futures.",
          "Do not reuse an existing matched thesis title.",
          "Each future must stay anchored in one to three source_topic_ids from the provided candidates.",
          "Keep the tone student-readable and calm.",
          "Focus on a future-self identity and a thesis that leads there.",
        ],
        student_snapshot: context.snapshot,
        transcript_excerpt: truncateText(context.transcriptText, 1800),
        matched_topics: context.topTopicRows.slice(0, 5).map((row) => {
          const bundle = context.topicBundles.get(row.topic_id);
          return {
            topic_id: row.topic_id,
            title: row.title,
            organization: bundle?.company?.name ?? bundle?.university?.name ?? null,
            fields: bundle?.fields ?? [],
          };
        }),
        candidate_topics: candidateBundles.map((bundle) => ({
          topic_id: bundle.id,
          title: bundle.title,
          description: truncateText(bundle.description, 180),
          organization: bundle.company?.name ?? bundle.university?.name ?? null,
          supervisors: bundle.supervisors.map((item) => item.name),
          experts: bundle.experts.map((item) => item.name),
          fields: bundle.fields,
        })),
        existing_titles: [...existingTitles],
        strict_output_schema: {
          generated_futures: [
            {
              thesis_title: "string",
              thesis_summary: "string",
              future_headline: "string",
              future_role: "string",
              future_organization: "string",
              future_path_snapshot: "string",
              why_fit: "string",
              theme: "string",
              source_topic_ids: ["string"],
            },
          ],
        },
      },
      null,
      2,
    ),
  );

  const parsedFutures = toSafeJsonArray<Record<string, unknown>>(
    anthropicResult?.generated_futures,
    [],
  );

  const generatedCards: FutureCard[] = [];
  for (const candidate of parsedFutures) {
    const title = trimString(candidate.thesis_title);
    const summary = trimString(candidate.thesis_summary);
    const headline = trimString(candidate.future_headline);
    const role = trimString(candidate.future_role);
    const organization = trimString(candidate.future_organization);
    const snapshot = trimString(candidate.future_path_snapshot);
    const whyFit = trimString(candidate.why_fit);
    const theme = trimString(candidate.theme);
    const sourceTopicIds = normalizeStringArray(candidate.source_topic_ids).filter((id) =>
      candidateBundles.some((bundle) => bundle.id === id),
    );

    if (
      !title ||
      !summary ||
      !headline ||
      !role ||
      !organization ||
      !snapshot ||
      !whyFit ||
      !theme ||
      sourceTopicIds.length === 0 ||
      existingTitles.has(title.toLowerCase())
    ) {
      continue;
    }

    const primaryBundle =
      candidateBundles.find((bundle) => bundle.id === sourceTopicIds[0]) ?? candidateBundles[0];
    if (!primaryBundle) {
      continue;
    }

    existingTitles.add(title.toLowerCase());
    generatedCards.push({
      source: "generated",
      rank: 0,
      future_headline: truncateText(headline, 110),
      future_role: role,
      future_organization: organization,
      future_path_snapshot: truncateText(snapshot, 150),
      thesis_title: title,
      thesis_summary: truncateText(summary, 180),
      why_fit: truncateText(whyFit, 180),
      theme,
      topic_id: null,
      source_topic_ids: sourceTopicIds,
      grounding: {
        company: primaryBundle.company,
        university: primaryBundle.university,
        supervisors: primaryBundle.supervisors.slice(0, 2),
        experts: primaryBundle.experts.slice(0, 2),
        fields: primaryBundle.fields,
      },
      alumni_examples: [],
    });
  }

  let fallbackRank = 6;
  for (const bundle of candidateBundles) {
    if (generatedCards.length >= 5) {
      break;
    }
    generatedCards.push(buildFallbackGeneratedCard(bundle, fallbackRank, existingTitles));
    fallbackRank += 1;
  }

  return generatedCards.slice(0, 5);
};

const buildDefaultFutureDetail = (card: FutureCard, swarmImpact?: SwarmImpact | null): FutureDetail => {
  const organization = card.future_organization;
  const resolvedSwarmImpact = swarmImpact ?? card.swarm_impact ?? buildDefaultSwarmImpact(card);
  return {
    hero_title: card.future_headline,
    hero_summary: `${card.thesis_title} became the decision that gave this future its shape.`,
    opening_note: `I chose this path because ${resolvedSwarmImpact.future_self_angle.toLowerCase()}`,
    why_this_path: resolvedSwarmImpact.why_this_path,
    future_self_intro: `I’m a version of you who committed to ${card.thesis_title} and turned it into real momentum at ${organization}. ${resolvedSwarmImpact.future_self_angle}`,
    story_beat: `The thesis did not magically solve everything. It gave me the first credible project, the first serious conversations, and the proof that I could keep building in this direction. ${resolvedSwarmImpact.why_this_path}`,
    persona_brief: `Speak as the user's future self from the path "${card.thesis_title}". Stay warm, grounded, reflective, and concrete. Use this angle: ${resolvedSwarmImpact.future_self_angle} Risks to keep in mind: ${resolvedSwarmImpact.risks.join(" ") || "Keep the tradeoffs honest and practical."} Never mention being a model, simulation, or forecast.`,
    milestones: [
      {
        title: "Commit to the thesis",
        detail: `You lock the scope, align with the right people, and make the thesis feel real instead of hypothetical.`,
      },
      {
        title: "Turn the work into trust",
        detail: `The project gives you proof of initiative, judgment, and the ability to carry ambiguity.`,
      },
      {
        title: "Step into a larger role",
        detail: `That proof opens a first role, then compounds into more ownership over the following years.`,
      },
    ],
  };
};

const buildMapNodes = (card: FutureCard): FutureMapNode[] => {
  const nodes: FutureMapNode[] = [
    {
      id: "future-self",
      type: "future",
      label: card.future_role,
      summary: card.future_path_snapshot,
    },
    {
      id: "thesis",
      type: "thesis",
      label: card.thesis_title,
      summary: card.thesis_summary,
    },
  ];

  if (card.grounding.company) {
    nodes.push({
      id: `company-${card.grounding.company.id}`,
      type: "company",
      label: card.grounding.company.name,
      summary: card.grounding.company.summary ?? "Company grounding for this path.",
    });
  }

  if (card.grounding.university) {
    nodes.push({
      id: `university-${card.grounding.university.id}`,
      type: "university",
      label: card.grounding.university.name,
      summary: card.grounding.university.summary ?? "Academic home for this path.",
    });
  }

  for (const supervisor of card.grounding.supervisors.slice(0, 2)) {
    nodes.push({
      id: `supervisor-${supervisor.id}`,
      type: "supervisor",
      label: supervisor.name,
      summary: supervisor.summary ?? "Potential academic anchor for the thesis.",
    });
  }

  for (const expert of card.grounding.experts.slice(0, 2)) {
    nodes.push({
      id: `expert-${expert.id}`,
      type: "expert",
      label: expert.name,
      summary: expert.summary ?? "Industry perspective connected to this path.",
    });
  }

  return nodes;
};

const normalizeSuggestedPrompts = (value: unknown): string[] => {
  const prompts = normalizeStringArray(value);
  if (prompts.length >= 3) {
    return prompts.slice(0, 4);
  }
  return DEFAULT_SUGGESTED_PROMPTS;
};

const finalizationStatusFromValue = (value: unknown): FinalizationStatus => {
  if (value === "queued" || value === "preparing" || value === "ready" || value === "failed") {
    return value;
  }

  return "queued";
};

const clampDisplayDelta = (value: unknown) => {
  if (typeof value !== "number" || !Number.isFinite(value)) {
    return 0;
  }

  return Math.max(-2, Math.min(2, Math.round(value)));
};

const buildDefaultSwarmImpact = (card: FutureCard): SwarmImpact => ({
  ...EMPTY_SWARM_IMPACT,
  why_this_path: card.why_fit,
  future_self_angle:
    `This future self speaks about ${card.thesis_title} as the path that became visible and trustworthy early.`,
});

const normalizeSwarmImpact = (value: unknown, fallback: FutureCard | SwarmImpact): SwarmImpact => {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const fallbackImpact = "thesis_title" in fallback ? buildDefaultSwarmImpact(fallback) : fallback;
  const decision = trimString(source.decision)?.toLowerCase();

  return {
    decision: decision === "up" || decision === "down" || decision === "steady"
      ? decision
      : fallbackImpact.decision,
    display_delta: clampDisplayDelta(source.display_delta ?? fallbackImpact.display_delta),
    why_this_path: trimString(source.why_this_path) ?? fallbackImpact.why_this_path,
    future_self_angle: trimString(source.future_self_angle) ?? fallbackImpact.future_self_angle,
    risks: normalizeStringArray(source.risks).slice(0, 3).length > 0
      ? normalizeStringArray(source.risks).slice(0, 3)
      : fallbackImpact.risks,
    evidence: normalizeStringArray(source.evidence).slice(0, 3).length > 0
      ? normalizeStringArray(source.evidence).slice(0, 3)
      : fallbackImpact.evidence,
  };
};

const normalizeFinalizationState = (
  value: unknown,
  overrides: Partial<FinalizationState> = {},
): FinalizationState => {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  return {
    status: finalizationStatusFromValue(overrides.status ?? source.status),
    stage_label: trimString(overrides.stage_label ?? source.stage_label) ?? null,
    progress: clampProgress(overrides.progress ?? source.progress),
    error: trimString(overrides.error ?? source.error) ?? null,
  };
};

const synthesizeFutureDetail = async (card: FutureCard, seedText: string): Promise<{
  detail: FutureDetail;
  suggestedPrompts: string[];
}> => {
  const anthropicResult = await callAnthropicJson(
    "You write calm, editorial future-self thesis journey content. Return JSON only.",
    JSON.stringify(
      {
        task: "Expand this future card into a richer detail view for a student-facing thesis future page.",
        future_card: toPromptSafeFutureCard(card),
        fixed_scenario: FIXED_SCENARIO_PROMPT,
        seed_excerpt: truncateText(seedText, 3000),
        rules: [
          "Stay fully grounded in the given future card and seed.",
          "Do not mention simulations, probabilities, or models.",
          "Write in a first-person future-self voice where appropriate.",
          "Make the milestones concrete and believable over a five-year arc.",
        ],
        strict_output_schema: {
          hero_title: "string",
          hero_summary: "string",
          opening_note: "string",
          why_this_path: "string",
          future_self_intro: "string",
          story_beat: "string",
          persona_brief: "string",
          milestones: [
            {
              title: "string",
              detail: "string",
            },
          ],
          suggested_prompts: ["string"],
        },
      },
      null,
      2,
    ),
  );

  const fallback = buildDefaultFutureDetail(card);
  if (!anthropicResult) {
    return {
      detail: fallback,
      suggestedPrompts: DEFAULT_SUGGESTED_PROMPTS,
    };
  }

  const milestones = toSafeJsonArray<Record<string, unknown>>(anthropicResult.milestones, [])
    .map((item) => ({
      title: trimString(item.title) ?? "Milestone",
      detail: trimString(item.detail) ?? "This step keeps the path moving.",
    }))
    .slice(0, 5);

  return {
    detail: {
      hero_title: trimString(anthropicResult.hero_title) ?? fallback.hero_title,
      hero_summary: trimString(anthropicResult.hero_summary) ?? fallback.hero_summary,
      opening_note: trimString(anthropicResult.opening_note) ?? fallback.opening_note,
      why_this_path: trimString(anthropicResult.why_this_path) ?? fallback.why_this_path,
      future_self_intro: trimString(anthropicResult.future_self_intro) ?? fallback.future_self_intro,
      story_beat: trimString(anthropicResult.story_beat) ?? fallback.story_beat,
      persona_brief: trimString(anthropicResult.persona_brief) ?? fallback.persona_brief,
      milestones: milestones.length > 0 ? milestones : fallback.milestones,
    },
    suggestedPrompts: normalizeSuggestedPrompts(anthropicResult.suggested_prompts),
  };
};

const composeSwarmSeed = (context: SessionContext, card: FutureCard) => {
  const promptSafeCard = toPromptSafeFutureCard(card);
  const sourceTopics = card.source_topic_ids
    .map((id) => context.topicBundles.get(id))
    .filter((item): item is TopicBundle => Boolean(item))
    .map((bundle) => ({
      topic_id: bundle.id,
      title: bundle.title,
      description: bundle.description,
      organization: bundle.company?.name ?? bundle.university?.name ?? null,
      supervisors: bundle.supervisors.map((item) => item.name),
      experts: bundle.experts.map((item) => item.name),
      fields: bundle.fields,
    }));

  return [
    "Studyond Future Session Seed",
    `Scenario: ${FIXED_SCENARIO_PROMPT}`,
    `Context snapshot:\n${JSON.stringify(context.snapshot, null, 2)}`,
    `Transcript excerpt:\n${truncateText(context.transcriptText, 2000)}`,
    `Profile document excerpt:\n${truncateText(context.profileDocument, 2000)}`,
    `Future card:\n${JSON.stringify(promptSafeCard, null, 2)}`,
    `Linked source topics:\n${JSON.stringify(sourceTopics, null, 2)}`,
    `Top matched topics:\n${JSON.stringify(
      context.topTopicRows.slice(0, 5).map((row) => ({
        topic_id: row.topic_id,
        title: row.title,
        rank: row.rank,
      })),
      null,
      2,
    )}`,
  ].join("\n\n");
};

const composeGraphSeed = (context: SessionContext, cards: FutureCard[]) => {
  const sourceTopics = cards
    .flatMap((card) => card.source_topic_ids)
    .map((topicId) => context.topicBundles.get(topicId))
    .filter((bundle): bundle is TopicBundle => Boolean(bundle));

  const uniqueCompanies = [...new Map(
    sourceTopics
      .map((bundle) => bundle.company)
      .filter((entity): entity is EntitySummary => Boolean(entity))
      .map((entity) => [entity.id, entity]),
  ).values()];
  const uniqueUniversities = [...new Map(
    sourceTopics
      .map((bundle) => bundle.university)
      .filter((entity): entity is EntitySummary => Boolean(entity))
      .map((entity) => [entity.id, entity]),
  ).values()];
  const uniqueSupervisors = [...new Map(
    sourceTopics
      .flatMap((bundle) => bundle.supervisors)
      .map((entity) => [entity.id, entity]),
  ).values()];
  const uniqueExperts = [...new Map(
    sourceTopics
      .flatMap((bundle) => bundle.experts)
      .map((entity) => [entity.id, entity]),
  ).values()];

  return [
    "Studyond Thesis Graph Seed",
    `Scenario: ${FIXED_GRAPH_PROMPT}`,
    "Student: Marvin Heine (marvin.heine@student.hpi.de)",
    `Student snapshot:\n${JSON.stringify(context.snapshot, null, 2)}`,
    `Transcript excerpt:\n${truncateText(context.transcriptText, 3000)}`,
    `Profile document excerpt:\n${truncateText(context.profileDocument, 3000)}`,
    [
      "Relationship hints:",
      "- Marvin Heine explores the thesis directions.",
      "- Thesis directions connect to the most relevant companies, universities, supervisors, and experts.",
      "- Prefer grounded links from the provided stakeholders over invented ones.",
    ].join("\n"),
    `Matched thesis directions:\n${JSON.stringify(
      cards.slice(0, 5).map((card) => ({
        source: card.source,
        rank: card.rank,
        thesis_title: card.thesis_title,
        thesis_summary: card.thesis_summary,
        future_glimpse: `${card.future_role} at ${card.future_organization}`,
        fields: card.grounding.fields,
      })),
      null,
      2,
    )}`,
    `Companies:\n${JSON.stringify(uniqueCompanies, null, 2)}`,
    `Universities:\n${JSON.stringify(uniqueUniversities, null, 2)}`,
    `Supervisors:\n${JSON.stringify(uniqueSupervisors, null, 2)}`,
    `Experts:\n${JSON.stringify(uniqueExperts, null, 2)}`,
  ].join("\n\n");
};

const composeSessionSwarmRequirement = (context: SessionContext, cards: FutureCard[]) =>
  [
    FIXED_SWARM_PROMPT,
    "",
    "Student snapshot:",
    JSON.stringify(context.snapshot, null, 2),
    "",
    "Top thesis directions to simulate:",
    JSON.stringify(
      cards.slice(0, 3).map((card) => ({
        thesis_title: card.thesis_title,
        future_headline: card.future_headline,
        future_role: card.future_role,
        future_organization: card.future_organization,
        why_fit: card.why_fit,
        fields: card.grounding.fields,
      })),
      null,
      2,
    ),
  ].join("\n");

const graphStatusFromValue = (value: unknown): GraphBuildStatus => {
  if (value === "ready" || value === "failed" || value === "preparing" || value === "queued") {
    return value;
  }

  if (value === "completed") {
    return "ready";
  }

  if (value === "processing" || value === "pending") {
    return "preparing";
  }

  return "queued";
};

const normalizeGraphEvents = (value: unknown): GraphBuildEvent[] => {
  if (!Array.isArray(value)) {
    return [];
  }

  return value
    .map((item) => {
      if (!item || typeof item !== "object" || Array.isArray(item)) {
        return null;
      }

      const source = item as Record<string, unknown>;
      const message = trimString(source.message);
      const error = trimString(source.error);
      const timestamp = trimString(source.timestamp);
      const stageLabel = trimString(source.stage_label);
      const status = trimString(source.status);
      const progress =
        typeof source.progress === "number" && Number.isFinite(source.progress)
          ? clampProgress(source.progress)
          : null;

      if (!message && !error && !stageLabel && !status) {
        return null;
      }

      return {
        timestamp,
        message,
        stage_label: stageLabel,
        status,
        progress,
        error,
      } satisfies GraphBuildEvent;
    })
    .filter((item): item is GraphBuildEvent => Boolean(item));
};

const normalizeGraphState = (
  value: unknown,
  overrides: Partial<GraphBuildState> = {},
): GraphBuildState => {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const previewNodes =
    "preview_nodes" in overrides
      ? overrides.preview_nodes ?? []
      : Array.isArray(source.preview_nodes)
        ? (source.preview_nodes as GraphPreviewNode[])
        : [];
  const previewEdges =
    "preview_edges" in overrides
      ? overrides.preview_edges ?? []
      : Array.isArray(source.preview_edges)
        ? (source.preview_edges as GraphPreviewEdge[])
        : [];
  const events =
    "events" in overrides
      ? overrides.events ?? []
      : normalizeGraphEvents(source.events);

  return {
    status: graphStatusFromValue(overrides.status ?? source.status),
    stage_label: trimString(overrides.stage_label ?? source.stage_label) ?? null,
    progress: clampProgress(overrides.progress ?? source.progress),
    mirofish_project_id:
      trimString(overrides.mirofish_project_id ?? source.mirofish_project_id) ?? null,
    task_id: trimString(overrides.task_id ?? source.task_id) ?? null,
    graph_id: trimString(overrides.graph_id ?? source.graph_id) ?? null,
    error: trimString(overrides.error ?? source.error) ?? null,
    preview_nodes: previewNodes,
    preview_edges: previewEdges,
    events,
  };
};

const getStoredGraphState = (row: Record<string, unknown>): GraphBuildState =>
  normalizeGraphState({
    status: row.graph_status,
    stage_label: row.graph_stage_label,
    progress: row.graph_progress,
    mirofish_project_id: row.mirofish_project_id,
    task_id: row.graph_task_id,
    graph_id: row.graph_id,
    error: row.graph_error,
  });

const swarmStatusFromValue = (value: unknown): SwarmStatus => {
  if (value === "queued" || value === "preparing" || value === "running" || value === "ready" || value === "failed") {
    return value;
  }

  if (value === "completed" || value === "stopped" || value === "paused") {
    return "ready";
  }

  if (value === "processing" || value === "pending" || value === "starting") {
    return "preparing";
  }

  return "queued";
};

const normalizeSwarmAction = (value: unknown): SwarmAction | null => {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return null;
  }

  const source = value as Record<string, unknown>;
  return {
    round_num:
      typeof source.round_num === "number" && Number.isFinite(source.round_num)
        ? Math.round(source.round_num)
        : 0,
    timestamp: trimString(source.timestamp),
    platform: trimString(source.platform),
    agent_id:
      typeof source.agent_id === "number" && Number.isFinite(source.agent_id)
        ? Math.round(source.agent_id)
        : 0,
    agent_name: trimString(source.agent_name) ?? "Agent",
    action_type: trimString(source.action_type) ?? "ACTION",
    action_args: source.action_args && typeof source.action_args === "object" && !Array.isArray(source.action_args)
      ? (source.action_args as Record<string, unknown>)
      : {},
    result: trimString(source.result),
    success: source.success !== false,
  };
};

const normalizeSwarmState = (
  value: unknown,
  overrides: Partial<SwarmState> = {},
): SwarmState => {
  const source =
    value && typeof value === "object" && !Array.isArray(value)
      ? (value as Record<string, unknown>)
      : {};

  const latestActions =
    "latest_actions" in overrides
      ? overrides.latest_actions ?? []
      : Array.isArray(source.latest_actions)
        ? source.latest_actions.map(normalizeSwarmAction).filter((item): item is SwarmAction => Boolean(item))
        : [];

  const events =
    "events" in overrides
      ? overrides.events ?? []
      : normalizeGraphEvents(source.events);

  const metricsSource =
    "metrics" in overrides
      ? overrides.metrics ?? EMPTY_SWARM_STATE.metrics
      : source.metrics && typeof source.metrics === "object" && !Array.isArray(source.metrics)
        ? (source.metrics as Record<string, unknown>)
        : {};

  return {
    status: swarmStatusFromValue(overrides.status ?? source.status ?? source.runner_status),
    stage_label: trimString(overrides.stage_label ?? source.stage_label) ?? null,
    progress: clampProgress(overrides.progress ?? source.progress),
    simulation_id: trimString(overrides.simulation_id ?? source.simulation_id) ?? null,
    prepare_task_id: trimString(overrides.prepare_task_id ?? source.prepare_task_id) ?? null,
    runner_status: trimString(overrides.runner_status ?? source.runner_status) ?? null,
    latest_actions: latestActions,
    events,
    error: trimString(overrides.error ?? source.error) ?? null,
    metrics: {
      twitter_actions_count:
        typeof metricsSource.twitter_actions_count === "number" && Number.isFinite(metricsSource.twitter_actions_count)
          ? Math.round(metricsSource.twitter_actions_count)
          : 0,
      reddit_actions_count:
        typeof metricsSource.reddit_actions_count === "number" && Number.isFinite(metricsSource.reddit_actions_count)
          ? Math.round(metricsSource.reddit_actions_count)
          : 0,
      total_actions_count:
        typeof metricsSource.total_actions_count === "number" && Number.isFinite(metricsSource.total_actions_count)
          ? Math.round(metricsSource.total_actions_count)
          : 0,
    },
  };
};

const getStoredSwarmState = (row: Record<string, unknown>): SwarmState =>
  normalizeSwarmState({
    status: row.swarm_status,
    stage_label: row.swarm_stage_label,
    progress: row.swarm_progress,
    simulation_id: row.swarm_simulation_id,
    prepare_task_id: row.swarm_prepare_task_id,
    runner_status: row.swarm_runner_status,
    error: row.swarm_error,
  });

const getStoredFinalizationState = (row: Record<string, unknown>): FinalizationState =>
  normalizeFinalizationState({
    status: row.finalization_status,
    stage_label: row.finalization_stage_label,
    progress: row.finalization_progress,
    error: row.finalization_error,
  });

const callMiroFishJson = async <T>(path: string, init?: RequestInit): Promise<T> => {
  const apiUrls = resolveMiroFishApiUrls();

  const headers = new Headers({
    "content-type": "application/json",
  });
  const apiKey = trimString(Deno.env.get("MIROFISH_API_KEY"));
  if (apiKey) {
    headers.set("authorization", `Bearer ${apiKey}`);
  }

  if (init?.headers) {
    const extraHeaders = new Headers(init.headers);
    extraHeaders.forEach((value, key) => headers.set(key, value));
  }

  let lastError: Error | null = null;

  for (const apiUrl of apiUrls) {
    try {
      const response = await fetch(`${apiUrl.replace(/\/$/, "")}${path}`, {
        method: init?.method ?? "GET",
        headers,
        body: init?.body,
      });

      if (!response.ok) {
        const details = trimString(await response.text());
        throw new Error(
          details
            ? `MiroFish adapter request failed (${response.status}): ${details}`
            : `MiroFish adapter request failed (${response.status}).`,
        );
      }

      return await response.json();
    } catch (error) {
      const normalizedError = error instanceof Error
        ? error
        : new Error("MiroFish adapter request failed for an unknown reason.");

      if (normalizedError.message.startsWith("MiroFish adapter request failed (")) {
        throw normalizedError;
      }

      lastError = normalizedError;
    }
  }

  throw lastError ?? new Error("MiroFish adapter request failed for an unknown reason.");
};

const fetchGraphPreview = async (graphId: string) => {
  const response = await callMiroFishJson<Record<string, unknown>>(`/api/studyond/graph/data/${graphId}`);
  const payload =
    response && typeof response === "object" && response.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : response;

  return normalizeGraphState(payload, {
    status: "preparing",
    graph_id: graphId,
  });
};

const syncGraphBuildState = async (
  adminClient: ReturnType<typeof createClient>,
  futureSessionId: string,
  storedState: GraphBuildState,
) => {
  if (!storedState.task_id) {
    return storedState;
  }

  let nextState: GraphBuildState;
  try {
    const taskResponse = await callMiroFishJson<Record<string, unknown>>(
      `/api/studyond/graph/task/${storedState.task_id}`,
    );
    const payload =
      taskResponse &&
      typeof taskResponse === "object" &&
      taskResponse.data &&
      typeof taskResponse.data === "object"
        ? (taskResponse.data as Record<string, unknown>)
        : taskResponse;

    nextState = normalizeGraphState(payload, {
      mirofish_project_id: storedState.mirofish_project_id,
      task_id: storedState.task_id,
      graph_id: storedState.graph_id,
      preview_nodes: storedState.preview_nodes,
      preview_edges: storedState.preview_edges,
    });
  } catch (error) {
    nextState = normalizeGraphState(storedState, {
      status: "failed",
      stage_label: "MiroFish task unavailable",
      error: error instanceof Error ? error.message : "Could not reach the MiroFish task endpoint.",
    });
  }

  const graphId = nextState.graph_id ?? storedState.graph_id;
  if (graphId) {
    try {
      const previewState = await fetchGraphPreview(graphId);
      nextState = normalizeGraphState(nextState, {
        graph_id: graphId,
        preview_nodes: previewState.preview_nodes,
        preview_edges: previewState.preview_edges,
      });
    } catch (error) {
      nextState = normalizeGraphState(nextState, {
        graph_id: graphId,
        error:
          error instanceof Error
            ? error.message
            : "Could not fetch the latest graph preview from MiroFish.",
      });
    }
  }

  await adminClient
    .from("future_sessions")
    .update({
      graph_status: nextState.status,
      graph_stage_label: nextState.stage_label,
      graph_progress: nextState.progress,
      mirofish_project_id: nextState.mirofish_project_id,
      graph_task_id: nextState.task_id,
      graph_id: nextState.graph_id,
      graph_error: nextState.error,
    })
    .eq("id", futureSessionId);

  return nextState;
};

const persistSwarmState = async (
  adminClient: ReturnType<typeof createClient>,
  futureSessionId: string,
  swarmState: SwarmState,
) => {
  await adminClient
    .from("future_sessions")
    .update({
      swarm_status: swarmState.status,
      swarm_stage_label: swarmState.stage_label,
      swarm_progress: swarmState.progress,
      swarm_simulation_id: swarmState.simulation_id,
      swarm_prepare_task_id: swarmState.prepare_task_id,
      swarm_runner_status: swarmState.runner_status,
      swarm_error: swarmState.error,
    })
    .eq("id", futureSessionId);
};

const fetchSwarmState = async (simulationId: string, prepareTaskId: string | null) => {
  const search = new URLSearchParams();
  if (prepareTaskId) {
    search.set("prepare_task_id", prepareTaskId);
  }

  const response = await callMiroFishJson<Record<string, unknown>>(
    `/api/studyond/swarm/status/${simulationId}${search.toString() ? `?${search.toString()}` : ""}`,
  );
  const payload =
    response && typeof response === "object" && response.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : response;

  return normalizeSwarmState(payload, {
    simulation_id: simulationId,
    prepare_task_id: prepareTaskId,
  });
};

const syncSwarmState = async (
  adminClient: ReturnType<typeof createClient>,
  futureSessionId: string,
  storedState: SwarmState,
) => {
  if (!storedState.simulation_id) {
    return storedState;
  }

  let nextState: SwarmState;
  try {
    nextState = await fetchSwarmState(storedState.simulation_id, storedState.prepare_task_id);
  } catch (error) {
    nextState = normalizeSwarmState(storedState, {
      status: "failed",
      stage_label: "Swarm unavailable",
      error: error instanceof Error ? error.message : "Could not reach the MiroFish swarm endpoint.",
    });
  }

  await persistSwarmState(adminClient, futureSessionId, nextState);
  return nextState;
};

const hydrateFutureRow = (row: Record<string, unknown>): FutureCard => {
  const card = (row.card ?? {}) as FutureCard;
  const simulationStatus = trimString(row.deep_status);
  const normalizedCard = {
    ...card,
    alumni_examples: normalizeAlumniExamples(card.alumni_examples),
    display_rank:
      typeof row.display_rank === "number" && Number.isFinite(row.display_rank)
        ? Math.round(row.display_rank)
        : typeof card.display_rank === "number" && Number.isFinite(card.display_rank)
          ? Math.round(card.display_rank)
          : typeof row.rank === "number" && Number.isFinite(row.rank)
            ? Math.round(row.rank)
            : card.rank,
  };

  return {
    ...normalizedCard,
    future_id: String(row.id ?? ""),
    rank: typeof row.rank === "number" ? row.rank : card.rank,
    source: row.source === "generated" ? "generated" : "matched",
    saved: row.saved === true,
    simulation_status:
      simulationStatus === "preparing" || simulationStatus === "ready" || simulationStatus === "failed"
        ? simulationStatus
        : "queued",
    swarm_impact: row.swarm_impact ? normalizeSwarmImpact(row.swarm_impact, normalizedCard) : null,
  } satisfies FutureCard;
};

const buildAlumniExampleFromRow = (row: Record<string, unknown>): AlumniExample | null => {
  const thesis =
    row.thesis && typeof row.thesis === "object" && !Array.isArray(row.thesis)
      ? (row.thesis as Record<string, unknown>)
      : {};
  const currentOutcome =
    row.current_outcome && typeof row.current_outcome === "object" && !Array.isArray(row.current_outcome)
      ? (row.current_outcome as Record<string, unknown>)
      : {};

  return normalizeAlumniExample({
    id: row.id,
    full_name: row.full_name,
    thesis_title: thesis.title,
    current_role: currentOutcome.roleTitle,
    current_company: currentOutcome.companyName,
    graduation_year: row.graduation_year,
  });
};

const enrichCardsWithAlumniExamples = async (
  adminClient: ReturnType<typeof createClient>,
  cards: FutureCard[],
): Promise<FutureCard[]> => {
  const uniqueTopicIds = [...new Set(
    cards
      .flatMap((card) => [card.topic_id, ...card.source_topic_ids])
      .filter((topicId): topicId is string => Boolean(topicId)),
  )];

  if (uniqueTopicIds.length === 0) {
    return cards.map((card) => ({ ...card, alumni_examples: [] }));
  }

  const { data: thesisProjects, error: thesisProjectsError } = await adminClient
    .from("thesis_projects")
    .select("topic_id, source_id")
    .in("topic_id", uniqueTopicIds);

  if (thesisProjectsError) {
    throw new Error(thesisProjectsError.message);
  }

  const projectIdsByTopic = new Map<string, string[]>();
  for (const thesisProject of thesisProjects ?? []) {
    const topicId = trimString(thesisProject.topic_id);
    const projectSourceId = trimString(thesisProject.source_id);
    if (!topicId || !projectSourceId) {
      continue;
    }

    const existing = projectIdsByTopic.get(topicId) ?? [];
    if (!existing.includes(projectSourceId)) {
      existing.push(projectSourceId);
      projectIdsByTopic.set(topicId, existing);
    }
  }

  const uniqueProjectSourceIds = [...new Set(
    [...projectIdsByTopic.values()].flat().filter((projectSourceId) => Boolean(projectSourceId)),
  )];

  if (uniqueProjectSourceIds.length === 0) {
    return cards.map((card) => ({ ...card, alumni_examples: [] }));
  }

  const { data: alumniRows, error: alumniError } = await adminClient
    .from("alumni_paths")
    .select("id, full_name, graduation_year, thesis, current_outcome, source_project_id")
    .in("source_project_id", uniqueProjectSourceIds);

  if (alumniError) {
    throw new Error(alumniError.message);
  }

  const alumniByProject = new Map<string, AlumniExample[]>();
  for (const alumniRow of alumniRows ?? []) {
    const projectSourceId = trimString(alumniRow.source_project_id);
    const example = buildAlumniExampleFromRow(alumniRow as Record<string, unknown>);
    if (!projectSourceId || !example) {
      continue;
    }

    const existing = alumniByProject.get(projectSourceId) ?? [];
    existing.push(example);
    alumniByProject.set(projectSourceId, existing);
  }

  for (const [projectSourceId, examples] of alumniByProject.entries()) {
    alumniByProject.set(
      projectSourceId,
      [...examples].sort(
        (left, right) =>
          right.graduation_year - left.graduation_year || left.full_name.localeCompare(right.full_name),
      ),
    );
  }

  return cards.map((card) => {
    const orderedTopicIds = [...new Set(
      [card.topic_id, ...card.source_topic_ids].filter((topicId): topicId is string => Boolean(topicId)),
    )];
    const orderedProjectSourceIds = [...new Set(
      orderedTopicIds.flatMap((topicId) => projectIdsByTopic.get(topicId) ?? []),
    )];

    const alumniExample =
      orderedProjectSourceIds.flatMap((projectSourceId) => alumniByProject.get(projectSourceId) ?? [])[0] ?? null;

    return {
      ...card,
      alumni_examples: alumniExample ? [alumniExample] : [],
    };
  });
};

const loadTopicBundles = async (adminClient: ReturnType<typeof createClient>, topicIds: string[]) => {
  const uniqueTopicIds = [...new Set(topicIds)];
  if (uniqueTopicIds.length === 0) {
    return new Map<string, TopicBundle>();
  }

  const { data: topics, error: topicsError } = await adminClient
    .from("topics")
    .select(
      "id, title, description, type, location_city, remote_ok, duration_months, paid, nda_required, publish_allowed, company_id, university_id",
    )
    .in("id", uniqueTopicIds);

  if (topicsError) {
    throw new Error(topicsError.message);
  }

  const companyIds = [...new Set((topics ?? []).map((topic) => topic.company_id).filter(Boolean))];
  const universityIds = [...new Set((topics ?? []).map((topic) => topic.university_id).filter(Boolean))];

  const [{ data: companies }, { data: universities }, { data: topicFields }, { data: topicSupervisors }, { data: topicExperts }] =
    await Promise.all([
      companyIds.length > 0
        ? adminClient.from("companies").select("id, name, industry, about, website").in("id", companyIds)
        : Promise.resolve({ data: [] as Record<string, unknown>[] }),
      universityIds.length > 0
        ? adminClient.from("universities").select("id, name, about, website").in("id", universityIds)
        : Promise.resolve({ data: [] as Record<string, unknown>[] }),
      adminClient.from("topic_fields").select("topic_id, field_id").in("topic_id", uniqueTopicIds),
      adminClient.from("topic_supervisors").select("topic_id, supervisor_id").in("topic_id", uniqueTopicIds),
      adminClient.from("topic_experts").select("topic_id, expert_id").in("topic_id", uniqueTopicIds),
    ]);

  const fieldIds = [...new Set((topicFields ?? []).map((row) => row.field_id))];
  const supervisorIds = [...new Set((topicSupervisors ?? []).map((row) => row.supervisor_id))];
  const expertIds = [...new Set((topicExperts ?? []).map((row) => row.expert_id))];

  const [{ data: fields }, { data: supervisors }, { data: experts }] = await Promise.all([
    fieldIds.length > 0
      ? adminClient.from("fields").select("id, name").in("id", fieldIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    supervisorIds.length > 0
      ? adminClient.from("supervisors").select("id, first_name, last_name, title, about").in("id", supervisorIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
    expertIds.length > 0
      ? adminClient.from("experts").select("id, first_name, last_name, title, about").in("id", expertIds)
      : Promise.resolve({ data: [] as Record<string, unknown>[] }),
  ]);

  const companyMap = new Map<string, EntitySummary>(
    (companies ?? []).map((company) => [
      company.id,
      {
        id: company.id,
        name: company.name,
        subtitle: trimString(company.industry),
        summary: trimString(company.about),
        href: trimString(company.website),
      } satisfies EntitySummary,
    ]),
  );
  const universityMap = new Map<string, EntitySummary>(
    (universities ?? []).map((university) => [
      university.id,
      {
        id: university.id,
        name: university.name,
        summary: trimString(university.about),
        href: trimString(university.website),
      } satisfies EntitySummary,
    ]),
  );
  const fieldMap = new Map((fields ?? []).map((field) => [field.id, field.name]));
  const supervisorMap = new Map<string, EntitySummary>(
    (supervisors ?? []).map((supervisor) => [
      supervisor.id,
      {
        id: supervisor.id,
        name: [supervisor.title, supervisor.first_name, supervisor.last_name].filter(Boolean).join(" "),
        subtitle: "Supervisor",
        summary: trimString(supervisor.about),
      } satisfies EntitySummary,
    ]),
  );
  const expertMap = new Map<string, EntitySummary>(
    (experts ?? []).map((expert) => [
      expert.id,
      {
        id: expert.id,
        name: [expert.first_name, expert.last_name].filter(Boolean).join(" "),
        subtitle: trimString(expert.title),
        summary: trimString(expert.about),
      } satisfies EntitySummary,
    ]),
  );

  const bundleMap = new Map<string, TopicBundle>();
  for (const topic of topics ?? []) {
    const companyId = trimString(topic.company_id);
    const universityId = trimString(topic.university_id);
    const fieldsForTopic = (topicFields ?? [])
      .filter((row) => row.topic_id === topic.id)
      .map((row) => fieldMap.get(row.field_id))
      .filter((item): item is string => Boolean(item));
    const supervisorsForTopic = (topicSupervisors ?? [])
      .filter((row) => row.topic_id === topic.id)
      .map((row) => supervisorMap.get(row.supervisor_id))
      .filter((item): item is EntitySummary => Boolean(item));
    const expertsForTopic = (topicExperts ?? [])
      .filter((row) => row.topic_id === topic.id)
      .map((row) => expertMap.get(row.expert_id))
      .filter((item): item is EntitySummary => Boolean(item));

    bundleMap.set(topic.id, {
      id: topic.id,
      title: topic.title,
      description: topic.description,
      type: topic.type,
      locationCity: trimString(topic.location_city),
      remoteOk: typeof topic.remote_ok === "boolean" ? topic.remote_ok : null,
      durationMonths: typeof topic.duration_months === "number" ? topic.duration_months : null,
      paid: typeof topic.paid === "boolean" ? topic.paid : null,
      ndaRequired: typeof topic.nda_required === "boolean" ? topic.nda_required : null,
      publishAllowed: typeof topic.publish_allowed === "boolean" ? topic.publish_allowed : null,
      company: companyId ? companyMap.get(companyId) ?? null : null,
      university: universityId ? universityMap.get(universityId) ?? null : null,
      supervisors: supervisorsForTopic,
      experts: expertsForTopic,
      fields: fieldsForTopic,
    });
  }

  return bundleMap;
};

const loadSessionContext = async (
  adminClient: ReturnType<typeof createClient>,
  thesinatorSessionId: string,
): Promise<SessionContext> => {
  const { data: session, error: sessionError } = await adminClient
    .from("thesinator_sessions")
    .select("id, context_snapshot")
    .eq("id", thesinatorSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!session) {
    throw new Error(`Thesinator session not found: ${thesinatorSessionId}`);
  }

  const { data: searchProfile } = await adminClient
    .from("thesinator_search_profiles")
    .select("transcript_text, profile_document")
    .eq("session_id", thesinatorSessionId)
    .maybeSingle();

  const { data: refreshedRows, error: refreshedError } = await adminClient.rpc("refresh_session_top_topics", {
    p_session_id: thesinatorSessionId,
    p_limit: 15,
  });

  if (refreshedError) {
    throw new Error(refreshedError.message);
  }

  const topTopicRows = toSafeJsonArray<Record<string, unknown>>(refreshedRows, [])
    .map((row) => {
      if (
        typeof row.rank !== "number" ||
        typeof row.topic_id !== "string" ||
        typeof row.title !== "string" ||
        typeof row.final_score !== "number" ||
        typeof row.vector_score !== "number" ||
        typeof row.structured_score !== "number"
      ) {
        return null;
      }

      return {
        rank: row.rank,
        topic_id: row.topic_id,
        title: row.title,
        final_score: row.final_score,
        vector_score: row.vector_score,
        structured_score: row.structured_score,
        reason:
          row.reason && typeof row.reason === "object" && !Array.isArray(row.reason)
            ? (row.reason as Record<string, unknown>)
            : null,
      } satisfies TopTopicRow;
    })
    .filter((item): item is TopTopicRow => Boolean(item))
    .sort((a, b) => a.rank - b.rank);

  const topicBundles = await loadTopicBundles(
    adminClient,
    topTopicRows.map((row) => row.topic_id),
  );

  return {
    sessionId: thesinatorSessionId,
    snapshot: coerceSnapshot(session.context_snapshot),
    transcriptText: trimString(searchProfile?.transcript_text) ?? "",
    profileDocument: trimString(searchProfile?.profile_document) ?? "",
    topTopicRows,
    topicBundles,
  };
};

const loadSessionCards = async (
  adminClient: ReturnType<typeof createClient>,
  futureSessionId: string,
): Promise<FutureCard[]> => {
  const { data, error } = await adminClient
    .from("future_session_futures")
    .select("id, source, rank, display_rank, saved, deep_status, card, swarm_impact")
    .eq("future_session_id", futureSessionId)
    .order("rank", { ascending: true });

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []).map((row) => hydrateFutureRow(row as Record<string, unknown>));
};

const persistFinalizationState = async (
  adminClient: ReturnType<typeof createClient>,
  futureSessionId: string,
  finalizationState: FinalizationState,
) => {
  await adminClient
    .from("future_sessions")
    .update({
      finalization_status: finalizationState.status,
      finalization_stage_label: finalizationState.stage_label,
      finalization_progress: finalizationState.progress,
      finalization_error: finalizationState.error,
    })
    .eq("id", futureSessionId);
};

const sortFuturesForDisplay = (futures: FutureCard[]) =>
  [...futures].sort((left, right) => {
    if (left.source !== right.source) {
      return left.source === "matched" ? -1 : 1;
    }

    const leftRank = left.display_rank ?? left.rank;
    const rightRank = right.display_rank ?? right.rank;
    return leftRank - rightRank || left.rank - right.rank;
  });

const computeDisplayRanks = (futures: FutureCard[]): Map<string, number> => {
  const sortedByBase = [...futures].sort((left, right) => left.rank - right.rank);
  const desiredOrder = sortedByBase
    .map((future, index) => ({
      futureId: future.future_id ?? "",
      baseIndex: index,
      desiredIndex: index + (future.swarm_impact?.display_delta ?? 0),
    }))
    .sort((left, right) => left.desiredIndex - right.desiredIndex || left.baseIndex - right.baseIndex);

  return new Map(desiredOrder.map((item, index) => [item.futureId, index + 1]));
};

const buildSessionFinalizationPayload = (
  context: SessionContext,
  futures: Array<{ future_id: string; future_card: FutureCard; seed_text: string | null }>,
  swarmState: SwarmState,
) => ({
  session_context: {
    snapshot: context.snapshot,
    transcript_excerpt: truncateText(context.transcriptText, 1800),
    profile_document_excerpt: truncateText(context.profileDocument, 1800),
    top_topics: context.topTopicRows.slice(0, 8).map((row) => ({
      topic_id: row.topic_id,
      title: row.title,
      rank: row.rank,
    })),
  },
  scenario_description: FIXED_SCENARIO_PROMPT,
  swarm_highlights: swarmState.latest_actions.slice(0, 8).map((action) => ({
    platform: action.platform,
    agent_name: action.agent_name,
    action_type: action.action_type,
    round_num: action.round_num,
    action_args: action.action_args,
    result: action.result,
    success: action.success,
  })),
  future_cards: futures.map((item) => ({
    ...item,
    future_card: toPromptSafeFutureCard(item.future_card),
  })),
});

const ensureSessionFinalized = async (
  adminClient: ReturnType<typeof createClient>,
  input: {
    futureSessionId: string;
    thesinatorSessionId: string;
    swarmState: SwarmState;
  },
) => {
  const { data: sessionRow, error: sessionError } = await adminClient
    .from("future_sessions")
    .select("id, finalization_status, finalization_stage_label, finalization_progress, finalization_error")
    .eq("id", input.futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!sessionRow) {
    throw new Error(`Future session not found: ${input.futureSessionId}`);
  }

  const storedState = getStoredFinalizationState(sessionRow as Record<string, unknown>);
  if (storedState.status === "ready" || storedState.status === "preparing" || storedState.status === "failed") {
    return storedState;
  }

  if (input.swarmState.status !== "ready") {
    const waitingState = normalizeFinalizationState(EMPTY_FINALIZATION_STATE, {
      status: input.swarmState.status === "failed" ? "failed" : "queued",
      stage_label: input.swarmState.status === "failed" ? "Swarm failed" : "Waiting for full swarm run",
      error: input.swarmState.status === "failed" ? input.swarmState.error : null,
    });
    await persistFinalizationState(adminClient, input.futureSessionId, waitingState);
    return waitingState;
  }

  const preparingState = normalizeFinalizationState(EMPTY_FINALIZATION_STATE, {
    status: "preparing",
    stage_label: "Collecting finished swarm outcomes",
    progress: 8,
  });
  await persistFinalizationState(adminClient, input.futureSessionId, preparingState);

  await adminClient
    .from("future_session_futures")
    .update({
      deep_status: "preparing",
      swarm_impact_status: "preparing",
      mirofish_simulation_id: input.swarmState.simulation_id,
    })
    .eq("future_session_id", input.futureSessionId);

  try {
    const context = await loadSessionContext(adminClient, input.thesinatorSessionId);
    await persistFinalizationState(adminClient, input.futureSessionId, normalizeFinalizationState(preparingState, {
      stage_label: "Preparing thesis cards",
      progress: 24,
    }));

    const { data: futureRows, error: futuresError } = await adminClient
      .from("future_session_futures")
      .select("id, source, rank, display_rank, saved, deep_status, card, seed_text, swarm_impact")
      .eq("future_session_id", input.futureSessionId)
      .order("rank", { ascending: true });

    if (futuresError) {
      throw new Error(futuresError.message);
    }

    const persistedFutures = (futureRows ?? []).map((row) => ({
      row: row as Record<string, unknown>,
      future_card: hydrateFutureRow(row as Record<string, unknown>),
      seed_text: trimString(row.seed_text),
    }));

    await persistFinalizationState(adminClient, input.futureSessionId, normalizeFinalizationState(preparingState, {
      stage_label: "Finalizing thesis outcomes",
      progress: 52,
    }));

    const response = await callMiroFishJson<Record<string, unknown>>("/api/studyond/futures/finalize-session", {
      method: "POST",
      body: JSON.stringify(
        buildSessionFinalizationPayload(
          context,
          persistedFutures.map((item) => ({
            future_id: item.future_card.future_id ?? "",
            future_card: item.future_card,
            seed_text: item.seed_text,
          })),
          input.swarmState,
        ),
      ),
    });

    const payload =
      response && typeof response === "object" && response.data && typeof response.data === "object"
        ? (response.data as Record<string, unknown>)
        : response;

    const finalizedRows = toSafeJsonArray<Record<string, unknown>>(payload.finalized_futures, []);
    const finalizedById = new Map(
      finalizedRows
        .map((item) => [trimString(item.future_id), item] as const)
        .filter((entry): entry is readonly [string, Record<string, unknown>] => Boolean(entry[0])),
    );

    if (persistedFutures.some((item) => !finalizedById.has(item.future_card.future_id ?? ""))) {
      throw new Error("Session finalization did not return every thesis card.");
    }

    const preparedBySource = {
      matched: [] as Array<{
        futureId: string;
        baseRank: number;
        displayRank: number;
        card: FutureCard;
        detail: FutureDetail;
        suggestedPrompts: string[];
        swarmImpact: SwarmImpact;
      }>,
      generated: [] as Array<{
        futureId: string;
        baseRank: number;
        displayRank: number;
        card: FutureCard;
        detail: FutureDetail;
        suggestedPrompts: string[];
        swarmImpact: SwarmImpact;
      }>,
    };

    for (const item of persistedFutures) {
      const futureId = item.future_card.future_id ?? "";
      const finalized = finalizedById.get(futureId) ?? {};
      const swarmImpact = normalizeSwarmImpact(finalized.swarm_impact, item.future_card);
      const nextCard: FutureCard = {
        ...item.future_card,
        swarm_impact: swarmImpact,
      };
      const futureDetail =
        finalized.future_detail && typeof finalized.future_detail === "object" && !Array.isArray(finalized.future_detail)
          ? {
              ...buildDefaultFutureDetail(nextCard, swarmImpact),
              ...(finalized.future_detail as FutureDetail),
            }
          : buildDefaultFutureDetail(nextCard, swarmImpact);
      const suggestedPrompts = normalizeSuggestedPrompts(finalized.suggested_prompts);

      preparedBySource[nextCard.source].push({
        futureId,
        baseRank: nextCard.rank,
        displayRank: nextCard.display_rank ?? nextCard.rank,
        card: nextCard,
        detail: futureDetail,
        suggestedPrompts,
        swarmImpact,
      });
    }

    for (const source of ["matched", "generated"] as const) {
      const displayRanks = computeDisplayRanks(preparedBySource[source].map((item) => item.card));
      preparedBySource[source] = preparedBySource[source].map((item) => ({
        ...item,
        displayRank: displayRanks.get(item.futureId) ?? item.baseRank,
        card: {
          ...item.card,
          display_rank: displayRanks.get(item.futureId) ?? item.baseRank,
        },
      }));
    }

    await persistFinalizationState(adminClient, input.futureSessionId, normalizeFinalizationState(preparingState, {
      stage_label: "Saving thesis outcomes",
      progress: 84,
    }));

    for (const source of ["matched", "generated"] as const) {
      for (const item of preparedBySource[source]) {
        const { error: updateError } = await adminClient
          .from("future_session_futures")
          .update({
            deep_status: "ready",
            swarm_impact_status: "ready",
            swarm_impact: item.swarmImpact,
            display_rank: item.displayRank,
            detail: item.detail,
            map_nodes: buildMapNodes(item.card),
            suggested_prompts: item.suggestedPrompts,
            mirofish_simulation_id: input.swarmState.simulation_id,
          })
          .eq("future_session_id", input.futureSessionId)
          .eq("id", item.futureId);

        if (updateError) {
          throw new Error(updateError.message);
        }
      }
    }

    const readyState = normalizeFinalizationState(preparingState, {
      status: "ready",
      stage_label: "Thesis outcomes ready",
      progress: 100,
      error: null,
    });
    await persistFinalizationState(adminClient, input.futureSessionId, readyState);
    return readyState;
  } catch (error) {
    await adminClient
      .from("future_session_futures")
      .update({
        deep_status: "failed",
        swarm_impact_status: "failed",
        mirofish_simulation_id: input.swarmState.simulation_id,
      })
      .eq("future_session_id", input.futureSessionId);

    const failedState = normalizeFinalizationState(EMPTY_FINALIZATION_STATE, {
      status: "failed",
      stage_label: "Finalizing thesis outcomes failed",
      progress: 100,
      error: error instanceof Error ? error.message : "Could not finalize the thesis outcomes.",
    });
    await persistFinalizationState(adminClient, input.futureSessionId, failedState);
    return failedState;
  }
};

const ensureGraphBuildStarted = async (
  adminClient: ReturnType<typeof createClient>,
  input: {
    futureSessionId: string;
    thesinatorSessionId: string;
  },
) => {
  const { data: sessionRow, error: sessionError } = await adminClient
    .from("future_sessions")
    .select("id, graph_status, graph_stage_label, graph_progress, mirofish_project_id, graph_task_id, graph_id, graph_error")
    .eq("id", input.futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!sessionRow) {
    throw new Error(`Future session not found: ${input.futureSessionId}`);
  }

  const storedState = getStoredGraphState(sessionRow as Record<string, unknown>);
  if (storedState.task_id || storedState.graph_id || storedState.mirofish_project_id) {
    return storedState;
  }

  const context = await loadSessionContext(adminClient, input.thesinatorSessionId);
  const futures = await loadSessionCards(adminClient, input.futureSessionId);
  const seedText = composeGraphSeed(context, futures);
  let nextState: GraphBuildState;

  try {
    const response = await callMiroFishJson<Record<string, unknown>>("/api/studyond/graph/start", {
      method: "POST",
      body: JSON.stringify({
        project_name: `Studyond graph ${context.sessionId}`,
        scenario_description: FIXED_GRAPH_PROMPT,
        seed_text: seedText,
      }),
    });

    const payload =
      response && typeof response === "object" && response.data && typeof response.data === "object"
        ? (response.data as Record<string, unknown>)
        : response;

    nextState = normalizeGraphState(payload, { status: "preparing" });
  } catch (error) {
    nextState = normalizeGraphState(EMPTY_GRAPH_BUILD_STATE, {
      status: "failed",
      stage_label: "MiroFish graph start failed",
      error: error instanceof Error ? error.message : "MiroFish graph adapter is not reachable.",
    });
  }

  await adminClient
    .from("future_sessions")
    .update({
      graph_status: nextState.status,
      graph_stage_label: nextState.stage_label,
      graph_progress: nextState.progress,
      mirofish_project_id: nextState.mirofish_project_id,
      graph_task_id: nextState.task_id,
      graph_id: nextState.graph_id,
      graph_error: nextState.error,
    })
    .eq("id", input.futureSessionId);

  return nextState;
};

const ensureSwarmStarted = async (
  adminClient: ReturnType<typeof createClient>,
  input: {
    futureSessionId: string;
    thesinatorSessionId: string;
    graphBuildState: GraphBuildState;
  },
) => {
  const { data: sessionRow, error: sessionError } = await adminClient
    .from("future_sessions")
    .select(
      "id, swarm_status, swarm_stage_label, swarm_progress, swarm_simulation_id, swarm_prepare_task_id, swarm_runner_status, swarm_error",
    )
    .eq("id", input.futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!sessionRow) {
    throw new Error(`Future session not found: ${input.futureSessionId}`);
  }

  const storedState = getStoredSwarmState(sessionRow as Record<string, unknown>);
  if (storedState.simulation_id || storedState.prepare_task_id) {
    return storedState;
  }

  if (input.graphBuildState.status !== "ready" || !input.graphBuildState.graph_id || !input.graphBuildState.mirofish_project_id) {
    const waitingState = normalizeSwarmState(EMPTY_SWARM_STATE, {
      status: input.graphBuildState.status === "failed" ? "failed" : "queued",
      stage_label: input.graphBuildState.status === "failed" ? "Graph build failed" : "Waiting for stakeholder graph",
      error: input.graphBuildState.status === "failed" ? input.graphBuildState.error : null,
    });
    await persistSwarmState(adminClient, input.futureSessionId, waitingState);
    return waitingState;
  }

  const context = await loadSessionContext(adminClient, input.thesinatorSessionId);
  const futures = await loadSessionCards(adminClient, input.futureSessionId);
  const matchedFutures = futures.filter((future) => future.source === "matched").slice(0, 3);

  let nextState: SwarmState;
  try {
    const response = await callMiroFishJson<Record<string, unknown>>("/api/studyond/swarm/start", {
      method: "POST",
      body: JSON.stringify({
        project_id: input.graphBuildState.mirofish_project_id,
        graph_id: input.graphBuildState.graph_id,
        simulation_requirement: composeSessionSwarmRequirement(context, matchedFutures),
        platform: "parallel",
        max_rounds: 8,
        enable_graph_memory_update: true,
      }),
    });

    const payload =
      response && typeof response === "object" && response.data && typeof response.data === "object"
        ? (response.data as Record<string, unknown>)
        : response;

    nextState = normalizeSwarmState(payload, {
      status: "preparing",
      simulation_id: trimString(payload.simulation_id),
      prepare_task_id: trimString(payload.prepare_task_id),
    });
  } catch (error) {
    nextState = normalizeSwarmState(EMPTY_SWARM_STATE, {
      status: "failed",
      stage_label: "MiroFish swarm start failed",
      error: error instanceof Error ? error.message : "MiroFish swarm adapter is not reachable.",
    });
  }

  await persistSwarmState(adminClient, input.futureSessionId, nextState);
  return nextState;
};

const assembleFutureView = async (
  adminClient: ReturnType<typeof createClient>,
  futureSessionId: string,
  overrides: Partial<FutureViewState> = {},
): Promise<FutureViewState> => {
  const { data: sessionRow, error: sessionError } = await adminClient
    .from("future_sessions")
    .select(
      `
        id,
        graph_status,
        graph_stage_label,
        graph_progress,
        mirofish_project_id,
        graph_task_id,
        graph_id,
        graph_error,
        swarm_status,
        swarm_stage_label,
        swarm_progress,
        swarm_simulation_id,
        swarm_prepare_task_id,
        swarm_runner_status,
        swarm_error,
        finalization_status,
        finalization_stage_label,
        finalization_progress,
        finalization_error
      `,
    )
    .eq("id", futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!sessionRow) {
    throw new Error(`Future session not found: ${futureSessionId}`);
  }

  return {
    graph_build: overrides.graph_build ?? getStoredGraphState(sessionRow as Record<string, unknown>),
    swarm: overrides.swarm ?? getStoredSwarmState(sessionRow as Record<string, unknown>),
    finalization: overrides.finalization ?? getStoredFinalizationState(sessionRow as Record<string, unknown>),
  };
};

const resolveFutureViewState = async (
  adminClient: ReturnType<typeof createClient>,
  input: {
    futureSessionId: string;
    thesinatorSessionId: string;
    graphState?: GraphBuildState;
    swarmState?: SwarmState;
    finalizationState?: FinalizationState;
  },
): Promise<FutureViewState> => {
  let graphState = input.graphState ?? EMPTY_GRAPH_BUILD_STATE;
  let swarmState = input.swarmState ?? EMPTY_SWARM_STATE;
  let finalizationState = input.finalizationState ?? EMPTY_FINALIZATION_STATE;

  if (!graphState.task_id && !graphState.graph_id) {
    graphState = await ensureGraphBuildStarted(adminClient, {
      futureSessionId: input.futureSessionId,
      thesinatorSessionId: input.thesinatorSessionId,
    });
  }

  if (graphState.task_id) {
    graphState = await syncGraphBuildState(adminClient, input.futureSessionId, graphState);
  } else if (graphState.graph_id) {
    try {
      const previewState = await fetchGraphPreview(graphState.graph_id);
      graphState = normalizeGraphState(graphState, {
        preview_nodes: previewState.preview_nodes,
        preview_edges: previewState.preview_edges,
      });
    } catch (error) {
      graphState = normalizeGraphState(graphState, {
        error:
          error instanceof Error
            ? error.message
            : "Could not fetch the latest graph preview from MiroFish.",
      });
    }
  }

  if (graphState.status === "ready") {
    if (!swarmState.simulation_id && !swarmState.prepare_task_id) {
      swarmState = await ensureSwarmStarted(adminClient, {
        futureSessionId: input.futureSessionId,
        thesinatorSessionId: input.thesinatorSessionId,
        graphBuildState: graphState,
      });
    }

    if (swarmState.simulation_id) {
      swarmState = await syncSwarmState(adminClient, input.futureSessionId, swarmState);
    }

    if (swarmState.status === "ready") {
      finalizationState = await ensureSessionFinalized(adminClient, {
        futureSessionId: input.futureSessionId,
        thesinatorSessionId: input.thesinatorSessionId,
        swarmState,
      });
    } else if (swarmState.status === "failed") {
      finalizationState = normalizeFinalizationState(finalizationState, {
        status: "failed",
        stage_label: "Swarm failed",
        progress: 100,
        error: swarmState.error ?? "Could not complete the live swarm run.",
      });
      await persistFinalizationState(adminClient, input.futureSessionId, finalizationState);
    } else {
      finalizationState = normalizeFinalizationState(finalizationState, {
        status: "queued",
        stage_label: "Waiting for full swarm run",
        progress: 0,
        error: null,
      });
      await persistFinalizationState(adminClient, input.futureSessionId, finalizationState);
    }
  } else if (graphState.status === "failed") {
    swarmState = normalizeSwarmState(swarmState, {
      status: "failed",
      stage_label: "Graph build failed",
      error: graphState.error ?? "Could not build the stakeholder graph.",
    });
    await persistSwarmState(adminClient, input.futureSessionId, swarmState);
    finalizationState = normalizeFinalizationState(finalizationState, {
      status: "failed",
      stage_label: "Graph build failed",
      progress: 100,
      error: graphState.error ?? "Could not build the stakeholder graph.",
    });
    await persistFinalizationState(adminClient, input.futureSessionId, finalizationState);
  } else {
    swarmState = normalizeSwarmState(swarmState, {
      status: "queued",
      stage_label: "Waiting for stakeholder graph",
      error: null,
    });
    await persistSwarmState(adminClient, input.futureSessionId, swarmState);
    finalizationState = normalizeFinalizationState(finalizationState, {
      status: "queued",
      stage_label: "Waiting for stakeholder graph",
      progress: 0,
      error: null,
    });
    await persistFinalizationState(adminClient, input.futureSessionId, finalizationState);
  }

  return {
    graph_build: graphState,
    swarm: swarmState,
    finalization: finalizationState,
  };
};

const assembleSessionResponse = async (
  adminClient: ReturnType<typeof createClient>,
  futureSessionId: string,
  graphBuildOverride?: GraphBuildState,
  swarmOverride?: SwarmState,
  finalizationOverride?: FinalizationState,
) => {
  const { data: futureSession, error: sessionError } = await adminClient
    .from("future_sessions")
    .select(
      `
        id,
        selected_future_id,
        graph_status,
        graph_stage_label,
        graph_progress,
        mirofish_project_id,
        graph_task_id,
        graph_id,
        graph_error,
        swarm_status,
        swarm_stage_label,
        swarm_progress,
        swarm_simulation_id,
        swarm_prepare_task_id,
        swarm_runner_status,
        swarm_error,
        finalization_status,
        finalization_stage_label,
        finalization_progress,
        finalization_error
      `,
    )
    .eq("id", futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!futureSession) {
    throw new Error(`Future session not found: ${futureSessionId}`);
  }

  const { data: futures, error: futuresError } = await adminClient
    .from("future_session_futures")
    .select("id, source, rank, display_rank, saved, deep_status, card, swarm_impact")
    .eq("future_session_id", futureSessionId)
    .order("rank", { ascending: true });

  if (futuresError) {
    throw new Error(futuresError.message);
  }

  const hydratedFutures = sortFuturesForDisplay(
    (futures ?? []).map((row) => hydrateFutureRow(row as Record<string, unknown>)),
  );
  return {
    future_session_id: futureSession.id,
    matched_futures: hydratedFutures.filter((future) => future.source === "matched"),
    generated_futures: hydratedFutures.filter((future) => future.source === "generated"),
    futures: hydratedFutures,
    saved_future_ids: hydratedFutures.filter((future) => future.saved).map((future) => future.future_id),
    selected_future_id: trimString(futureSession.selected_future_id),
    graph_build: graphBuildOverride ?? getStoredGraphState(futureSession as Record<string, unknown>),
    swarm: swarmOverride ?? getStoredSwarmState(futureSession as Record<string, unknown>),
    finalization: finalizationOverride ?? getStoredFinalizationState(futureSession as Record<string, unknown>),
  };
};

const handleCreate = async (req: Request) => {
  const { adminClient } = getClients();
  const body = await req.json().catch(() => null);
  const thesinatorSessionId = trimString(body?.thesinator_session_id);

  if (!thesinatorSessionId) {
    return errorResponse(400, "Missing thesinator_session_id.");
  }

  const { data: existingSession } = await adminClient
    .from("future_sessions")
    .select("id")
    .eq("thesinator_session_id", thesinatorSessionId)
    .maybeSingle();

  if (existingSession?.id) {
    const futureView = await resolveFutureViewState(adminClient, {
      futureSessionId: existingSession.id,
      thesinatorSessionId,
    });
    return json(
      200,
      await assembleSessionResponse(
        adminClient,
        existingSession.id,
        futureView.graph_build,
        futureView.swarm,
        futureView.finalization,
      ),
    );
  }

  const context = await loadSessionContext(adminClient, thesinatorSessionId);
  const matchedRows = context.topTopicRows.slice(0, 5);
  const matchedCards = matchedRows
    .map((row) => {
      const bundle = context.topicBundles.get(row.topic_id);
      return bundle ? buildMatchedFutureCard(bundle, row) : null;
    })
    .filter((item): item is FutureCard => Boolean(item));

  const existingTitles = new Set(matchedCards.map((card) => card.thesis_title.toLowerCase()));
  const candidateBundles = context.topTopicRows
    .slice(5)
    .map((row) => context.topicBundles.get(row.topic_id))
    .filter((item): item is TopicBundle => Boolean(item))
    .slice(0, 8);

  const generatedCards = await buildGeneratedCards({
    context,
    candidateBundles: candidateBundles.length > 0 ? candidateBundles : matchedCards
      .map((card) => card.topic_id)
      .filter((item): item is string => Boolean(item))
      .map((id) => context.topicBundles.get(id))
      .filter((item): item is TopicBundle => Boolean(item)),
    existingTitles,
  });

  matchedCards.forEach((card, index) => {
    card.rank = index + 1;
  });
  generatedCards.forEach((card, index) => {
    card.rank = matchedCards.length + index + 1;
  });

  const enrichedMatchedCards = await enrichCardsWithAlumniExamples(adminClient, matchedCards);
  const enrichedGeneratedCards = await enrichCardsWithAlumniExamples(adminClient, generatedCards);

  const { data: createdSession, error: createdSessionError } = await adminClient
    .from("future_sessions")
    .insert({
      thesinator_session_id: thesinatorSessionId,
      status: "ready",
      graph_status: "queued",
      graph_progress: 0,
      swarm_status: "queued",
      swarm_progress: 0,
      finalization_status: "queued",
      finalization_progress: 0,
    })
    .select("id")
    .single();

  if (createdSessionError) {
    throw new Error(createdSessionError.message);
  }

  const allCards = [...enrichedMatchedCards, ...enrichedGeneratedCards].map((card) => ({
    future_session_id: createdSession.id,
    source: card.source,
    rank: card.rank,
    display_rank: card.rank,
    topic_id: card.topic_id,
    title: card.thesis_title,
    preview_status: "ready",
    deep_status: "queued",
    swarm_impact_status: "queued",
    card,
    seed_text: composeSwarmSeed(context, card),
  }));

  const { error: insertError } = await adminClient.from("future_session_futures").insert(allCards);
  if (insertError) {
    throw new Error(insertError.message);
  }

  const futureView = await resolveFutureViewState(adminClient, {
    futureSessionId: createdSession.id,
    thesinatorSessionId,
  });

  return json(
    200,
      await assembleSessionResponse(
        adminClient,
        createdSession.id,
        futureView.graph_build,
        futureView.swarm,
        futureView.finalization,
      ),
  );
};

const handleGetSession = async (req: Request, futureSessionId: string) => {
  const { adminClient } = getClients();
  const { data: sessionRow, error: sessionError } = await adminClient
    .from("future_sessions")
    .select(
      `
        id,
        thesinator_session_id,
        graph_status,
        graph_stage_label,
        graph_progress,
        mirofish_project_id,
        graph_task_id,
        graph_id,
        graph_error,
        swarm_status,
        swarm_stage_label,
        swarm_progress,
        swarm_simulation_id,
        swarm_prepare_task_id,
        swarm_runner_status,
        swarm_error,
        finalization_status,
        finalization_stage_label,
        finalization_progress,
        finalization_error
      `,
    )
    .eq("id", futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!sessionRow) {
    return errorResponse(404, "Future session not found.");
  }

  const futureView = await resolveFutureViewState(adminClient, {
    futureSessionId,
    thesinatorSessionId: String(sessionRow.thesinator_session_id),
    graphState: getStoredGraphState(sessionRow as Record<string, unknown>),
    swarmState: getStoredSwarmState(sessionRow as Record<string, unknown>),
    finalizationState: getStoredFinalizationState(sessionRow as Record<string, unknown>),
  });

  return json(
    200,
      await assembleSessionResponse(
        adminClient,
        futureSessionId,
        futureView.graph_build,
        futureView.swarm,
        futureView.finalization,
      ),
  );
};

const handleGetFutureView = async (req: Request, futureSessionId: string) => {
  const { adminClient } = getClients();

  const { data: sessionRow, error: sessionError } = await adminClient
    .from("future_sessions")
    .select(
      `
        id,
        thesinator_session_id,
        graph_status,
        graph_stage_label,
        graph_progress,
        mirofish_project_id,
        graph_task_id,
        graph_id,
        graph_error,
        swarm_status,
        swarm_stage_label,
        swarm_progress,
        swarm_simulation_id,
        swarm_prepare_task_id,
        swarm_runner_status,
        swarm_error,
        finalization_status,
        finalization_stage_label,
        finalization_progress,
        finalization_error
      `,
    )
    .eq("id", futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!sessionRow) {
    return errorResponse(404, "Future session not found.");
  }

  const futureView = await resolveFutureViewState(adminClient, {
    futureSessionId,
    thesinatorSessionId: String(sessionRow.thesinator_session_id),
    graphState: getStoredGraphState(sessionRow as Record<string, unknown>),
    swarmState: getStoredSwarmState(sessionRow as Record<string, unknown>),
    finalizationState: getStoredFinalizationState(sessionRow as Record<string, unknown>),
  });

  return json(200, futureView);
};

const handleGetFuture = async (req: Request, futureSessionId: string, futureId: string) => {
  const { adminClient } = getClients();
  const { data: futureRow, error: futureError } = await adminClient
    .from("future_session_futures")
    .select("id, source, rank, display_rank, saved, deep_status, card, detail, map_nodes, suggested_prompts, swarm_impact")
    .eq("future_session_id", futureSessionId)
    .eq("id", futureId)
    .maybeSingle();

  if (futureError) {
    throw new Error(futureError.message);
  }

  if (!futureRow) {
    return errorResponse(404, "Future not found.");
  }

  const futureCard = hydrateFutureRow(futureRow as Record<string, unknown>);
  let futureDetail =
    futureRow.detail && typeof futureRow.detail === "object" && !Array.isArray(futureRow.detail)
      ? futureRow.detail
      : null;
  let mapNodes = Array.isArray(futureRow.map_nodes) ? futureRow.map_nodes : [];
  let suggestedPrompts = normalizeSuggestedPrompts(futureRow.suggested_prompts);
  let simulationStatus = trimString(futureRow.deep_status) ?? "queued";
  const { data: sessionRow, error: sessionError } = await adminClient
    .from("future_sessions")
    .select(
      `
        id,
        thesinator_session_id,
        graph_status,
        graph_stage_label,
        graph_progress,
        mirofish_project_id,
        graph_task_id,
        graph_id,
        graph_error,
        swarm_status,
        swarm_stage_label,
        swarm_progress,
        swarm_simulation_id,
        swarm_prepare_task_id,
        swarm_runner_status,
        swarm_error,
        finalization_status,
        finalization_stage_label,
        finalization_progress,
        finalization_error
      `,
    )
    .eq("id", futureSessionId)
    .maybeSingle();

  if (sessionError) {
    throw new Error(sessionError.message);
  }

  if (!futureDetail && sessionRow) {
    const futureView = await resolveFutureViewState(adminClient, {
      futureSessionId,
      thesinatorSessionId: String(sessionRow.thesinator_session_id),
      graphState: getStoredGraphState(sessionRow as Record<string, unknown>),
      swarmState: getStoredSwarmState(sessionRow as Record<string, unknown>),
      finalizationState: getStoredFinalizationState(sessionRow as Record<string, unknown>),
    });

    if (futureView.finalization.status === "ready") {
      futureDetail = buildDefaultFutureDetail(futureCard, futureCard.swarm_impact);
      mapNodes = buildMapNodes(futureCard);
      suggestedPrompts = DEFAULT_SUGGESTED_PROMPTS;
      simulationStatus = "ready";

      await adminClient
        .from("future_session_futures")
        .update({
          detail: futureDetail,
          map_nodes: mapNodes,
          suggested_prompts: suggestedPrompts,
          deep_status: "ready",
          swarm_impact_status: "ready",
          mirofish_simulation_id: futureView.swarm.simulation_id,
        })
        .eq("future_session_id", futureSessionId)
        .eq("id", futureId);
    } else {
      return errorResponse(
        409,
        futureView.finalization.status === "failed"
          ? "The swarm could not finalize thesis outcomes for this session."
          : "This thesis is still being finalized. Wait for See your future to finish before opening thesis paths.",
      );
    }
  }

  const { data: messages } = await adminClient
    .from("future_session_messages")
    .select("role, content")
    .eq("future_id", futureId)
    .order("created_at", { ascending: true });

  return json(200, {
    future_card: futureCard,
    future_detail: futureDetail,
    simulation_status: simulationStatus,
    map_nodes: mapNodes,
    suggested_prompts: suggestedPrompts,
    swarm_impact: futureCard.swarm_impact,
    chat_history: (messages ?? []).map((message) => ({
      role: message.role,
      content: message.content,
    })),
  });
};

const buildFallbackChatReply = (detail: FutureDetail, prompt: string, swarmImpact?: SwarmImpact | null) => {
  const question = prompt.trim().toLowerCase();
  if (question.includes("prepare")) {
    return `${detail.future_self_intro} ${swarmImpact?.future_self_angle ?? ""} If I were you, I would start by tightening the thesis scope, lining up the right conversations early, and building one concrete proof point you can show later.`;
  }

  if (question.includes("surprise") || question.includes("differently")) {
    return `${detail.opening_note} What surprised me most was how much momentum came from a few early decisions: the scope, the people, and the willingness to show unfinished work sooner.${swarmImpact?.risks[0] ? ` The biggest risk to manage early was ${swarmImpact.risks[0].toLowerCase()}` : ""}`;
  }

  return `${detail.future_self_intro} ${swarmImpact?.why_this_path ?? "The short version is that this path worked because the thesis turned into something visible, specific, and worth talking about."}`;
};

const handleFutureChat = async (req: Request, futureSessionId: string, futureId: string) => {
  const { adminClient } = getClients();
  const body = await req.json().catch(() => null);
  const message = trimString(body?.message);

  if (!message) {
    return errorResponse(400, "Missing message.");
  }

  const { data: futureRow, error: futureError } = await adminClient
    .from("future_session_futures")
    .select("future_session_id, card, detail, swarm_impact")
    .eq("future_session_id", futureSessionId)
    .eq("id", futureId)
    .maybeSingle();

  if (futureError) {
    throw new Error(futureError.message);
  }

  if (!futureRow) {
    return errorResponse(404, "Future not found.");
  }

  const card = futureRow.card as FutureCard;
  const swarmImpact = futureRow.swarm_impact
    ? normalizeSwarmImpact(futureRow.swarm_impact, card)
    : buildDefaultSwarmImpact(card);
  const detail = futureRow.detail && typeof futureRow.detail === "object" && !Array.isArray(futureRow.detail)
    ? (futureRow.detail as FutureDetail)
    : buildDefaultFutureDetail(card, swarmImpact);

  await adminClient.from("future_session_messages").insert({
    future_id: futureId,
    role: "user",
    content: message,
  });

  const { data: recentMessages } = await adminClient
    .from("future_session_messages")
    .select("role, content")
    .eq("future_id", futureId)
    .order("created_at", { ascending: true })
    .limit(12);

  const history = (recentMessages ?? []).map((item) => `${item.role}: ${item.content}`).join("\n");
  const anthropicResult = await callAnthropicJson(
    detail.persona_brief,
    JSON.stringify(
      {
        task: "Reply as the student's future self in plain text. Stay in character. Keep it grounded and actionable.",
        future_card: toPromptSafeFutureCard(card),
        future_detail: detail,
        swarm_impact: swarmImpact,
        recent_history: history,
        user_message: message,
        strict_output_schema: {
          reply: "string",
        },
      },
      null,
      2,
    ),
  );

  const reply = trimString(anthropicResult?.reply) ?? buildFallbackChatReply(detail, message, swarmImpact);

  await adminClient.from("future_session_messages").insert({
    future_id: futureId,
    role: "assistant",
    content: reply,
  });

  return json(200, { reply });
};

const handleSaveFuture = async (req: Request, futureSessionId: string, futureId: string) => {
  const { adminClient } = getClients();

  const { error: updateError } = await adminClient
    .from("future_session_futures")
    .update({ saved: true })
    .eq("future_session_id", futureSessionId)
    .eq("id", futureId);

  if (updateError) {
    throw new Error(updateError.message);
  }

  const sessionResponse = await assembleSessionResponse(adminClient, futureSessionId);
  return json(200, { saved_future_ids: sessionResponse.saved_future_ids });
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return json(200, { ok: true });
  }

  try {
    const url = new URL(req.url);
    const pathParts = url.pathname.split("/").filter(Boolean);
    const fnIndex = pathParts.lastIndexOf("future-sessions");
    const segments = fnIndex >= 0 ? pathParts.slice(fnIndex + 1) : pathParts;

    if (req.method === "POST" && segments.length === 0) {
      return await handleCreate(req);
    }

    if (req.method === "GET" && segments.length === 1) {
      return await handleGetSession(req, segments[0]);
    }

    if (req.method === "GET" && segments.length === 2 && segments[1] === "future-view") {
      return await handleGetFutureView(req, segments[0]);
    }

    if (req.method === "GET" && segments.length === 2 && segments[1] === "graph") {
      return await handleGetFutureView(req, segments[0]);
    }

    if (segments.length === 4 && segments[1] === "futures") {
      const [futureSessionId, , futureId, action] = segments;

      if (req.method === "POST" && action === "chat") {
        return await handleFutureChat(req, futureSessionId, futureId);
      }

      if (req.method === "POST" && action === "save") {
        return await handleSaveFuture(req, futureSessionId, futureId);
      }
    }

    if (req.method === "GET" && segments.length === 3 && segments[1] === "futures") {
      return await handleGetFuture(req, segments[0], segments[2]);
    }

    return errorResponse(404, "Route not found.");
  } catch (error) {
    console.error(error);
    return errorResponse(500, error instanceof Error ? error.message : "Unexpected error.");
  }
});

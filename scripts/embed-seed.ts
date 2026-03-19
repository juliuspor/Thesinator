import { createClient } from "npm:@supabase/supabase-js@2.49.8";

type TopicRow = {
  id: string;
  title: string;
  search_document: string | null;
};

const supabaseUrl = Deno.env.get("LOCAL_SUPABASE_URL") ?? Deno.env.get("SUPABASE_URL") ?? "";
const supabaseServiceRoleKey = Deno.env.get("LOCAL_SUPABASE_SERVICE_ROLE_KEY") ?? Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "";
const openAiKey = Deno.env.get("OPENAI_API_KEY") ?? "";
const embeddingModel = Deno.env.get("OPENAI_EMBEDDING_MODEL") ?? "text-embedding-3-small";
const forceAll = Deno.env.get("EMBED_FORCE_ALL") === "true";

if (!supabaseUrl || !supabaseServiceRoleKey || !openAiKey) {
  console.error(
    "Missing required env vars. Set LOCAL_SUPABASE_URL/LOCAL_SUPABASE_SERVICE_ROLE_KEY (or SUPABASE_URL/SUPABASE_SERVICE_ROLE_KEY), plus OPENAI_API_KEY.",
  );
  Deno.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

const callOpenAiEmbeddings = async (inputs: string[]): Promise<number[][]> => {
  const response = await fetch("https://api.openai.com/v1/embeddings", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${openAiKey}`,
    },
    body: JSON.stringify({
      model: embeddingModel,
      input: inputs,
    }),
  });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(`OpenAI embeddings failed (${response.status}): ${body}`);
  }

  const payload = (await response.json()) as {
    data?: Array<{ embedding?: number[] }>;
  };

  if (!Array.isArray(payload.data)) {
    throw new Error("OpenAI embeddings response payload did not include a data array.");
  }

  return payload.data.map((entry) => {
    if (!Array.isArray(entry.embedding)) {
      throw new Error("OpenAI embeddings response row missing embedding array.");
    }
    return entry.embedding;
  });
};

const chunk = <T>(input: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < input.length; i += size) {
    chunks.push(input.slice(i, i + size));
  }
  return chunks;
};

const main = async () => {
  console.log("Refreshing topic search documents...");
  const { error: refreshError } = await supabase.rpc("refresh_topic_search_documents");
  if (refreshError) {
    throw new Error(refreshError.message);
  }

  const selectQuery = supabase
    .from("topics")
    .select("id,title,search_document")
    .order("id", { ascending: true });

  const { data: allTopics, error: topicsError } = forceAll
    ? await selectQuery
    : await selectQuery.is("embedding", null);

  if (topicsError) {
    throw new Error(topicsError.message);
  }

  const topics = ((allTopics ?? []) as TopicRow[]).filter(
    (topic) => typeof topic.search_document === "string" && topic.search_document.trim().length > 0,
  );

  if (topics.length === 0) {
    console.log("No topics require embedding backfill.");
    return;
  }

  console.log(`Embedding ${topics.length} topics with model ${embeddingModel}...`);

  const batches = chunk(topics, 20);
  let processed = 0;

  for (const batch of batches) {
    const texts = batch.map((topic) => topic.search_document ?? topic.title);
    const embeddings = await callOpenAiEmbeddings(texts);

    for (let index = 0; index < batch.length; index += 1) {
      const topic = batch[index];
      const embedding = embeddings[index];

      const { error: setEmbeddingError } = await supabase.rpc("set_topic_embedding", {
        p_topic_id: topic.id,
        p_embedding: embedding,
      });

      if (setEmbeddingError) {
        throw new Error(`Failed to persist embedding for topic ${topic.id}: ${setEmbeddingError.message}`);
      }
    }

    processed += batch.length;
    console.log(`Processed ${processed}/${topics.length}`);
  }

  console.log("Topic embedding backfill completed.");
};

main().catch((error) => {
  console.error(error instanceof Error ? error.message : String(error));
  Deno.exit(1);
});

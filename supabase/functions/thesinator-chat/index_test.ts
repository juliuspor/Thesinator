import { assertEquals, assert } from "jsr:@std/assert@1";
import {
  DEFAULT_CONTEXT_SNAPSHOT,
  extractJsonObject,
  isInputMode,
  mergeContextSnapshot,
} from "./_shared.ts";

Deno.test("mergeContextSnapshot merges valid patch fields", () => {
  const merged = mergeContextSnapshot(DEFAULT_CONTEXT_SNAPSHOT, {
    goal_type: "job",
    target_industry: ["fintech", "fintech", "insurance"],
    remote_ok: true,
    duration_months: 6,
    refined_interests: ["applied NLP", "developer tooling"],
  });

  assertEquals(merged.goal_type, "job");
  assertEquals(merged.target_industry, ["fintech", "insurance"]);
  assertEquals(merged.remote_ok, true);
  assertEquals(merged.duration_months, 6);
  assertEquals(merged.refined_interests, ["applied NLP", "developer tooling"]);
});

Deno.test("mergeContextSnapshot ignores invalid patch shapes", () => {
  const merged = mergeContextSnapshot(DEFAULT_CONTEXT_SNAPSHOT, {
    goal_type: ["not-valid"],
    duration_months: "six",
    remote_ok: "yes",
  });

  assertEquals(merged.goal_type, null);
  assertEquals(merged.duration_months, null);
  assertEquals(merged.remote_ok, null);
});

Deno.test("extractJsonObject finds object in wrapped model text", () => {
  const text = `Some preface text\n{"assistant_reply":"Hi","snapshot_patch":{},"next_question_index":2,"is_complete":false}\ntrailing`;
  const parsed = extractJsonObject(text);

  assert(parsed);
  assertEquals(parsed.assistant_reply, "Hi");
  assertEquals(parsed.is_complete, false);
});

Deno.test("isInputMode accepts only supported modes", () => {
  assertEquals(isInputMode("mcq"), true);
  assertEquals(isInputMode("text"), true);
  assertEquals(isInputMode("speech"), true);
  assertEquals(isInputMode("voice"), false);
});

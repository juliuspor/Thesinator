import { supabase } from "@/lib/supabase";
import type { Person, FeaturedTopic, ThesisProject, StudentProfile } from "@/api/types";

// --- People ---

export interface FetchPeopleParams {
  type?: string;
  field_id?: string[];
  search?: string;
  sort?: string;
  limit?: number;
  offset?: number;
}

export async function fetchPeople(
  params: FetchPeopleParams = {}
): Promise<{ people: Person[]; total: number }> {
  if (!supabase) return { people: [], total: 0 };

  let query = supabase.from("people").select("*", { count: "exact" });

  if (params.type) {
    query = query.eq("type", params.type);
  }
  if (params.field_id && params.field_id.length > 0) {
    query = query.overlaps("field_ids", params.field_id);
  }
  if (params.search) {
    query = query.or(
      `first_name.ilike.%${params.search}%,last_name.ilike.%${params.search}%,about.ilike.%${params.search}%,institution_name.ilike.%${params.search}%,title.ilike.%${params.search}%`
    );
  }
  if (params.sort === "field") {
    query = query.order("field_names", { ascending: true });
  } else {
    query = query.order("last_name", { ascending: true });
  }

  const limit = params.limit || 50;
  const offset = params.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("fetchPeople error:", error);
    return { people: [], total: 0 };
  }

  return { people: (data as Person[]) || [], total: count || 0 };
}

// --- Featured Topics ---

export async function fetchFeaturedTopics(
  limit = 6
): Promise<{ topics: FeaturedTopic[] }> {
  if (!supabase) return { topics: [] };

  const { data, error } = await supabase
    .from("topics")
    .select("id, title, description, type, employment, degrees, company_name, university_name, field_names")
    .limit(limit);

  if (error) {
    console.error("fetchFeaturedTopics error:", error);
    return { topics: [] };
  }

  return { topics: (data as FeaturedTopic[]) || [] };
}

// --- Projects ---

export async function fetchProjects(
  studentId?: string
): Promise<{ projects: ThesisProject[] }> {
  if (!supabase) return { projects: [] };

  let query = supabase.from("projects").select("*");

  if (studentId) {
    query = query.eq("student_id", studentId);
  }

  const { data, error } = await query;
  if (error) {
    console.error("fetchProjects error:", error);
    return { projects: [] };
  }

  return { projects: (data as ThesisProject[]) || [] };
}

// --- Student Profile ---

export async function fetchStudentProfile(
  studentId: string
): Promise<StudentProfile> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("student_profiles")
    .select("*")
    .eq("id", studentId)
    .single();

  if (error) throw new Error(error.message);
  return data as StudentProfile;
}

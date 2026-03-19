import { supabase } from "@/lib/supabase";
import type {
  Company,
  CompanyDetail,
  TopicDetail,
  Field,
  Supervisor,
  Expert,
} from "@/api/types";

// --- Companies ---

export interface SearchCompaniesParams {
  q?: string;
  size?: string;
  domain?: string;
  limit?: number;
  offset?: number;
}

export async function searchCompanies(
  params: SearchCompaniesParams = {}
): Promise<{ companies: Company[]; total: number }> {
  if (!supabase) return { companies: [], total: 0 };

  let query = supabase.from("companies").select("*", { count: "exact" });

  if (params.q) {
    query = query.or(`name.ilike.%${params.q}%,about.ilike.%${params.q}%,industry.ilike.%${params.q}%`);
  }
  if (params.size) {
    query = query.eq("size", params.size);
  }
  if (params.domain) {
    query = query.contains("domains", [params.domain]);
  }

  const limit = params.limit || 50;
  const offset = params.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("searchCompanies error:", error);
    return { companies: [], total: 0 };
  }

  return { companies: (data as Company[]) || [], total: count || 0 };
}

export async function getCompany(id: string): Promise<CompanyDetail> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .single();

  if (companyError) throw new Error(companyError.message);

  const { data: topics } = await supabase
    .from("topics")
    .select("*")
    .eq("company_id", id);

  const { data: experts } = await supabase
    .from("experts")
    .select("*")
    .eq("company_id", id);

  return {
    company: company as Company,
    topics: (topics as TopicDetail[]) || [],
    experts: (experts as Expert[]) || [],
  };
}

// --- Topics ---

export interface SearchTopicsParams {
  q?: string;
  field_id?: string;
  company_id?: string;
  university_id?: string;
  type?: string;
  employment?: string;
  limit?: number;
  offset?: number;
}

export async function searchTopics(
  params: SearchTopicsParams = {}
): Promise<{ topics: TopicDetail[]; total: number }> {
  if (!supabase) return { topics: [], total: 0 };

  let query = supabase.from("topics").select("*", { count: "exact" });

  if (params.q) {
    query = query.or(`title.ilike.%${params.q}%,description.ilike.%${params.q}%,company_name.ilike.%${params.q}%,university_name.ilike.%${params.q}%`);
  }
  if (params.field_id) {
    query = query.contains("field_ids", [params.field_id]);
  }
  if (params.company_id) {
    query = query.eq("company_id", params.company_id);
  }
  if (params.university_id) {
    query = query.eq("university_id", params.university_id);
  }
  if (params.type) {
    query = query.eq("type", params.type);
  }
  if (params.employment) {
    query = query.eq("employment", params.employment);
  }

  const limit = params.limit || 50;
  const offset = params.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("searchTopics error:", error);
    return { topics: [], total: 0 };
  }

  return { topics: (data as TopicDetail[]) || [], total: count || 0 };
}

export async function getTopic(
  id: string
): Promise<{ topic: TopicDetail }> {
  if (!supabase) throw new Error("Supabase not configured");

  const { data, error } = await supabase
    .from("topics")
    .select("*")
    .eq("id", id)
    .single();

  if (error) throw new Error(error.message);
  return { topic: data as TopicDetail };
}

// --- Fields ---

export async function getFields(): Promise<{ fields: Field[] }> {
  if (!supabase) return { fields: [] };

  const { data, error } = await supabase.from("fields").select("*");
  if (error) {
    console.error("getFields error:", error);
    return { fields: [] };
  }

  return { fields: (data as Field[]) || [] };
}

// --- Supervisors ---

export interface SearchSupervisorsParams {
  q?: string;
  university_id?: string;
  field_id?: string;
  limit?: number;
  offset?: number;
}

export async function searchSupervisors(
  params: SearchSupervisorsParams = {}
): Promise<{ supervisors: Supervisor[]; total: number }> {
  if (!supabase) return { supervisors: [], total: 0 };

  let query = supabase.from("supervisors").select("*", { count: "exact" });

  if (params.q) {
    query = query.or(`first_name.ilike.%${params.q}%,last_name.ilike.%${params.q}%`);
  }
  if (params.university_id) {
    query = query.eq("university_id", params.university_id);
  }
  if (params.field_id) {
    query = query.contains("field_ids", [params.field_id]);
  }

  const limit = params.limit || 50;
  const offset = params.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("searchSupervisors error:", error);
    return { supervisors: [], total: 0 };
  }

  return { supervisors: (data as Supervisor[]) || [], total: count || 0 };
}

// --- Experts ---

export interface SearchExpertsParams {
  q?: string;
  company_id?: string;
  limit?: number;
  offset?: number;
}

export async function searchExperts(
  params: SearchExpertsParams = {}
): Promise<{ experts: Expert[]; total: number }> {
  if (!supabase) return { experts: [], total: 0 };

  let query = supabase.from("experts").select("*", { count: "exact" });

  if (params.q) {
    query = query.or(`first_name.ilike.%${params.q}%,last_name.ilike.%${params.q}%`);
  }
  if (params.company_id) {
    query = query.eq("company_id", params.company_id);
  }

  const limit = params.limit || 50;
  const offset = params.offset || 0;
  query = query.range(offset, offset + limit - 1);

  const { data, count, error } = await query;
  if (error) {
    console.error("searchExperts error:", error);
    return { experts: [], total: 0 };
  }

  return { experts: (data as Expert[]) || [], total: count || 0 };
}

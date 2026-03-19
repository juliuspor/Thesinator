export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      companies: {
        Row: {
          about: string | null
          created_at: string
          description: string | null
          domains: string[]
          id: string
          industry: string | null
          name: string
          size: string | null
          source_id: string
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          created_at?: string
          description?: string | null
          domains?: string[]
          id: string
          industry?: string | null
          name: string
          size?: string | null
          source_id: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          created_at?: string
          description?: string | null
          domains?: string[]
          id?: string
          industry?: string | null
          name?: string
          size?: string | null
          source_id?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
      expert_fields: {
        Row: {
          expert_id: string
          field_id: string
        }
        Insert: {
          expert_id: string
          field_id: string
        }
        Update: {
          expert_id?: string
          field_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "expert_fields_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expert_fields_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
        ]
      }
      experts: {
        Row: {
          about: string | null
          company_id: string
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          objectives: string[]
          offer_interviews: boolean | null
          source_id: string
          title: string | null
          updated_at: string
        }
        Insert: {
          about?: string | null
          company_id: string
          created_at?: string
          email?: string | null
          first_name: string
          id: string
          last_name: string
          objectives?: string[]
          offer_interviews?: boolean | null
          source_id: string
          title?: string | null
          updated_at?: string
        }
        Update: {
          about?: string | null
          company_id?: string
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          objectives?: string[]
          offer_interviews?: boolean | null
          source_id?: string
          title?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "experts_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
        ]
      }
      fields: {
        Row: {
          created_at: string
          id: string
          name: string
          source_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          name: string
          source_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          name?: string
          source_id?: string
          updated_at?: string
        }
        Relationships: []
      }
      future_session_futures: {
        Row: {
          card: Json
          created_at: string
          deep_status: string
          detail: Json | null
          display_rank: number
          future_session_id: string
          id: string
          map_nodes: Json | null
          mirofish_simulation_id: string | null
          preview_status: string
          rank: number
          saved: boolean
          seed_text: string | null
          source: string
          suggested_prompts: Json
          swarm_impact: Json | null
          swarm_impact_status: string
          title: string
          topic_id: string | null
          updated_at: string
        }
        Insert: {
          card?: Json
          created_at?: string
          deep_status?: string
          detail?: Json | null
          display_rank: number
          future_session_id: string
          id?: string
          map_nodes?: Json | null
          mirofish_simulation_id?: string | null
          preview_status?: string
          rank: number
          saved?: boolean
          seed_text?: string | null
          source: string
          suggested_prompts?: Json
          swarm_impact?: Json | null
          swarm_impact_status?: string
          title: string
          topic_id?: string | null
          updated_at?: string
        }
        Update: {
          card?: Json
          created_at?: string
          deep_status?: string
          detail?: Json | null
          display_rank?: number
          future_session_id?: string
          id?: string
          map_nodes?: Json | null
          mirofish_simulation_id?: string | null
          preview_status?: string
          rank?: number
          saved?: boolean
          seed_text?: string | null
          source?: string
          suggested_prompts?: Json
          swarm_impact?: Json | null
          swarm_impact_status?: string
          title?: string
          topic_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "future_session_futures_future_session_id_fkey"
            columns: ["future_session_id"]
            isOneToOne: false
            referencedRelation: "future_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "future_session_futures_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      future_session_messages: {
        Row: {
          content: string
          created_at: string
          future_id: string
          id: string
          role: string
        }
        Insert: {
          content: string
          created_at?: string
          future_id: string
          id?: string
          role: string
        }
        Update: {
          content?: string
          created_at?: string
          future_id?: string
          id?: string
          role?: string
        }
        Relationships: [
          {
            foreignKeyName: "future_session_messages_future_id_fkey"
            columns: ["future_id"]
            isOneToOne: false
            referencedRelation: "future_session_futures"
            referencedColumns: ["id"]
          },
        ]
      }
      future_sessions: {
        Row: {
          created_at: string
          finalization_error: string | null
          finalization_progress: number
          finalization_stage_label: string | null
          finalization_status: string
          graph_error: string | null
          graph_id: string | null
          graph_progress: number
          graph_stage_label: string | null
          graph_status: string
          graph_task_id: string | null
          id: string
          mirofish_project_id: string | null
          selected_future_id: string | null
          status: string
          swarm_error: string | null
          swarm_prepare_task_id: string | null
          swarm_progress: number
          swarm_runner_status: string | null
          swarm_simulation_id: string | null
          swarm_stage_label: string | null
          swarm_status: string
          thesinator_session_id: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          finalization_error?: string | null
          finalization_progress?: number
          finalization_stage_label?: string | null
          finalization_status?: string
          graph_error?: string | null
          graph_id?: string | null
          graph_progress?: number
          graph_stage_label?: string | null
          graph_status?: string
          graph_task_id?: string | null
          id?: string
          mirofish_project_id?: string | null
          selected_future_id?: string | null
          status?: string
          swarm_error?: string | null
          swarm_prepare_task_id?: string | null
          swarm_progress?: number
          swarm_runner_status?: string | null
          swarm_simulation_id?: string | null
          swarm_stage_label?: string | null
          swarm_status?: string
          thesinator_session_id: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          finalization_error?: string | null
          finalization_progress?: number
          finalization_stage_label?: string | null
          finalization_status?: string
          graph_error?: string | null
          graph_id?: string | null
          graph_progress?: number
          graph_stage_label?: string | null
          graph_status?: string
          graph_task_id?: string | null
          id?: string
          mirofish_project_id?: string | null
          selected_future_id?: string | null
          status?: string
          swarm_error?: string | null
          swarm_prepare_task_id?: string | null
          swarm_progress?: number
          swarm_runner_status?: string | null
          swarm_simulation_id?: string | null
          swarm_stage_label?: string | null
          swarm_status?: string
          thesinator_session_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "future_sessions_thesinator_session_id_fkey"
            columns: ["thesinator_session_id"]
            isOneToOne: true
            referencedRelation: "thesinator_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      project_experts: {
        Row: {
          expert_id: string
          project_id: string
        }
        Insert: {
          expert_id: string
          project_id: string
        }
        Update: {
          expert_id?: string
          project_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_experts_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_experts_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "thesis_projects"
            referencedColumns: ["id"]
          },
        ]
      }
      project_supervisors: {
        Row: {
          project_id: string
          supervisor_id: string
        }
        Insert: {
          project_id: string
          supervisor_id: string
        }
        Update: {
          project_id?: string
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_supervisors_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "thesis_projects"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "project_supervisors_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
        ]
      }
      student_fields: {
        Row: {
          field_id: string
          student_id: string
        }
        Insert: {
          field_id: string
          student_id: string
        }
        Update: {
          field_id?: string
          student_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "student_fields_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "student_fields_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
        ]
      }
      students: {
        Row: {
          about: string | null
          auth_user_id: string | null
          created_at: string
          degree: string
          email: string
          first_name: string
          id: string
          last_name: string
          objectives: string[]
          skills: string[]
          source_id: string
          study_program_id: string
          university_id: string
          updated_at: string
        }
        Insert: {
          about?: string | null
          auth_user_id?: string | null
          created_at?: string
          degree: string
          email: string
          first_name: string
          id?: string
          last_name: string
          objectives?: string[]
          skills?: string[]
          source_id: string
          study_program_id: string
          university_id: string
          updated_at?: string
        }
        Update: {
          about?: string | null
          auth_user_id?: string | null
          created_at?: string
          degree?: string
          email?: string
          first_name?: string
          id?: string
          last_name?: string
          objectives?: string[]
          skills?: string[]
          source_id?: string
          study_program_id?: string
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "students_study_program_id_fkey"
            columns: ["study_program_id"]
            isOneToOne: false
            referencedRelation: "study_programs"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "students_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      study_programs: {
        Row: {
          about: string | null
          created_at: string
          degree: string
          id: string
          name: string
          source_id: string
          university_id: string
          updated_at: string
        }
        Insert: {
          about?: string | null
          created_at?: string
          degree: string
          id: string
          name: string
          source_id: string
          university_id: string
          updated_at?: string
        }
        Update: {
          about?: string | null
          created_at?: string
          degree?: string
          id?: string
          name?: string
          source_id?: string
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "study_programs_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      supervisor_fields: {
        Row: {
          field_id: string
          supervisor_id: string
        }
        Insert: {
          field_id: string
          supervisor_id: string
        }
        Update: {
          field_id?: string
          supervisor_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "supervisor_fields_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "supervisor_fields_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
        ]
      }
      supervisors: {
        Row: {
          about: string | null
          created_at: string
          email: string | null
          first_name: string
          id: string
          last_name: string
          objectives: string[]
          research_interests: string[]
          source_id: string
          title: string | null
          university_id: string
          updated_at: string
        }
        Insert: {
          about?: string | null
          created_at?: string
          email?: string | null
          first_name: string
          id: string
          last_name: string
          objectives?: string[]
          research_interests?: string[]
          source_id: string
          title?: string | null
          university_id: string
          updated_at?: string
        }
        Update: {
          about?: string | null
          created_at?: string
          email?: string | null
          first_name?: string
          id?: string
          last_name?: string
          objectives?: string[]
          research_interests?: string[]
          source_id?: string
          title?: string | null
          university_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "supervisors_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      thesinator_messages: {
        Row: {
          content: string
          created_at: string
          id: string
          input_mode: string | null
          question_id: number | null
          role: string
          session_id: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          input_mode?: string | null
          question_id?: number | null
          role: string
          session_id: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          input_mode?: string | null
          question_id?: number | null
          role?: string
          session_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesinator_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "thesinator_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      thesinator_search_profiles: {
        Row: {
          context_snapshot: Json
          created_at: string
          embedding: string | null
          id: string
          profile_document: string
          session_id: string
          transcript_text: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          context_snapshot: Json
          created_at?: string
          embedding?: string | null
          id?: string
          profile_document: string
          session_id: string
          transcript_text: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          context_snapshot?: Json
          created_at?: string
          embedding?: string | null
          id?: string
          profile_document?: string
          session_id?: string
          transcript_text?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "thesinator_search_profiles_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: true
            referencedRelation: "thesinator_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      thesinator_sessions: {
        Row: {
          client_token: string | null
          completed_at: string | null
          context_snapshot: Json
          created_at: string
          current_question_index: number
          id: string
          status: string
          updated_at: string
          user_id: string | null
        }
        Insert: {
          client_token?: string | null
          completed_at?: string | null
          context_snapshot?: Json
          created_at?: string
          current_question_index?: number
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Update: {
          client_token?: string | null
          completed_at?: string | null
          context_snapshot?: Json
          created_at?: string
          current_question_index?: number
          id?: string
          status?: string
          updated_at?: string
          user_id?: string | null
        }
        Relationships: []
      }
      thesinator_topic_matches: {
        Row: {
          created_at: string
          final_score: number
          rank: number
          reason: Json
          session_id: string
          structured_score: number
          topic_id: string
          vector_score: number
        }
        Insert: {
          created_at?: string
          final_score: number
          rank: number
          reason?: Json
          session_id: string
          structured_score: number
          topic_id: string
          vector_score: number
        }
        Update: {
          created_at?: string
          final_score?: number
          rank?: number
          reason?: Json
          session_id?: string
          structured_score?: number
          topic_id?: string
          vector_score?: number
        }
        Relationships: [
          {
            foreignKeyName: "thesinator_topic_matches_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "thesinator_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesinator_topic_matches_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      thesis_projects: {
        Row: {
          company_id: string | null
          created_at: string
          description: string | null
          id: string
          motivation: string | null
          source_id: string
          state: string
          student_id: string
          title: string
          topic_id: string | null
          university_id: string | null
          updated_at: string
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          motivation?: string | null
          source_id: string
          state: string
          student_id: string
          title: string
          topic_id?: string | null
          university_id?: string | null
          updated_at?: string
        }
        Update: {
          company_id?: string | null
          created_at?: string
          description?: string | null
          id?: string
          motivation?: string | null
          source_id?: string
          state?: string
          student_id?: string
          title?: string
          topic_id?: string | null
          university_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "thesis_projects_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_projects_student_id_fkey"
            columns: ["student_id"]
            isOneToOne: false
            referencedRelation: "students"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_projects_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "thesis_projects_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_experts: {
        Row: {
          expert_id: string
          topic_id: string
        }
        Insert: {
          expert_id: string
          topic_id: string
        }
        Update: {
          expert_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_experts_expert_id_fkey"
            columns: ["expert_id"]
            isOneToOne: false
            referencedRelation: "experts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_experts_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_fields: {
        Row: {
          field_id: string
          topic_id: string
        }
        Insert: {
          field_id: string
          topic_id: string
        }
        Update: {
          field_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_fields_field_id_fkey"
            columns: ["field_id"]
            isOneToOne: false
            referencedRelation: "fields"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_fields_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topic_supervisors: {
        Row: {
          supervisor_id: string
          topic_id: string
        }
        Insert: {
          supervisor_id: string
          topic_id: string
        }
        Update: {
          supervisor_id?: string
          topic_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "topic_supervisors_supervisor_id_fkey"
            columns: ["supervisor_id"]
            isOneToOne: false
            referencedRelation: "supervisors"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topic_supervisors_topic_id_fkey"
            columns: ["topic_id"]
            isOneToOne: false
            referencedRelation: "topics"
            referencedColumns: ["id"]
          },
        ]
      }
      topics: {
        Row: {
          company_id: string | null
          created_at: string
          degrees: string[]
          description: string
          duration_months: number | null
          embedding: string | null
          embedding_updated_at: string | null
          employment: string | null
          employment_type: string | null
          id: string
          location_city: string | null
          nda_required: boolean | null
          paid: boolean | null
          publish_allowed: boolean | null
          remote_ok: boolean | null
          search_document: string | null
          source_id: string
          status: string
          title: string
          type: string
          university_id: string | null
          updated_at: string
          workplace_type: string | null
        }
        Insert: {
          company_id?: string | null
          created_at?: string
          degrees?: string[]
          description: string
          duration_months?: number | null
          embedding?: string | null
          embedding_updated_at?: string | null
          employment?: string | null
          employment_type?: string | null
          id: string
          location_city?: string | null
          nda_required?: boolean | null
          paid?: boolean | null
          publish_allowed?: boolean | null
          remote_ok?: boolean | null
          search_document?: string | null
          source_id: string
          status?: string
          title: string
          type: string
          university_id?: string | null
          updated_at?: string
          workplace_type?: string | null
        }
        Update: {
          company_id?: string | null
          created_at?: string
          degrees?: string[]
          description?: string
          duration_months?: number | null
          embedding?: string | null
          embedding_updated_at?: string | null
          employment?: string | null
          employment_type?: string | null
          id?: string
          location_city?: string | null
          nda_required?: boolean | null
          paid?: boolean | null
          publish_allowed?: boolean | null
          remote_ok?: boolean | null
          search_document?: string | null
          source_id?: string
          status?: string
          title?: string
          type?: string
          university_id?: string | null
          updated_at?: string
          workplace_type?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "topics_company_id_fkey"
            columns: ["company_id"]
            isOneToOne: false
            referencedRelation: "companies"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "topics_university_id_fkey"
            columns: ["university_id"]
            isOneToOne: false
            referencedRelation: "universities"
            referencedColumns: ["id"]
          },
        ]
      }
      universities: {
        Row: {
          about: string | null
          country: string
          created_at: string
          domains: string[]
          id: string
          name: string
          source_id: string
          updated_at: string
          website: string | null
        }
        Insert: {
          about?: string | null
          country: string
          created_at?: string
          domains?: string[]
          id: string
          name: string
          source_id: string
          updated_at?: string
          website?: string | null
        }
        Update: {
          about?: string | null
          country?: string
          created_at?: string
          domains?: string[]
          id?: string
          name?: string
          source_id?: string
          updated_at?: string
          website?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      get_top_thesis_topics: {
        Args: { p_limit?: number; p_session_id: string }
        Returns: {
          final_score: number
          rank: number
          reason: Json
          structured_score: number
          title: string
          topic_id: string
          vector_score: number
        }[]
      }
      make_source_id: {
        Args: { p_entity_id: string; p_prefix: string }
        Returns: string
      }
      refresh_session_top_topics: {
        Args: { p_limit?: number; p_session_id: string }
        Returns: {
          final_score: number
          rank: number
          reason: Json
          structured_score: number
          title: string
          topic_id: string
          vector_score: number
        }[]
      }
      refresh_topic_search_documents: { Args: never; Returns: undefined }
      set_topic_embedding: {
        Args: { p_embedding: number[]; p_topic_id: string }
        Returns: undefined
      }
      topic_search_document: { Args: { p_topic_id: string }; Returns: string }
      upsert_thesinator_search_profile: {
        Args: {
          p_context_snapshot: Json
          p_embedding: number[]
          p_profile_document: string
          p_session_id: string
          p_transcript_text: string
          p_user_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      iceberg_namespaces: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          metadata: Json
          name: string
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          metadata?: Json
          name: string
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          metadata?: Json
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_namespaces_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
        ]
      }
      iceberg_tables: {
        Row: {
          bucket_name: string
          catalog_id: string
          created_at: string
          id: string
          location: string
          name: string
          namespace_id: string
          remote_table_id: string | null
          shard_id: string | null
          shard_key: string | null
          updated_at: string
        }
        Insert: {
          bucket_name: string
          catalog_id: string
          created_at?: string
          id?: string
          location: string
          name: string
          namespace_id: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Update: {
          bucket_name?: string
          catalog_id?: string
          created_at?: string
          id?: string
          location?: string
          name?: string
          namespace_id?: string
          remote_table_id?: string | null
          shard_id?: string | null
          shard_key?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "iceberg_tables_catalog_id_fkey"
            columns: ["catalog_id"]
            isOneToOne: false
            referencedRelation: "buckets_analytics"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "iceberg_tables_namespace_id_fkey"
            columns: ["namespace_id"]
            isOneToOne: false
            referencedRelation: "iceberg_namespaces"
            referencedColumns: ["id"]
          },
        ]
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const


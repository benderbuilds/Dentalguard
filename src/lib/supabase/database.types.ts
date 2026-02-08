export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      organizations: {
        Row: {
          id: string
          name: string
          billing_email: string
          stripe_customer_id: string | null
          stripe_subscription_id: string | null
          plan_type: 'solo' | 'small' | 'medium' | 'large' | 'enterprise'
          trial_ends_at: string | null
          subscription_status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          billing_email: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_type?: 'solo' | 'small' | 'medium' | 'large' | 'enterprise'
          trial_ends_at?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          billing_email?: string
          stripe_customer_id?: string | null
          stripe_subscription_id?: string | null
          plan_type?: 'solo' | 'small' | 'medium' | 'large' | 'enterprise'
          trial_ends_at?: string | null
          subscription_status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      practices: {
        Row: {
          id: string
          organization_id: string
          name: string
          address_line1: string | null
          address_line2: string | null
          city: string | null
          state: string
          zip_code: string | null
          phone: string | null
          dentrix_integration_key: string | null
          settings: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          organization_id: string
          name: string
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state: string
          zip_code?: string | null
          phone?: string | null
          dentrix_integration_key?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          organization_id?: string
          name?: string
          address_line1?: string | null
          address_line2?: string | null
          city?: string | null
          state?: string
          zip_code?: string | null
          phone?: string | null
          dentrix_integration_key?: string | null
          settings?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "practices_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          id: string
          practice_id: string | null
          organization_id: string | null
          email: string
          name: string
          role: 'admin' | 'manager' | 'employee'
          status: 'active' | 'inactive' | 'pending'
          hire_date: string | null
          job_title: string | null
          avatar_url: string | null
          phone: string | null
          is_org_admin: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          practice_id?: string | null
          organization_id?: string | null
          email: string
          name: string
          role?: 'admin' | 'manager' | 'employee'
          status?: 'active' | 'inactive' | 'pending'
          hire_date?: string | null
          job_title?: string | null
          avatar_url?: string | null
          phone?: string | null
          is_org_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practice_id?: string | null
          organization_id?: string | null
          email?: string
          name?: string
          role?: 'admin' | 'manager' | 'employee'
          status?: 'active' | 'inactive' | 'pending'
          hire_date?: string | null
          job_title?: string | null
          avatar_url?: string | null
          phone?: string | null
          is_org_admin?: boolean
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      training_modules: {
        Row: {
          id: string
          title: string
          description: string | null
          type: 'osha' | 'hipaa' | 'hazcom' | 'emergency' | 'state'
          duration_minutes: number
          content_json: Json
          video_url: string | null
          passing_score: number
          frequency_months: number
          state_codes: string[]
          is_active: boolean
          version: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description?: string | null
          type: 'osha' | 'hipaa' | 'hazcom' | 'emergency' | 'state'
          duration_minutes?: number
          content_json?: Json
          video_url?: string | null
          passing_score?: number
          frequency_months?: number
          state_codes?: string[]
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string | null
          type?: 'osha' | 'hipaa' | 'hazcom' | 'emergency' | 'state'
          duration_minutes?: number
          content_json?: Json
          video_url?: string | null
          passing_score?: number
          frequency_months?: number
          state_codes?: string[]
          is_active?: boolean
          version?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: []
      }
      training_assignments: {
        Row: {
          id: string
          user_id: string
          module_id: string
          practice_id: string
          due_date: string
          status: 'pending' | 'in_progress' | 'completed' | 'overdue'
          started_at: string | null
          completed_at: string | null
          score: number | null
          attempts: number
          certificate_url: string | null
          signature_name: string | null
          signature_timestamp: string | null
          progress_json: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          module_id: string
          practice_id: string
          due_date: string
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          started_at?: string | null
          completed_at?: string | null
          score?: number | null
          attempts?: number
          certificate_url?: string | null
          signature_name?: string | null
          signature_timestamp?: string | null
          progress_json?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          module_id?: string
          practice_id?: string
          due_date?: string
          status?: 'pending' | 'in_progress' | 'completed' | 'overdue'
          started_at?: string | null
          completed_at?: string | null
          score?: number | null
          attempts?: number
          certificate_url?: string | null
          signature_name?: string | null
          signature_timestamp?: string | null
          progress_json?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "training_assignments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_assignments_module_id_fkey"
            columns: ["module_id"]
            isOneToOne: false
            referencedRelation: "training_modules"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "training_assignments_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      vaccination_records: {
        Row: {
          id: string
          user_id: string
          practice_id: string
          vaccine_type: 'hep_b' | 'flu' | 'covid' | 'tdap' | 'mmr'
          status: 'vaccinated' | 'declined' | 'in_progress' | 'not_started'
          dose_dates: string[]
          declination_signed_at: string | null
          declination_reason: string | null
          document_url: string | null
          notes: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          practice_id: string
          vaccine_type: 'hep_b' | 'flu' | 'covid' | 'tdap' | 'mmr'
          status?: 'vaccinated' | 'declined' | 'in_progress' | 'not_started'
          dose_dates?: string[]
          declination_signed_at?: string | null
          declination_reason?: string | null
          document_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          practice_id?: string
          vaccine_type?: 'hep_b' | 'flu' | 'covid' | 'tdap' | 'mmr'
          status?: 'vaccinated' | 'declined' | 'in_progress' | 'not_started'
          dose_dates?: string[]
          declination_signed_at?: string | null
          declination_reason?: string | null
          document_url?: string | null
          notes?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vaccination_records_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vaccination_records_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      incident_reports: {
        Row: {
          id: string
          practice_id: string
          reported_by_user_id: string
          affected_user_id: string | null
          incident_type: 'needlestick' | 'exposure' | 'injury' | 'spill' | 'other'
          incident_date: string
          incident_time: string | null
          location: string | null
          description: string
          immediate_actions: string | null
          follow_up_actions: string | null
          witness_names: string[] | null
          document_urls: string[] | null
          is_osha_recordable: boolean
          status: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          reported_by_user_id: string
          affected_user_id?: string | null
          incident_type: 'needlestick' | 'exposure' | 'injury' | 'spill' | 'other'
          incident_date: string
          incident_time?: string | null
          location?: string | null
          description: string
          immediate_actions?: string | null
          follow_up_actions?: string | null
          witness_names?: string[] | null
          document_urls?: string[] | null
          is_osha_recordable?: boolean
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          reported_by_user_id?: string
          affected_user_id?: string | null
          incident_type?: 'needlestick' | 'exposure' | 'injury' | 'spill' | 'other'
          incident_date?: string
          incident_time?: string | null
          location?: string | null
          description?: string
          immediate_actions?: string | null
          follow_up_actions?: string | null
          witness_names?: string[] | null
          document_urls?: string[] | null
          is_osha_recordable?: boolean
          status?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "incident_reports_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_reported_by_user_id_fkey"
            columns: ["reported_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "incident_reports_affected_user_id_fkey"
            columns: ["affected_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          id: string
          practice_id: string
          type: 'exposure_control_plan' | 'manual' | 'form' | 'certificate' | 'policy'
          title: string
          description: string | null
          content: string | null
          file_url: string | null
          version: number
          is_auto_generated: boolean
          is_template: boolean
          metadata: Json
          created_by_user_id: string | null
          last_reviewed_at: string | null
          last_reviewed_by_user_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          type: 'exposure_control_plan' | 'manual' | 'form' | 'certificate' | 'policy'
          title: string
          description?: string | null
          content?: string | null
          file_url?: string | null
          version?: number
          is_auto_generated?: boolean
          is_template?: boolean
          metadata?: Json
          created_by_user_id?: string | null
          last_reviewed_at?: string | null
          last_reviewed_by_user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          type?: 'exposure_control_plan' | 'manual' | 'form' | 'certificate' | 'policy'
          title?: string
          description?: string | null
          content?: string | null
          file_url?: string | null
          version?: number
          is_auto_generated?: boolean
          is_template?: boolean
          metadata?: Json
          created_by_user_id?: string | null
          last_reviewed_at?: string | null
          last_reviewed_by_user_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "documents_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_created_by_user_id_fkey"
            columns: ["created_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "documents_last_reviewed_by_user_id_fkey"
            columns: ["last_reviewed_by_user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      document_signatures: {
        Row: {
          id: string
          document_id: string
          user_id: string
          signature_name: string
          signature_timestamp: string
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          document_id: string
          user_id: string
          signature_name: string
          signature_timestamp?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          document_id?: string
          user_id?: string
          signature_name?: string
          signature_timestamp?: string
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "document_signatures_document_id_fkey"
            columns: ["document_id"]
            isOneToOne: false
            referencedRelation: "documents"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "document_signatures_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      audit_log: {
        Row: {
          id: string
          organization_id: string | null
          practice_id: string | null
          user_id: string | null
          action: string
          entity_type: string
          entity_id: string | null
          old_values: Json | null
          new_values: Json | null
          ip_address: string | null
          user_agent: string | null
          created_at: string
        }
        Insert: {
          id?: string
          organization_id?: string | null
          practice_id?: string | null
          user_id?: string | null
          action: string
          entity_type: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          organization_id?: string | null
          practice_id?: string | null
          user_id?: string | null
          action?: string
          entity_type?: string
          entity_id?: string | null
          old_values?: Json | null
          new_values?: Json | null
          ip_address?: string | null
          user_agent?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "audit_log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "audit_log_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      email_reminders: {
        Row: {
          id: string
          user_id: string
          assignment_id: string | null
          email_type: string
          scheduled_for: string
          sent_at: string | null
          error_message: string | null
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          assignment_id?: string | null
          email_type: string
          scheduled_for: string
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          assignment_id?: string | null
          email_type?: string
          scheduled_for?: string
          sent_at?: string | null
          error_message?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "email_reminders_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "email_reminders_assignment_id_fkey"
            columns: ["assignment_id"]
            isOneToOne: false
            referencedRelation: "training_assignments"
            referencedColumns: ["id"]
          },
        ]
      }
      badges: {
        Row: {
          id: string
          name: string
          description: string | null
          icon_url: string | null
          criteria_json: Json
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          icon_url?: string | null
          criteria_json?: Json
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          icon_url?: string | null
          criteria_json?: Json
          created_at?: string
        }
        Relationships: []
      }
      user_badges: {
        Row: {
          id: string
          user_id: string
          badge_id: string
          earned_at: string
        }
        Insert: {
          id?: string
          user_id: string
          badge_id: string
          earned_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          badge_id?: string
          earned_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_badges_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
        ]
      }
      user_streaks: {
        Row: {
          id: string
          user_id: string
          current_streak: number
          longest_streak: number
          last_completion_date: string | null
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          current_streak?: number
          longest_streak?: number
          last_completion_date?: string | null
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          current_streak?: number
          longest_streak?: number
          last_completion_date?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_streaks_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      open_dental_configs: {
        Row: {
          id: string
          practice_id: string
          customer_api_key_encrypted: string
          is_active: boolean
          last_sync_at: string | null
          sync_error: string | null
          webhook_subscription_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          customer_api_key_encrypted: string
          is_active?: boolean
          last_sync_at?: string | null
          sync_error?: string | null
          webhook_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          customer_api_key_encrypted?: string
          is_active?: boolean
          last_sync_at?: string | null
          sync_error?: string | null
          webhook_subscription_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "open_dental_configs_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: true
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      od_providers: {
        Row: {
          id: string
          practice_id: string
          od_provider_num: number
          abbr: string | null
          first_name: string | null
          last_name: string | null
          is_hygienist: boolean
          is_hidden: boolean
          synced_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          od_provider_num: number
          abbr?: string | null
          first_name?: string | null
          last_name?: string | null
          is_hygienist?: boolean
          is_hidden?: boolean
          synced_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          od_provider_num?: number
          abbr?: string | null
          first_name?: string | null
          last_name?: string | null
          is_hygienist?: boolean
          is_hidden?: boolean
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "od_providers_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      od_operatories: {
        Row: {
          id: string
          practice_id: string
          od_operatory_num: number
          op_name: string | null
          provider_num: number | null
          hygienist_num: number | null
          is_hidden: boolean
          synced_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          od_operatory_num: number
          op_name?: string | null
          provider_num?: number | null
          hygienist_num?: number | null
          is_hidden?: boolean
          synced_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          od_operatory_num?: number
          op_name?: string | null
          provider_num?: number | null
          hygienist_num?: number | null
          is_hidden?: boolean
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "od_operatories_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      od_appointment_types: {
        Row: {
          id: string
          practice_id: string
          od_appointment_type_num: number
          type_name: string | null
          pattern: string | null
          synced_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          od_appointment_type_num: number
          type_name?: string | null
          pattern?: string | null
          synced_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          od_appointment_type_num?: number
          type_name?: string | null
          pattern?: string | null
          synced_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "od_appointment_types_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      chatbot_configs: {
        Row: {
          id: string
          practice_id: string
          embed_key: string
          is_active: boolean
          bot_name: string
          welcome_message: string
          primary_color: string
          logo_url: string | null
          office_hours: Json
          accepted_insurance: Json
          services: Json
          providers_display: Json
          custom_faqs: Json
          system_prompt_additions: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          embed_key?: string
          is_active?: boolean
          bot_name?: string
          welcome_message?: string
          primary_color?: string
          logo_url?: string | null
          office_hours?: Json
          accepted_insurance?: Json
          services?: Json
          providers_display?: Json
          custom_faqs?: Json
          system_prompt_additions?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          embed_key?: string
          is_active?: boolean
          bot_name?: string
          welcome_message?: string
          primary_color?: string
          logo_url?: string | null
          office_hours?: Json
          accepted_insurance?: Json
          services?: Json
          providers_display?: Json
          custom_faqs?: Json
          system_prompt_additions?: string | null
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "chatbot_configs_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: true
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          id: string
          practice_id: string
          embed_key: string
          session_id: string
          status: string
          patient_name: string | null
          patient_email: string | null
          patient_phone: string | null
          patient_dob: string | null
          insurance_carrier: string | null
          reason_for_visit: string | null
          is_new_patient: boolean | null
          is_after_hours: boolean
          od_patient_num: number | null
          od_appointment_num: number | null
          metadata: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          embed_key: string
          session_id: string
          status?: string
          patient_name?: string | null
          patient_email?: string | null
          patient_phone?: string | null
          patient_dob?: string | null
          insurance_carrier?: string | null
          reason_for_visit?: string | null
          is_new_patient?: boolean | null
          is_after_hours?: boolean
          od_patient_num?: number | null
          od_appointment_num?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          embed_key?: string
          session_id?: string
          status?: string
          patient_name?: string | null
          patient_email?: string | null
          patient_phone?: string | null
          patient_dob?: string | null
          insurance_carrier?: string | null
          reason_for_visit?: string | null
          is_new_patient?: boolean | null
          is_after_hours?: boolean
          od_patient_num?: number | null
          od_appointment_num?: number | null
          metadata?: Json
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          id: string
          practice_id: string
          conversation_id: string
          role: string
          content: string
          metadata: Json
          created_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          conversation_id: string
          role: string
          content: string
          metadata?: Json
          created_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          conversation_id?: string
          role?: string
          content?: string
          metadata?: Json
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      morning_summaries: {
        Row: {
          id: string
          practice_id: string
          summary_date: string
          total_conversations: number
          new_leads: number
          appointments_booked: number
          summary_html: string | null
          sent_at: string | null
          created_at: string
        }
        Insert: {
          id?: string
          practice_id: string
          summary_date: string
          total_conversations?: number
          new_leads?: number
          appointments_booked?: number
          summary_html?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          practice_id?: string
          summary_date?: string
          total_conversations?: number
          new_leads?: number
          appointments_booked?: number
          summary_html?: string | null
          sent_at?: string | null
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "morning_summaries_practice_id_fkey"
            columns: ["practice_id"]
            isOneToOne: false
            referencedRelation: "practices"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_training_due_date: {
        Args: {
          p_hire_date: string
          p_frequency_months: number
          p_is_new_hire?: boolean
        }
        Returns: string
      }
      create_audit_log: {
        Args: {
          p_organization_id: string
          p_practice_id: string
          p_user_id: string
          p_action: string
          p_entity_type: string
          p_entity_id: string
          p_old_values?: Json
          p_new_values?: Json
        }
        Returns: string
      }
    }
    Enums: {
      user_role: 'admin' | 'manager' | 'employee'
      user_status: 'active' | 'inactive' | 'pending'
      plan_type: 'solo' | 'small' | 'medium' | 'large' | 'enterprise'
      training_type: 'osha' | 'hipaa' | 'hazcom' | 'emergency' | 'state'
      assignment_status: 'pending' | 'in_progress' | 'completed' | 'overdue'
      vaccination_status: 'vaccinated' | 'declined' | 'in_progress' | 'not_started'
      vaccine_type: 'hep_b' | 'flu' | 'covid' | 'tdap' | 'mmr'
      incident_type: 'needlestick' | 'exposure' | 'injury' | 'spill' | 'other'
      document_type: 'exposure_control_plan' | 'manual' | 'form' | 'certificate' | 'policy'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type Inserts<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type Updates<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
export type Enums<T extends keyof Database['public']['Enums']> = Database['public']['Enums'][T]

-- Phase 1: Engage Chatbot & Open Dental Integration Tables
-- Creates tables for chatbot config, conversations, messages, Open Dental integration

-- ============================================================
-- Open Dental integration config (per-practice customer keys)
-- ============================================================
CREATE TABLE open_dental_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE UNIQUE NOT NULL,
  customer_api_key_encrypted TEXT NOT NULL,
  is_active BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  sync_error TEXT,
  webhook_subscription_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Cached Open Dental provider data
-- ============================================================
CREATE TABLE od_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  od_provider_num BIGINT NOT NULL,
  abbr TEXT,
  first_name TEXT,
  last_name TEXT,
  is_hygienist BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, od_provider_num)
);

-- ============================================================
-- Cached Open Dental operatory data
-- ============================================================
CREATE TABLE od_operatories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  od_operatory_num BIGINT NOT NULL,
  op_name TEXT,
  provider_num BIGINT,
  hygienist_num BIGINT,
  is_hidden BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, od_operatory_num)
);

-- ============================================================
-- Cached Open Dental appointment types
-- ============================================================
CREATE TABLE od_appointment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  od_appointment_type_num BIGINT NOT NULL,
  type_name TEXT,
  pattern TEXT,
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, od_appointment_type_num)
);

-- ============================================================
-- Chatbot configuration (one per practice)
-- ============================================================
CREATE TABLE chatbot_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE UNIQUE NOT NULL,
  embed_key UUID DEFAULT gen_random_uuid() UNIQUE NOT NULL,
  is_active BOOLEAN DEFAULT true,
  bot_name TEXT DEFAULT 'Practice Assistant',
  welcome_message TEXT DEFAULT 'Hi! How can I help you today?',
  primary_color TEXT DEFAULT '#2563eb',
  logo_url TEXT,
  office_hours JSONB DEFAULT '{}',
  accepted_insurance JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  providers_display JSONB DEFAULT '[]',
  custom_faqs JSONB DEFAULT '[]',
  system_prompt_additions TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- ============================================================
-- Chatbot conversations
-- ============================================================
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  embed_key UUID NOT NULL,
  session_id TEXT NOT NULL,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'lead', 'booked', 'closed', 'spam')),
  patient_name TEXT,
  patient_email TEXT,
  patient_phone TEXT,
  patient_dob DATE,
  insurance_carrier TEXT,
  reason_for_visit TEXT,
  is_new_patient BOOLEAN,
  is_after_hours BOOLEAN DEFAULT false,
  od_patient_num BIGINT,
  od_appointment_num BIGINT,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_conversations_practice_id ON conversations(practice_id);
CREATE INDEX idx_conversations_session ON conversations(embed_key, session_id);
CREATE INDEX idx_conversations_status ON conversations(practice_id, status);
CREATE INDEX idx_conversations_created ON conversations(practice_id, created_at DESC);

-- ============================================================
-- Individual messages within conversations
-- ============================================================
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'staff')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_messages_conversation ON messages(conversation_id, created_at);

-- ============================================================
-- Morning summary log
-- ============================================================
CREATE TABLE morning_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  summary_date DATE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  new_leads INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  summary_html TEXT,
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, summary_date)
);

-- ============================================================
-- Enable RLS on all new tables
-- ============================================================
ALTER TABLE open_dental_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_operatories ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_summaries ENABLE ROW LEVEL SECURITY;

-- ============================================================
-- RLS policies using existing helper functions
-- (get_user_practice_id() and is_admin() from migration 00002)
-- ============================================================

-- Admins can manage their practice's Open Dental config
CREATE POLICY "practice_admin_od_configs" ON open_dental_configs FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- Practice members can view cached OD data
CREATE POLICY "practice_view_od_providers" ON od_providers FOR SELECT
  USING (practice_id = public.get_user_practice_id());
CREATE POLICY "admin_manage_od_providers" ON od_providers FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

CREATE POLICY "practice_view_od_operatories" ON od_operatories FOR SELECT
  USING (practice_id = public.get_user_practice_id());
CREATE POLICY "admin_manage_od_operatories" ON od_operatories FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

CREATE POLICY "practice_view_od_appt_types" ON od_appointment_types FOR SELECT
  USING (practice_id = public.get_user_practice_id());
CREATE POLICY "admin_manage_od_appt_types" ON od_appointment_types FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- Admins manage chatbot config; practice members can view
CREATE POLICY "practice_view_chatbot_config" ON chatbot_configs FOR SELECT
  USING (practice_id = public.get_user_practice_id());
CREATE POLICY "admin_manage_chatbot_config" ON chatbot_configs FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- Practice members can view conversations and messages
CREATE POLICY "practice_view_conversations" ON conversations FOR SELECT
  USING (practice_id = public.get_user_practice_id());
CREATE POLICY "admin_manage_conversations" ON conversations FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

CREATE POLICY "practice_view_messages" ON messages FOR SELECT
  USING (practice_id = public.get_user_practice_id());
CREATE POLICY "admin_manage_messages" ON messages FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- Practice members can view morning summaries
CREATE POLICY "practice_view_summaries" ON morning_summaries FOR SELECT
  USING (practice_id = public.get_user_practice_id());
CREATE POLICY "admin_manage_summaries" ON morning_summaries FOR ALL
  USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- ============================================================
-- Updated_at trigger function (reuse for new tables)
-- ============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_open_dental_configs_updated_at
  BEFORE UPDATE ON open_dental_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chatbot_configs_updated_at
  BEFORE UPDATE ON chatbot_configs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_conversations_updated_at
  BEFORE UPDATE ON conversations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

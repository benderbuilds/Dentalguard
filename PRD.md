# DentalPilot — Product Requirements Document

## 1. Executive Summary

DentalPilot is an AI-powered practice operations platform for dental offices. It combines OSHA/HIPAA compliance automation (the existing DentalGuard product) with an AI website chatbot, digital patient intake, Open Dental PMS integration, and practice analytics.

**Target customer:** Independent dental practices and small groups (1-5 locations) using Open Dental as their PMS.

**Pricing tiers:**
- **Comply** ($199/mo): OSHA/HIPAA compliance suite only
- **Engage** ($399/mo): Comply + AI chatbot + after-hours lead capture
- **Complete** ($599/mo): Engage + Open Dental live scheduling + intake forms + analytics

---

## 2. Product Modules

### 2.1 COMPLY (Existing DentalGuard — Rebrand Only)

The existing compliance module stays functionally the same. It includes:
- Training module system (assign, track, complete OSHA/HIPAA training)
- Document repository (SDS sheets, policies, exposure control plans)
- Inspection mode & compliance packets (audit-ready checklists)
- Onboarding wizard (new practice setup flow)

**Work required:** Rename DentalGuard → DentalPilot throughout UI, update metadata, logos, and landing page copy. No functional changes.

### 2.2 ENGAGE (New — AI Chatbot)

#### 2.2.1 Embeddable Website Widget

A lightweight chatbot widget that dental practices embed on their website with a single `<script>` tag.

**Requirements:**
- Single JS file (<100KB gzipped) that renders a floating chat button in the bottom-right corner
- Clicking opens a chat window with the practice's branding (name, colors, logo)
- Works on all modern browsers, mobile and desktop
- Does NOT require React on the host site — self-contained with its own React runtime
- Communicates with our backend via a public REST endpoint (NOT tRPC, NOT direct Supabase)
- Practice identified by a public embed key (UUID) in the script tag: `<script src="https://app.dentalpilot.com/widget.js" data-key="abc123"></script>`

**Chat behavior:**
- Welcome message is configurable per practice
- AI understands dental terminology and can classify patient intent (cleaning, emergency, cosmetic, orthodontic, etc.)
- AI answers FAQs using practice-specific knowledge (hours, location, accepted insurance, parking, procedure info)
- AI collects new patient information conversationally: name, phone, email, DOB, insurance carrier, reason for visit
- AI deflects clinical questions: "I can't provide medical advice, but let's get you scheduled with Dr. [Name] to discuss that"
- When Open Dental is connected (Complete tier): AI offers real-time appointment slots and books directly
- When Open Dental is NOT connected (Engage tier): AI captures the lead and sends it to the practice dashboard + email
- Conversation history persists within the browser session (localStorage) but resets on new visits
- After-hours behavior: same as business hours, but adds "Our office is currently closed. I can help you schedule for when we're open" context

**Widget configuration (admin dashboard):**
- Bot name (e.g., "Sarah" or "Practice Assistant")
- Welcome message
- Primary brand color (hex)
- Practice logo URL
- Office hours (per day of week, open/close times)
- Accepted insurance carriers (list)
- Provider list with specialties
- Services offered
- Custom FAQ entries (question/answer pairs the practice can add)
- Toggle: AI chatbot on/off

#### 2.2.2 Conversation Management Dashboard

**Requirements:**
- Real-time feed of all chatbot conversations across the practice's website
- Each conversation shows: timestamp, patient name (if collected), status (new lead / booked / in-progress / closed), message thread
- Staff can jump into any conversation and take over from the AI (sends a Supabase Realtime message to the widget to switch to "live agent" mode)
- Filter by: date range, status, new patients only
- Mark conversations as: contacted, booked, lost, spam

#### 2.2.3 After-Hours Lead Capture

**Requirements:**
- All conversations where a patient provides contact info are saved as "leads" in the database
- Morning summary email sent to the practice at a configurable time (default 7am practice timezone)
- Email includes: number of overnight conversations, new leads with name/phone/email/reason, any appointment requests
- Uses Resend for email delivery

### 2.3 INTAKE (New — Digital Patient Forms)

#### 2.3.1 Intake Form Builder (Phase 2 — Not MVP)

For MVP, provide a single default "New Patient Intake" form that collects:
- Personal info: full name, DOB, address, phone, email
- Insurance: carrier, group #, member ID, subscriber name/DOB
- Medical history: allergies, medications, conditions (checkbox list of common items)
- Dental history: last visit date, reason for visit, dental concerns
- Emergency contact
- Consent signature (type-to-sign)

**Requirements:**
- Form is accessible via a unique URL per practice: `https://app.dentalpilot.com/intake/[practice-slug]`
- Can also be triggered from the chatbot: "I'll send you a link to fill out your intake form" → generates a session-linked URL
- Submissions are stored in Supabase and visible in the dashboard
- When Open Dental is connected: submitted intake data can be pushed to create/update a Patient record via the API
- HIPAA compliant: encrypted at rest (Supabase default), encrypted in transit (HTTPS), no PHI in logs

### 2.4 INSIGHTS (New — Practice Analytics)

#### 2.4.1 Dashboard Metrics (Phase 2)

For MVP, provide only the Morning Summary Email (section 2.2.3). Full analytics dashboard comes in Phase 2.

Future metrics:
- Chatbot conversations per day/week/month
- Lead conversion rate (conversation → booked appointment)
- After-hours vs business-hours split
- Top patient questions / intents
- Average response time
- Compliance training completion rates

### 2.5 OPEN DENTAL INTEGRATION

#### 2.5.1 Connection Setup

**Requirements:**
- Settings page where practice admin enters their Open Dental Customer API Key
- We store the key encrypted in Supabase (use Supabase Vault or encrypt before storing)
- "Test Connection" button that calls GET /patients?limit=1 to verify the key works
- Status indicator: Connected / Disconnected / Error
- If connection fails, show clear error message and troubleshooting steps (eConnector must be running, API must be enabled in Open Dental)

#### 2.5.2 Data Sync

**Requirements:**
- On initial connection: pull Providers (GET /providers), Operatories (GET /operatories), AppointmentTypes (GET /appointmenttypes), and Schedules
- Cache this data in Supabase (refresh every 15 minutes via Vercel Cron)
- Subscribe to Appointment table changes via Open Dental webhooks (POST /subscriptions with WatchTable: "Appointment")
- Webhook endpoint at /api/webhooks/open-dental receives appointment changes and updates our local cache

#### 2.5.3 Appointment Booking Flow (via Chatbot)

**Requirements:**
1. Patient tells chatbot what they need
2. AI classifies procedure type and maps to provider type (dentist vs hygienist) and appointment type
3. Backend calls GET /appointments/Slots for the next 10 business days
4. AI presents 3-5 available time options to patient
5. Patient selects a time
6. If existing patient: GET /patients/Simple by name + DOB to find their PatNum
7. If new patient: POST /patients to create record, then POST /appointments to book
8. POST /commlogs to log the interaction in Open Dental
9. Confirm to patient with date, time, provider name, and any prep instructions
10. If any step fails (OD offline, no slots, API error): gracefully fall back to lead capture mode

---

## 3. Technical Requirements

### 3.1 Security & Compliance

- All data encrypted at rest (Supabase default) and in transit (HTTPS/TLS)
- Row-Level Security on every Supabase table — practices can never see each other's data
- BAA with Supabase (available on Pro plan)
- No PHI in application logs, error tracking, or analytics
- Chatbot widget communicates only with our API, never directly with Supabase or Open Dental
- Open Dental API keys stored encrypted (Supabase Vault or application-level encryption)
- Session tokens for widget conversations are short-lived and practice-scoped

### 3.2 Performance

- Widget JS bundle: <100KB gzipped
- Widget load time: <1 second on 3G
- Chatbot response time: <3 seconds (AI generation)
- Open Dental API calls: <2 seconds per request (budget for 10-hop chain)
- Dashboard page loads: <2 seconds

### 3.3 Multi-Tenancy

- Every API route validates that the authenticated user belongs to the practice they're accessing
- Widget public endpoint validates the embed key matches a real practice
- Rate limiting on the public chat endpoint: 30 messages per session per hour (prevent abuse)
- Rate limiting on widget load: 1000 unique sessions per practice per day (flag anomalies)

---

## 4. Database Schema

### New Tables (in addition to existing DentalGuard tables)

```sql
-- Practice table (may need to be extended from existing)
-- Add columns: plan, timezone, slug

-- Open Dental integration
-- NOTE: The Open Dental developer API key is a platform-wide secret.
-- Store it as an environment variable (OPEN_DENTAL_DEVELOPER_KEY), NOT in the database.
-- Only per-practice customer keys are stored here (encrypted).
CREATE TABLE open_dental_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE UNIQUE,
  customer_api_key_encrypted TEXT NOT NULL, -- encrypted via Supabase Vault or app-level encryption
  is_active BOOLEAN DEFAULT false,
  last_sync_at TIMESTAMPTZ,
  webhook_subscription_id TEXT, -- Open Dental subscription ID
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Cached Open Dental data
CREATE TABLE od_providers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  od_provider_num BIGINT NOT NULL,
  abbr TEXT,
  first_name TEXT,
  last_name TEXT,
  is_hygienist BOOLEAN DEFAULT false,
  is_hidden BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, od_provider_num)
);

CREATE TABLE od_operatories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  od_operatory_num BIGINT NOT NULL,
  op_name TEXT,
  provider_num BIGINT,
  hygienist_num BIGINT,
  is_hidden BOOLEAN DEFAULT false,
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, od_operatory_num)
);

CREATE TABLE od_appointment_types (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  od_appointment_type_num BIGINT NOT NULL,
  type_name TEXT,
  pattern TEXT, -- time pattern in 5-min increments
  synced_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, od_appointment_type_num)
);

-- Chatbot configuration
CREATE TABLE chatbot_configs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE UNIQUE,
  embed_key UUID DEFAULT gen_random_uuid() UNIQUE, -- public key for widget
  is_active BOOLEAN DEFAULT true,
  bot_name TEXT DEFAULT 'Practice Assistant',
  welcome_message TEXT DEFAULT 'Hi! How can I help you today?',
  primary_color TEXT DEFAULT '#2563eb',
  logo_url TEXT,
  office_hours JSONB DEFAULT '{}',
  accepted_insurance JSONB DEFAULT '[]',
  services JSONB DEFAULT '[]',
  providers_display JSONB DEFAULT '[]', -- simplified provider info for chatbot context
  custom_faqs JSONB DEFAULT '[]', -- [{question, answer}]
  system_prompt_additions TEXT, -- practice-specific prompt additions
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  embed_key UUID NOT NULL, -- which widget initiated this
  session_id TEXT NOT NULL, -- browser session identifier
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'lead', 'booked', 'closed', 'spam')),
  patient_name TEXT,
  patient_email TEXT,
  patient_phone TEXT,
  patient_dob DATE,
  insurance_carrier TEXT,
  reason_for_visit TEXT,
  is_new_patient BOOLEAN,
  is_after_hours BOOLEAN DEFAULT false,
  od_patient_num BIGINT, -- linked Open Dental PatNum if identified/created
  od_appointment_num BIGINT, -- linked appointment if booked
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Individual messages within conversations
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE NOT NULL,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system', 'staff')),
  content TEXT NOT NULL,
  metadata JSONB DEFAULT '{}', -- intent classification, tool calls, etc.
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Intake form submissions
CREATE TABLE intake_submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id), -- nullable, may come from direct link
  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'synced_to_od', 'archived')),
  form_data JSONB NOT NULL, -- structured patient intake data
  od_patient_num BIGINT, -- set after syncing to Open Dental
  submitted_at TIMESTAMPTZ DEFAULT now(),
  reviewed_at TIMESTAMPTZ,
  reviewed_by UUID REFERENCES auth.users(id)
);

-- Morning summary log
CREATE TABLE morning_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  practice_id UUID REFERENCES practices(id) ON DELETE CASCADE,
  summary_date DATE NOT NULL,
  total_conversations INTEGER DEFAULT 0,
  new_leads INTEGER DEFAULT 0,
  appointments_booked INTEGER DEFAULT 0,
  summary_html TEXT, -- rendered email content
  sent_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(practice_id, summary_date)
);

-- RLS: enable on all new tables
ALTER TABLE open_dental_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_providers ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_operatories ENABLE ROW LEVEL SECURITY;
ALTER TABLE od_appointment_types ENABLE ROW LEVEL SECURITY;
ALTER TABLE chatbot_configs ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE morning_summaries ENABLE ROW LEVEL SECURITY;

-- RLS policies: every table uses the same practice_members check.
-- Users can only access rows belonging to practices they are a member of.

CREATE POLICY "practice_isolation" ON open_dental_configs FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON od_providers FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON od_operatories FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON od_appointment_types FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON chatbot_configs FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON conversations FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON messages FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON intake_submissions FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));

CREATE POLICY "practice_isolation" ON morning_summaries FOR ALL
  USING (practice_id IN (SELECT practice_id FROM practice_members WHERE user_id = auth.uid()));
```

---

## 5. API Design

### 5.1 Public Endpoints (No Auth — Widget Uses These)

```
POST /api/chat
  Body: { embedKey, sessionId, message }
  Returns: { response, conversationId, metadata }

  IMPORTANT: Conversation history is loaded server-side from the messages table
  using the sessionId. The client sends only the new message, never prior history.
  This prevents prompt injection attacks where an attacker could fabricate
  assistant/system messages to bypass safety guardrails or extract the system prompt.

  This is the main chatbot endpoint. It:
  1. Validates embedKey against chatbot_configs
  2. Loads practice context (hours, insurance, providers, FAQs)
  3. Loads conversation history from the messages table (by sessionId + embedKey)
  4. Stores the new user message in the database
  5. Sends full conversation to Claude with practice-specific system prompt
  6. If Claude determines scheduling intent + OD is connected: calls Open Dental API
  7. Stores the assistant response in the database
  8. Returns AI response

GET /api/widget/config?key={embedKey}
  Returns: { botName, welcomeMessage, primaryColor, logoUrl, officeHours }

  Widget calls this on load to get branding/config. Cached aggressively.

POST /api/intake/{practiceSlug}
  Body: { formData }
  Returns: { submissionId, success }

  Public intake form submission endpoint.
```

### 5.2 Authenticated Endpoints (tRPC Routers)

```
engage.getConversations      — list conversations with filters
engage.getConversation       — single conversation with messages
engage.updateConversation    — update status, notes
engage.getChatbotConfig      — get widget configuration
engage.updateChatbotConfig   — update widget configuration
engage.getLeads              — filtered view of lead-status conversations
engage.getDashboardStats     — conversation counts, conversion rates

intake.getSubmissions        — list intake form submissions
intake.getSubmission         — single submission detail
intake.updateSubmission      — mark as reviewed, sync to OD
intake.syncToOpenDental      — push intake data to OD patient record

openDental.getConfig         — get OD connection status
openDental.saveConfig        — save/update OD API key
openDental.testConnection    — verify OD API key works
openDental.syncNow           — trigger manual data sync
openDental.getProviders      — cached providers list
openDental.getOperatories    — cached operatories list

insights.getMorningSummary   — get today's or specific date's summary
insights.getDashboardStats   — aggregate metrics (Phase 2)

settings.getPractice         — practice profile
settings.updatePractice      — update practice info
settings.getBilling          — subscription status (Phase 2, Stripe)
```

---

## 6. AI System Prompt Architecture

Each chatbot conversation uses a system prompt assembled from:

```
BASE_PROMPT (universal dental chatbot behavior)
+ PRACTICE_CONTEXT (hours, location, insurance, services, providers)
+ CUSTOM_FAQS (practice-specific Q&A pairs)
+ SCHEDULING_INSTRUCTIONS (if Open Dental is connected)
+ COMPLIANCE_GUARDRAILS (no clinical advice, HIPAA-safe language)
```

The base prompt should instruct the AI to:
1. Be warm, professional, and concise
2. Identify the patient's intent early (scheduling, question, emergency, intake)
3. Collect patient info naturally through conversation, not as a form
4. Never provide clinical/medical advice
5. Use the practice's actual provider names and services
6. Know when to escalate to "please call the office" (true emergencies, complex insurance questions)
7. When scheduling: present options clearly with date, time, and provider name
8. After collecting contact info: confirm and let them know the office will follow up

---

## 7. Widget Technical Spec

### Build System
- Separate Vite project in `/widget` directory
- Compiles to a single IIFE bundle: `dentalpilot-widget.js`
- Includes React 18 runtime (tree-shaken)
- CSS is injected via JS (no separate stylesheet)
- Shadow DOM for style isolation from host site

### Embed Code
```html
<script src="https://app.dentalpilot.com/widget.js" data-key="EMBED_KEY_HERE" async></script>
```

### Widget Behavior
1. Script loads → reads `data-key` attribute
2. Fetches config from `/api/widget/config?key=...`
3. Renders floating button with practice's primary color
4. On click → opens chat window
5. Generates a session ID (stored in localStorage)
6. On each message → POST to `/api/chat` with the new message only (server loads history)
7. Displays AI response with typing indicator
8. If patient provides contact info → conversation status updates to "lead"
9. If appointment is booked → conversation status updates to "booked"

### Chat UI Components
- Floating action button (bottom-right, configurable color)
- Chat window (400px wide, 600px tall, responsive on mobile)
- Message bubbles (user = right/colored, assistant = left/gray)
- Typing indicator (three dots animation)
- Quick reply buttons (for common intents: "Book appointment", "Hours & location", "Insurance")
- Patient info collection cards (inline forms for name, phone, email)
- Appointment picker card (shows available slots as tappable buttons)
- Powered by DentalPilot badge (bottom of chat window — backlink for marketing)

---

## 8. Non-Functional Requirements

### Reliability
- Chatbot must gracefully handle Open Dental downtime (fall back to lead capture)
- Chatbot must gracefully handle Claude API errors (show friendly "let me connect you with the office" message)
- Morning summary emails must have retry logic (3 attempts, 5-minute intervals)

### Observability
- Log all chatbot conversations to database (never to console/external logging with PHI)
- Track: response times, error rates, conversation completion rates
- Alert if Open Dental sync fails 3+ times consecutively

### Scalability
- Design for 100 practices initially, 1000 practices within 12 months
- Each practice may have 50-200 chatbot conversations per month
- Vercel serverless functions handle the API load; Supabase handles the database load

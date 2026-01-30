-- DentalGuard Database Schema
-- Multi-tenant compliance management for dental practices

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enums
CREATE TYPE user_role AS ENUM ('admin', 'manager', 'employee');
CREATE TYPE user_status AS ENUM ('active', 'inactive', 'pending');
CREATE TYPE plan_type AS ENUM ('solo', 'small', 'medium', 'large', 'enterprise');
CREATE TYPE training_type AS ENUM ('osha', 'hipaa', 'hazcom', 'emergency', 'state');
CREATE TYPE assignment_status AS ENUM ('pending', 'in_progress', 'completed', 'overdue');
CREATE TYPE vaccination_status AS ENUM ('vaccinated', 'declined', 'in_progress', 'not_started');
CREATE TYPE vaccine_type AS ENUM ('hep_b', 'flu', 'covid', 'tdap', 'mmr');
CREATE TYPE incident_type AS ENUM ('needlestick', 'exposure', 'injury', 'spill', 'other');
CREATE TYPE document_type AS ENUM ('exposure_control_plan', 'manual', 'form', 'certificate', 'policy');

-- Organizations (DSO or single practice billing entity)
CREATE TABLE organizations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    billing_email VARCHAR(255) NOT NULL,
    stripe_customer_id VARCHAR(255),
    stripe_subscription_id VARCHAR(255),
    plan_type plan_type NOT NULL DEFAULT 'solo',
    trial_ends_at TIMESTAMPTZ,
    subscription_status VARCHAR(50) DEFAULT 'trialing',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Practices (individual locations)
CREATE TABLE practices (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    address_line1 VARCHAR(255),
    address_line2 VARCHAR(255),
    city VARCHAR(100),
    state VARCHAR(2) NOT NULL,
    zip_code VARCHAR(10),
    phone VARCHAR(20),
    dentrix_integration_key VARCHAR(255),
    settings JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Users (staff members) - extends Supabase auth.users
CREATE TABLE users (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    practice_id UUID REFERENCES practices(id) ON DELETE SET NULL,
    organization_id UUID REFERENCES organizations(id) ON DELETE CASCADE,
    email VARCHAR(255) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    role user_role NOT NULL DEFAULT 'employee',
    status user_status NOT NULL DEFAULT 'pending',
    hire_date DATE,
    job_title VARCHAR(100),
    avatar_url VARCHAR(500),
    phone VARCHAR(20),
    is_org_admin BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Training Modules
CREATE TABLE training_modules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT,
    type training_type NOT NULL,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    content_json JSONB NOT NULL DEFAULT '{}',
    video_url VARCHAR(500),
    passing_score INTEGER NOT NULL DEFAULT 80,
    frequency_months INTEGER NOT NULL DEFAULT 12,
    state_codes VARCHAR(2)[] DEFAULT '{}',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    version INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Training Assignments
CREATE TABLE training_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    module_id UUID NOT NULL REFERENCES training_modules(id) ON DELETE CASCADE,
    practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    due_date DATE NOT NULL,
    status assignment_status NOT NULL DEFAULT 'pending',
    started_at TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    score INTEGER,
    attempts INTEGER NOT NULL DEFAULT 0,
    certificate_url VARCHAR(500),
    signature_name VARCHAR(255),
    signature_timestamp TIMESTAMPTZ,
    progress_json JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, module_id, due_date)
);

-- Vaccination Records
CREATE TABLE vaccination_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    vaccine_type vaccine_type NOT NULL,
    status vaccination_status NOT NULL DEFAULT 'not_started',
    dose_dates DATE[] DEFAULT '{}',
    declination_signed_at TIMESTAMPTZ,
    declination_reason TEXT,
    document_url VARCHAR(500),
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, vaccine_type)
);

-- Incident Reports
CREATE TABLE incident_reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    reported_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE SET NULL,
    affected_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    incident_type incident_type NOT NULL,
    incident_date DATE NOT NULL,
    incident_time TIME,
    location VARCHAR(255),
    description TEXT NOT NULL,
    immediate_actions TEXT,
    follow_up_actions TEXT,
    witness_names TEXT[],
    document_urls VARCHAR(500)[],
    is_osha_recordable BOOLEAN DEFAULT FALSE,
    status VARCHAR(50) DEFAULT 'open',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Documents
CREATE TABLE documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    practice_id UUID NOT NULL REFERENCES practices(id) ON DELETE CASCADE,
    type document_type NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    content TEXT,
    file_url VARCHAR(500),
    version INTEGER NOT NULL DEFAULT 1,
    is_auto_generated BOOLEAN DEFAULT FALSE,
    is_template BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}',
    created_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    last_reviewed_at TIMESTAMPTZ,
    last_reviewed_by_user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Document Signatures
CREATE TABLE document_signatures (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    document_id UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    signature_name VARCHAR(255) NOT NULL,
    signature_timestamp TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audit Log
CREATE TABLE audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    organization_id UUID REFERENCES organizations(id) ON DELETE SET NULL,
    practice_id UUID REFERENCES practices(id) ON DELETE SET NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(100) NOT NULL,
    entity_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Email Reminders Queue
CREATE TABLE email_reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    assignment_id UUID REFERENCES training_assignments(id) ON DELETE CASCADE,
    email_type VARCHAR(50) NOT NULL,
    scheduled_for TIMESTAMPTZ NOT NULL,
    sent_at TIMESTAMPTZ,
    error_message TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Gamification: Badges
CREATE TABLE badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL,
    description TEXT,
    icon_url VARCHAR(500),
    criteria_json JSONB NOT NULL DEFAULT '{}',
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- User Badges (earned badges)
CREATE TABLE user_badges (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    badge_id UUID NOT NULL REFERENCES badges(id) ON DELETE CASCADE,
    earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, badge_id)
);

-- User Streaks (completion streaks)
CREATE TABLE user_streaks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    current_streak INTEGER NOT NULL DEFAULT 0,
    longest_streak INTEGER NOT NULL DEFAULT 0,
    last_completion_date DATE,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id)
);

-- Indexes for performance
CREATE INDEX idx_practices_organization ON practices(organization_id);
CREATE INDEX idx_users_practice ON users(practice_id);
CREATE INDEX idx_users_organization ON users(organization_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_training_assignments_user ON training_assignments(user_id);
CREATE INDEX idx_training_assignments_practice ON training_assignments(practice_id);
CREATE INDEX idx_training_assignments_status ON training_assignments(status);
CREATE INDEX idx_training_assignments_due_date ON training_assignments(due_date);
CREATE INDEX idx_vaccination_records_user ON vaccination_records(user_id);
CREATE INDEX idx_incident_reports_practice ON incident_reports(practice_id);
CREATE INDEX idx_incident_reports_date ON incident_reports(incident_date);
CREATE INDEX idx_documents_practice ON documents(practice_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_audit_log_organization ON audit_log(organization_id);
CREATE INDEX idx_audit_log_created_at ON audit_log(created_at);
CREATE INDEX idx_email_reminders_scheduled ON email_reminders(scheduled_for) WHERE sent_at IS NULL;

-- Row Level Security Policies
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE practices ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE training_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE vaccination_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE incident_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_signatures ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_badges ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_streaks ENABLE ROW LEVEL SECURITY;

-- Organizations: Users can only see their own organization
CREATE POLICY "Users can view own organization" ON organizations
    FOR SELECT USING (
        id IN (SELECT organization_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Org admins can update own organization" ON organizations
    FOR UPDATE USING (
        id IN (SELECT organization_id FROM users WHERE id = auth.uid() AND is_org_admin = TRUE)
    );

-- Practices: Users can see practices in their organization
CREATE POLICY "Users can view practices in their organization" ON practices
    FOR SELECT USING (
        organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Org admins can manage practices" ON practices
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid() AND (is_org_admin = TRUE OR role = 'admin'))
    );

-- Users: Can see users in same organization
CREATE POLICY "Users can view users in their organization" ON users
    FOR SELECT USING (
        organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (
        organization_id IN (SELECT organization_id FROM users WHERE id = auth.uid() AND (is_org_admin = TRUE OR role = 'admin'))
    );

-- Training modules: Everyone can view active modules
CREATE POLICY "Anyone can view active training modules" ON training_modules
    FOR SELECT USING (is_active = TRUE);

-- Training assignments: Users can see their own, admins can see all in practice
CREATE POLICY "Users can view own assignments" ON training_assignments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view practice assignments" ON training_assignments
    FOR SELECT USING (
        practice_id IN (
            SELECT practice_id FROM users
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
        )
    );

CREATE POLICY "Users can update own assignments" ON training_assignments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage assignments" ON training_assignments
    FOR ALL USING (
        practice_id IN (
            SELECT practice_id FROM users
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
        )
    );

-- Vaccination records: Users see own, admins see practice
CREATE POLICY "Users can view own vaccination records" ON vaccination_records
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view practice vaccination records" ON vaccination_records
    FOR SELECT USING (
        practice_id IN (
            SELECT practice_id FROM users
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
        )
    );

CREATE POLICY "Admins can manage vaccination records" ON vaccination_records
    FOR ALL USING (
        practice_id IN (
            SELECT practice_id FROM users
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
        )
    );

-- Incident reports: Admins in practice
CREATE POLICY "Admins can manage incident reports" ON incident_reports
    FOR ALL USING (
        practice_id IN (
            SELECT practice_id FROM users
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
        )
    );

CREATE POLICY "Users can report incidents" ON incident_reports
    FOR INSERT WITH CHECK (
        practice_id IN (SELECT practice_id FROM users WHERE id = auth.uid())
    );

-- Documents: Practice members can view
CREATE POLICY "Practice members can view documents" ON documents
    FOR SELECT USING (
        practice_id IN (SELECT practice_id FROM users WHERE id = auth.uid())
    );

CREATE POLICY "Admins can manage documents" ON documents
    FOR ALL USING (
        practice_id IN (
            SELECT practice_id FROM users
            WHERE id = auth.uid() AND (role = 'admin' OR role = 'manager')
        )
    );

-- Document signatures: Users can sign
CREATE POLICY "Users can view own signatures" ON document_signatures
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create signatures" ON document_signatures
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- Audit log: Admins can view
CREATE POLICY "Admins can view audit log" ON audit_log
    FOR SELECT USING (
        organization_id IN (
            SELECT organization_id FROM users
            WHERE id = auth.uid() AND (is_org_admin = TRUE OR role = 'admin')
        )
    );

-- Email reminders: System managed
CREATE POLICY "Users can view own reminders" ON email_reminders
    FOR SELECT USING (user_id = auth.uid());

-- Badges: Everyone can view
CREATE POLICY "Anyone can view badges" ON badges
    FOR SELECT USING (TRUE);

-- User badges: Users can view
CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Practice members can view badges" ON user_badges
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM users WHERE practice_id IN (
                SELECT practice_id FROM users WHERE id = auth.uid()
            )
        )
    );

-- User streaks: Users can view
CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (user_id = auth.uid());

-- Functions for auto-updating updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply updated_at triggers
CREATE TRIGGER update_organizations_updated_at BEFORE UPDATE ON organizations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_practices_updated_at BEFORE UPDATE ON practices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_modules_updated_at BEFORE UPDATE ON training_modules
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_training_assignments_updated_at BEFORE UPDATE ON training_assignments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_vaccination_records_updated_at BEFORE UPDATE ON vaccination_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_incident_reports_updated_at BEFORE UPDATE ON incident_reports
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to create audit log entries
CREATE OR REPLACE FUNCTION create_audit_log(
    p_organization_id UUID,
    p_practice_id UUID,
    p_user_id UUID,
    p_action VARCHAR,
    p_entity_type VARCHAR,
    p_entity_id UUID,
    p_old_values JSONB DEFAULT NULL,
    p_new_values JSONB DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    v_id UUID;
BEGIN
    INSERT INTO audit_log (organization_id, practice_id, user_id, action, entity_type, entity_id, old_values, new_values)
    VALUES (p_organization_id, p_practice_id, p_user_id, p_action, p_entity_type, p_entity_id, p_old_values, p_new_values)
    RETURNING id INTO v_id;
    RETURN v_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to calculate training due date based on hire date
CREATE OR REPLACE FUNCTION calculate_training_due_date(
    p_hire_date DATE,
    p_frequency_months INTEGER,
    p_is_new_hire BOOLEAN DEFAULT FALSE
)
RETURNS DATE AS $$
BEGIN
    IF p_is_new_hire THEN
        -- New hires: training due within 10 days
        RETURN p_hire_date + INTERVAL '10 days';
    ELSE
        -- Recurring training: due based on frequency
        RETURN p_hire_date + (p_frequency_months || ' months')::INTERVAL;
    END IF;
END;
$$ LANGUAGE plpgsql;

-- Function to auto-assign training on new user creation
CREATE OR REPLACE FUNCTION auto_assign_training()
RETURNS TRIGGER AS $$
DECLARE
    v_module RECORD;
    v_is_new_hire BOOLEAN;
    v_practice_state VARCHAR(2);
BEGIN
    -- Check if this is a new hire (within last 10 days)
    v_is_new_hire := (NEW.hire_date IS NOT NULL AND NEW.hire_date >= CURRENT_DATE - INTERVAL '10 days');

    -- Get practice state
    SELECT state INTO v_practice_state FROM practices WHERE id = NEW.practice_id;

    -- Assign all required training modules
    FOR v_module IN
        SELECT * FROM training_modules
        WHERE is_active = TRUE
        AND (state_codes = '{}' OR v_practice_state = ANY(state_codes))
    LOOP
        INSERT INTO training_assignments (
            user_id,
            module_id,
            practice_id,
            due_date,
            status
        )
        VALUES (
            NEW.id,
            v_module.id,
            NEW.practice_id,
            calculate_training_due_date(
                COALESCE(NEW.hire_date, CURRENT_DATE),
                v_module.frequency_months,
                v_is_new_hire
            ),
            'pending'
        )
        ON CONFLICT (user_id, module_id, due_date) DO NOTHING;
    END LOOP;

    RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to auto-assign training when user is created or updated
CREATE TRIGGER auto_assign_training_on_user_insert
    AFTER INSERT ON users
    FOR EACH ROW
    WHEN (NEW.practice_id IS NOT NULL AND NEW.status = 'active')
    EXECUTE FUNCTION auto_assign_training();

-- Seed default training modules
INSERT INTO training_modules (title, description, type, duration_minutes, passing_score, frequency_months, content_json) VALUES
(
    'OSHA Bloodborne Pathogens',
    'Annual training on bloodborne pathogen exposure prevention and response in dental settings.',
    'osha',
    45,
    80,
    12,
    '{
        "sections": [
            {
                "id": "intro",
                "type": "text",
                "title": "Introduction to Bloodborne Pathogens",
                "content": "This training covers the OSHA Bloodborne Pathogens Standard (29 CFR 1910.1030) and how it applies to dental practices."
            },
            {
                "id": "pathogens",
                "type": "text",
                "title": "Common Bloodborne Pathogens",
                "content": "Learn about HIV, Hepatitis B (HBV), and Hepatitis C (HCV) - their transmission routes and prevention measures."
            },
            {
                "id": "ppe",
                "type": "text",
                "title": "Personal Protective Equipment",
                "content": "Proper selection, use, and disposal of gloves, masks, eye protection, and gowns."
            },
            {
                "id": "exposure",
                "type": "scenario",
                "title": "Exposure Incident Response",
                "prompt": "You accidentally stick yourself with a contaminated needle. What should you do FIRST?",
                "options": [
                    "Continue working and report it later",
                    "Immediately wash the area and report to your supervisor",
                    "Apply a bandage and continue working",
                    "Wait to see if symptoms develop"
                ],
                "correct": 1,
                "explanation": "Immediately wash the wound with soap and water, then report to your supervisor. Time is critical for potential post-exposure prophylaxis."
            }
        ],
        "quiz": {
            "questions": [
                {
                    "id": "q1",
                    "question": "Which of the following is NOT a bloodborne pathogen?",
                    "options": ["HIV", "Hepatitis B", "Tuberculosis", "Hepatitis C"],
                    "correct": 2
                },
                {
                    "id": "q2",
                    "question": "How long should you wash your hands after removing gloves?",
                    "options": ["5 seconds", "At least 20 seconds", "1 minute", "Hand washing is not necessary after removing gloves"],
                    "correct": 1
                },
                {
                    "id": "q3",
                    "question": "What is the primary purpose of the Exposure Control Plan?",
                    "options": ["To satisfy OSHA requirements", "To eliminate or minimize employee exposure to bloodborne pathogens", "To document all workplace injuries", "To track employee vaccinations"],
                    "correct": 1
                }
            ]
        }
    }'
),
(
    'HIPAA Privacy & Security',
    'Annual training on patient privacy rights and protected health information security.',
    'hipaa',
    30,
    80,
    12,
    '{
        "sections": [
            {
                "id": "intro",
                "type": "text",
                "title": "What is HIPAA?",
                "content": "The Health Insurance Portability and Accountability Act (HIPAA) sets national standards for protecting patient health information."
            },
            {
                "id": "phi",
                "type": "text",
                "title": "Protected Health Information (PHI)",
                "content": "PHI includes any information that can identify a patient and relates to their health condition, treatment, or payment."
            },
            {
                "id": "scenario",
                "type": "scenario",
                "title": "PHI Scenario",
                "prompt": "A patients spouse calls asking about their dental appointment results. What should you do?",
                "options": [
                    "Provide the information since they are family",
                    "Verify the patient has authorized disclosure to this person",
                    "Tell them to ask the patient directly",
                    "Provide general information only"
                ],
                "correct": 1,
                "explanation": "You must verify that the patient has authorized disclosure to this person before sharing any PHI, even with family members."
            }
        ],
        "quiz": {
            "questions": [
                {
                    "id": "q1",
                    "question": "Which of the following is considered PHI?",
                    "options": ["Patient name only", "Patient address only", "Patient treatment information only", "All of the above"],
                    "correct": 3
                },
                {
                    "id": "q2",
                    "question": "What is the minimum necessary standard?",
                    "options": ["Use the least amount of PHI necessary to accomplish the task", "Share all available information", "Only share information with doctors", "Never share any information"],
                    "correct": 0
                }
            ]
        }
    }'
),
(
    'Hazard Communication (GHS)',
    'Training on the Globally Harmonized System for chemical hazard communication.',
    'hazcom',
    30,
    80,
    12,
    '{
        "sections": [
            {
                "id": "intro",
                "type": "text",
                "title": "Hazard Communication Standard",
                "content": "The HazCom standard ensures employees are informed about chemical hazards in the workplace."
            },
            {
                "id": "labels",
                "type": "text",
                "title": "GHS Labels",
                "content": "Learn to read and understand GHS hazard labels, including pictograms, signal words, and hazard statements."
            },
            {
                "id": "sds",
                "type": "text",
                "title": "Safety Data Sheets",
                "content": "SDSs provide detailed information about chemicals, including hazards, handling, storage, and emergency procedures."
            }
        ],
        "quiz": {
            "questions": [
                {
                    "id": "q1",
                    "question": "What does SDS stand for?",
                    "options": ["Safety Data Sheet", "Standard Data Summary", "Safety Documentation System", "Standard Disclosure Sheet"],
                    "correct": 0
                },
                {
                    "id": "q2",
                    "question": "How many sections are in a GHS-compliant SDS?",
                    "options": ["8", "12", "16", "20"],
                    "correct": 2
                }
            ]
        }
    }'
),
(
    'Emergency Action Plan',
    'Training on emergency procedures including fire, medical emergencies, and evacuation.',
    'emergency',
    20,
    80,
    12,
    '{
        "sections": [
            {
                "id": "intro",
                "type": "text",
                "title": "Emergency Preparedness",
                "content": "Being prepared for emergencies can save lives. This training covers fire, medical, and evacuation procedures."
            },
            {
                "id": "fire",
                "type": "text",
                "title": "Fire Emergency",
                "content": "Know the location of fire extinguishers, fire alarms, and evacuation routes. Remember RACE: Rescue, Alarm, Contain, Evacuate."
            },
            {
                "id": "medical",
                "type": "text",
                "title": "Medical Emergencies",
                "content": "Know the location of AED, first aid kit, and emergency contact numbers. Call 911 for serious emergencies."
            }
        ],
        "quiz": {
            "questions": [
                {
                    "id": "q1",
                    "question": "What does RACE stand for in fire emergencies?",
                    "options": ["Run, Alert, Call, Exit", "Rescue, Alarm, Contain, Evacuate", "Report, Assess, Control, Eliminate", "React, Analyze, Communicate, Escape"],
                    "correct": 1
                }
            ]
        }
    }'
);

-- Seed default badges
INSERT INTO badges (name, description, icon_url, criteria_json) VALUES
('First Training', 'Completed your first training module', '/badges/first-training.svg', '{"type": "training_count", "value": 1}'),
('Perfect Score', 'Achieved 100% on a training quiz', '/badges/perfect-score.svg', '{"type": "perfect_quiz", "value": true}'),
('Streak Master', 'Completed 5 trainings on time in a row', '/badges/streak-master.svg', '{"type": "streak", "value": 5}'),
('Compliance Champion', 'All trainings current for 6 months', '/badges/compliance-champion.svg', '{"type": "all_current_months", "value": 6}'),
('Quick Learner', 'Completed a training in under 15 minutes', '/badges/quick-learner.svg', '{"type": "fast_completion", "minutes": 15}');

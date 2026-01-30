-- Fix infinite recursion in RLS policies
-- The issue: policies on "users" table reference "users" table, causing circular evaluation

-- Step 1: Create a SECURITY DEFINER function to safely get the current user's org_id
-- This bypasses RLS when called inside policies, breaking the recursion cycle
CREATE OR REPLACE FUNCTION public.get_user_org_id()
RETURNS UUID AS $$
  SELECT organization_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 2: Create a helper to check if current user is an admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.users
    WHERE id = auth.uid()
    AND (is_org_admin = TRUE OR role = 'admin')
  )
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 3: Create a helper to get user's practice_id
CREATE OR REPLACE FUNCTION public.get_user_practice_id()
RETURNS UUID AS $$
  SELECT practice_id FROM public.users WHERE id = auth.uid()
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- Step 4: Drop all existing policies and recreate them using the helper functions

-- == ORGANIZATIONS ==
DROP POLICY IF EXISTS "Users can view own organization" ON organizations;
DROP POLICY IF EXISTS "Org admins can update own organization" ON organizations;

CREATE POLICY "Users can view own organization" ON organizations
    FOR SELECT USING (id = public.get_user_org_id());

CREATE POLICY "Org admins can update own organization" ON organizations
    FOR UPDATE USING (id = public.get_user_org_id() AND public.is_admin());

-- Allow authenticated users to create organizations (needed for signup)
CREATE POLICY "Authenticated users can create organizations" ON organizations
    FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);

-- == PRACTICES ==
DROP POLICY IF EXISTS "Users can view practices in their organization" ON practices;
DROP POLICY IF EXISTS "Org admins can manage practices" ON practices;

CREATE POLICY "Users can view practices in their organization" ON practices
    FOR SELECT USING (organization_id = public.get_user_org_id());

CREATE POLICY "Admins can insert practices" ON practices
    FOR INSERT WITH CHECK (organization_id = public.get_user_org_id() AND public.is_admin());

CREATE POLICY "Admins can update practices" ON practices
    FOR UPDATE USING (organization_id = public.get_user_org_id() AND public.is_admin());

CREATE POLICY "Admins can delete practices" ON practices
    FOR DELETE USING (organization_id = public.get_user_org_id() AND public.is_admin());

-- == USERS ==
DROP POLICY IF EXISTS "Users can view users in their organization" ON users;
DROP POLICY IF EXISTS "Users can update own profile" ON users;
DROP POLICY IF EXISTS "Admins can manage users" ON users;

CREATE POLICY "Users can view users in their organization" ON users
    FOR SELECT USING (organization_id = public.get_user_org_id());

-- Allow users to view their own record (needed before org_id is set)
CREATE POLICY "Users can view own record" ON users
    FOR SELECT USING (id = auth.uid());

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (id = auth.uid());

-- Allow authenticated users to insert their own user record (needed for signup)
CREATE POLICY "Authenticated users can create own user record" ON users
    FOR INSERT WITH CHECK (id = auth.uid());

CREATE POLICY "Admins can manage users" ON users
    FOR ALL USING (organization_id = public.get_user_org_id() AND public.is_admin());

-- == TRAINING ASSIGNMENTS ==
DROP POLICY IF EXISTS "Users can view own assignments" ON training_assignments;
DROP POLICY IF EXISTS "Admins can view practice assignments" ON training_assignments;
DROP POLICY IF EXISTS "Users can update own assignments" ON training_assignments;
DROP POLICY IF EXISTS "Admins can manage assignments" ON training_assignments;

CREATE POLICY "Users can view own assignments" ON training_assignments
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view practice assignments" ON training_assignments
    FOR SELECT USING (practice_id = public.get_user_practice_id() AND public.is_admin());

CREATE POLICY "Users can update own assignments" ON training_assignments
    FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can manage assignments" ON training_assignments
    FOR ALL USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- == VACCINATION RECORDS ==
DROP POLICY IF EXISTS "Users can view own vaccination records" ON vaccination_records;
DROP POLICY IF EXISTS "Admins can view practice vaccination records" ON vaccination_records;
DROP POLICY IF EXISTS "Admins can manage vaccination records" ON vaccination_records;

CREATE POLICY "Users can view own vaccination records" ON vaccination_records
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Admins can view practice vaccination records" ON vaccination_records
    FOR SELECT USING (practice_id = public.get_user_practice_id() AND public.is_admin());

CREATE POLICY "Admins can manage vaccination records" ON vaccination_records
    FOR ALL USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- == INCIDENT REPORTS ==
DROP POLICY IF EXISTS "Admins can manage incident reports" ON incident_reports;
DROP POLICY IF EXISTS "Users can report incidents" ON incident_reports;

CREATE POLICY "Admins can manage incident reports" ON incident_reports
    FOR ALL USING (practice_id = public.get_user_practice_id() AND public.is_admin());

CREATE POLICY "Users can report incidents" ON incident_reports
    FOR INSERT WITH CHECK (practice_id = public.get_user_practice_id());

-- == DOCUMENTS ==
DROP POLICY IF EXISTS "Practice members can view documents" ON documents;
DROP POLICY IF EXISTS "Admins can manage documents" ON documents;

CREATE POLICY "Practice members can view documents" ON documents
    FOR SELECT USING (practice_id = public.get_user_practice_id());

CREATE POLICY "Admins can manage documents" ON documents
    FOR ALL USING (practice_id = public.get_user_practice_id() AND public.is_admin());

-- == DOCUMENT SIGNATURES ==
DROP POLICY IF EXISTS "Users can view own signatures" ON document_signatures;
DROP POLICY IF EXISTS "Users can create signatures" ON document_signatures;

CREATE POLICY "Users can view own signatures" ON document_signatures
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can create signatures" ON document_signatures
    FOR INSERT WITH CHECK (user_id = auth.uid());

-- == AUDIT LOG ==
DROP POLICY IF EXISTS "Admins can view audit log" ON audit_log;

CREATE POLICY "Admins can view audit log" ON audit_log
    FOR SELECT USING (organization_id = public.get_user_org_id() AND public.is_admin());

-- == EMAIL REMINDERS ==
DROP POLICY IF EXISTS "Users can view own reminders" ON email_reminders;

CREATE POLICY "Users can view own reminders" ON email_reminders
    FOR SELECT USING (user_id = auth.uid());

-- == USER BADGES ==
DROP POLICY IF EXISTS "Users can view own badges" ON user_badges;
DROP POLICY IF EXISTS "Practice members can view badges" ON user_badges;

CREATE POLICY "Users can view own badges" ON user_badges
    FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Org members can view badges" ON user_badges
    FOR SELECT USING (
        user_id IN (
            SELECT id FROM public.users WHERE organization_id = public.get_user_org_id()
        )
    );

-- == USER STREAKS ==
DROP POLICY IF EXISTS "Users can view own streaks" ON user_streaks;

CREATE POLICY "Users can view own streaks" ON user_streaks
    FOR SELECT USING (user_id = auth.uid());

-- Trigger to auto-assign training when a user's practice_id is updated
-- This handles the case where the admin user is created during signup with
-- practice_id = NULL, then gets assigned to a practice during onboarding.
CREATE TRIGGER auto_assign_training_on_user_update
    AFTER UPDATE ON users
    FOR EACH ROW
    WHEN (NEW.practice_id IS NOT NULL AND NEW.status = 'active'
          AND (OLD.practice_id IS NULL OR OLD.practice_id != NEW.practice_id))
    EXECUTE FUNCTION auto_assign_training();

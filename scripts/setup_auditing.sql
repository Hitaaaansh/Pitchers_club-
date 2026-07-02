-- =====================================================================
-- DATABASE AUDITING SETUP FOR PITCH HUB MUJ
-- =====================================================================
-- Instructions:
-- 1. Copy this entire script.
-- 2. Go to your Supabase Dashboard -> SQL Editor.
-- 3. Paste and run this script.
--
-- This script will:
-- * Create an 'audit' schema and an 'audit.logs' table.
-- * Create a secure trigger function to capture Supabase user IDs.
-- * Attach triggers to 'events', 'team', 'sponsors', 'join_submissions', and 'contacts' tables.
-- =====================================================================

-- 1. Create the audit schema
CREATE SCHEMA IF NOT EXISTS audit;

-- 2. Create the audit logs table
CREATE TABLE IF NOT EXISTS audit.logs (
    id bigint GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
    table_name text NOT NULL,
    action text NOT NULL, -- 'INSERT', 'UPDATE', or 'DELETE'
    performed_by uuid, -- Stores auth.uid() from Supabase session
    record_id text, -- ID of the record that was changed
    old_data jsonb, -- State of row before update/delete (JSON)
    new_data jsonb, -- State of row after insert/update (JSON)
    changed_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable Row Level Security (RLS) on audit logs
ALTER TABLE audit.logs ENABLE ROW LEVEL SECURITY;

-- Allow only authenticated database users (admins/leads) to view logs
DROP POLICY IF EXISTS "Allow read to authenticated users" ON audit.logs;
CREATE POLICY "Allow read to authenticated users" 
ON audit.logs 
FOR SELECT 
TO authenticated 
USING (true);

-- 3. Create the trigger function
CREATE OR REPLACE FUNCTION audit.if_modified_func() 
RETURNS TRIGGER AS $$
DECLARE
    user_id uuid;
    record_id_val text;
BEGIN
    -- Safely capture the authenticated user ID from Supabase auth headers
    BEGIN
        user_id := auth.uid();
    EXCEPTION WHEN OTHERS THEN
        user_id := NULL;
    END;

    -- Extract the Primary Key 'id' field for references
    IF (TG_OP = 'DELETE') THEN
        BEGIN
            record_id_val := OLD.id::text;
        EXCEPTION WHEN OTHERS THEN
            record_id_val := NULL;
        END;
    ELSE
        BEGIN
            record_id_val := NEW.id::text;
        EXCEPTION WHEN OTHERS THEN
            record_id_val := NULL;
        END;
    END IF;

    -- Log the action
    IF (TG_OP = 'UPDATE') THEN
        INSERT INTO audit.logs (table_name, action, performed_by, record_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, user_id, record_id_val, to_jsonb(OLD), to_jsonb(NEW));
        RETURN NEW;
    ELSIF (TG_OP = 'DELETE') THEN
        INSERT INTO audit.logs (table_name, action, performed_by, record_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, user_id, record_id_val, to_jsonb(OLD), NULL);
        RETURN OLD;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO audit.logs (table_name, action, performed_by, record_id, old_data, new_data)
        VALUES (TG_TABLE_NAME, TG_OP, user_id, record_id_val, NULL, to_jsonb(NEW));
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Create trigger bindings for your key public tables
-- (Adjust table names if you modify them in your schema)

-- Trigger for 'events'
DROP TRIGGER IF EXISTS audit_events ON public.events;
CREATE TRIGGER audit_events
AFTER INSERT OR UPDATE OR DELETE ON public.events
FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func();

-- Trigger for 'team'
DROP TRIGGER IF EXISTS audit_team ON public.team;
CREATE TRIGGER audit_team
AFTER INSERT OR UPDATE OR DELETE ON public.team
FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func();

-- Trigger for 'sponsors'
DROP TRIGGER IF EXISTS audit_sponsors ON public.sponsors;
CREATE TRIGGER audit_sponsors
AFTER INSERT OR UPDATE OR DELETE ON public.sponsors
FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func();

-- Trigger for 'joiners' or recruitment submission tables
DROP TRIGGER IF EXISTS audit_joiners ON public.joiners;
CREATE TRIGGER audit_joiners
AFTER INSERT OR UPDATE OR DELETE ON public.joiners
FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func();

-- Trigger for 'contacts'
DROP TRIGGER IF EXISTS audit_contacts ON public.contacts;
CREATE TRIGGER audit_contacts
AFTER INSERT OR UPDATE OR DELETE ON public.contacts
FOR EACH ROW EXECUTE FUNCTION audit.if_modified_func();

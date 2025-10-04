-- Create a table for user language preferences
CREATE TABLE public.user_language_preferences (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    primary_language TEXT NOT NULL,       -- User's primary/native language
    learning_language TEXT NOT NULL,      -- Language the user is learning
    proficiency_level TEXT DEFAULT 'beginner',  -- beginner, intermediate, advanced
    is_active BOOLEAN DEFAULT true,       -- Whether this is the currently active language pair
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(user_id, primary_language, learning_language)
);

-- Add RLS (Row Level Security)
ALTER TABLE public.user_language_preferences ENABLE ROW LEVEL SECURITY;

-- Create policies for user_language_preferences
CREATE POLICY "Users can view their own language preferences"
    ON public.user_language_preferences
    FOR SELECT
    USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own language preferences"
    ON public.user_language_preferences
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own language preferences"
    ON public.user_language_preferences
    FOR UPDATE
    USING (user_id = auth.uid());

CREATE POLICY "Admins can view all language preferences"
    ON public.user_language_preferences
    FOR ALL
    USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Function to set user's language preferences
CREATE OR REPLACE FUNCTION set_user_language_preferences(
    p_user_id UUID,
    p_primary_language TEXT,
    p_learning_language TEXT,
    p_proficiency_level TEXT DEFAULT 'beginner'
)
RETURNS user_language_preferences
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    result user_language_preferences;
BEGIN
    -- First, set all existing preferences to inactive
    UPDATE user_language_preferences
    SET is_active = false
    WHERE user_id = p_user_id;

    -- Insert or update the new preference
    INSERT INTO user_language_preferences (
        user_id,
        primary_language,
        learning_language,
        proficiency_level,
        is_active
    )
    VALUES (
        p_user_id,
        p_primary_language,
        p_learning_language,
        p_proficiency_level,
        true
    )
    ON CONFLICT (user_id, primary_language, learning_language)
    DO UPDATE SET
        proficiency_level = EXCLUDED.proficiency_level,
        is_active = true,
        updated_at = NOW()
    RETURNING * INTO result;

    RETURN result;
END;
$$;

-- Function to get user's active language preferences
CREATE OR REPLACE FUNCTION get_user_active_language_preferences(p_user_id UUID)
RETURNS user_language_preferences
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT *
    FROM user_language_preferences
    WHERE user_id = p_user_id
    AND is_active = true
    LIMIT 1;
$$;

-- Function to get all user's language preferences
CREATE OR REPLACE FUNCTION get_user_all_language_preferences(p_user_id UUID)
RETURNS SETOF user_language_preferences
LANGUAGE sql
SECURITY DEFINER
AS $$
    SELECT *
    FROM user_language_preferences
    WHERE user_id = p_user_id
    ORDER BY is_active DESC, updated_at DESC;
$$;

-- Trigger to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_user_language_preferences_updated_at
    BEFORE UPDATE ON user_language_preferences
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Add indexes for better query performance
CREATE INDEX idx_user_language_preferences_user_id ON user_language_preferences(user_id);
CREATE INDEX idx_user_language_preferences_active ON user_language_preferences(user_id, is_active) WHERE is_active = true;
-- Create user_progress table
CREATE TABLE user_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    target_language TEXT NOT NULL,
    total_points INTEGER DEFAULT 0,
    vocabulary_stages_completed INTEGER[] DEFAULT '{}',
    quiz_stages_completed INTEGER[] DEFAULT '{}',
    streak_days INTEGER DEFAULT 0,
    last_activity_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    achievements TEXT[] DEFAULT '{}',
    UNIQUE (user_id, target_language)
);

-- Create a function to update user progress
CREATE OR REPLACE FUNCTION update_user_progress(
    p_user_id UUID,
    p_target_language TEXT,
    p_points_earned INTEGER DEFAULT 0,
    p_vocabulary_stage INTEGER DEFAULT NULL,
    p_quiz_stage INTEGER DEFAULT NULL
)
RETURNS user_progress
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    result user_progress;
BEGIN
    -- Insert or update the user progress record
    INSERT INTO user_progress (
        user_id,
        target_language,
        total_points,
        vocabulary_stages_completed,
        quiz_stages_completed
    )
    VALUES (
        p_user_id,
        p_target_language,
        p_points_earned,
        CASE WHEN p_vocabulary_stage IS NOT NULL THEN ARRAY[p_vocabulary_stage] ELSE '{}' END,
        CASE WHEN p_quiz_stage IS NOT NULL THEN ARRAY[p_quiz_stage] ELSE '{}' END
    )
    ON CONFLICT (user_id, target_language)
    DO UPDATE SET
        total_points = user_progress.total_points + p_points_earned,
        vocabulary_stages_completed = 
            CASE 
                WHEN p_vocabulary_stage IS NOT NULL AND NOT (p_vocabulary_stage = ANY(user_progress.vocabulary_stages_completed))
                THEN array_append(user_progress.vocabulary_stages_completed, p_vocabulary_stage)
                ELSE user_progress.vocabulary_stages_completed
            END,
        quiz_stages_completed = 
            CASE 
                WHEN p_quiz_stage IS NOT NULL AND NOT (p_quiz_stage = ANY(user_progress.quiz_stages_completed))
                THEN array_append(user_progress.quiz_stages_completed, p_quiz_stage)
                ELSE user_progress.quiz_stages_completed
            END,
        last_activity_date = CURRENT_TIMESTAMP,
        streak_days = CASE 
            WHEN user_progress.last_activity_date > CURRENT_TIMESTAMP - INTERVAL '1 day'
            THEN user_progress.streak_days
            WHEN user_progress.last_activity_date > CURRENT_TIMESTAMP - INTERVAL '2 days'
            THEN user_progress.streak_days + 1
            ELSE 1
        END
    RETURNING * INTO result;

    RETURN result;
END;
$$;

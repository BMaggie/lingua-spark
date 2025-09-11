-- Create user_language_preferences table to store multiple languages
CREATE TABLE public.user_language_preferences (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  spoken_languages text[] NOT NULL DEFAULT '{}',
  learning_languages text[] NOT NULL DEFAULT '{}',
  primary_spoken_language text,
  primary_learning_language text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  UNIQUE(user_id)
);

-- Enable RLS on the new table
ALTER TABLE public.user_language_preferences ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own language preferences" ON public.user_language_preferences
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own language preferences" ON public.user_language_preferences
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own language preferences" ON public.user_language_preferences
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all language preferences" ON public.user_language_preferences
FOR SELECT USING (public.get_current_user_role() = 'admin');

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_user_language_preferences_updated_at
    BEFORE UPDATE ON public.user_language_preferences
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();
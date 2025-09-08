-- Fix the function search path issue by updating the function
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Enable RLS on user_progress table and add policies
ALTER TABLE public.user_progress ENABLE ROW LEVEL SECURITY;

-- Add RLS policies for user_progress table
CREATE POLICY "Users can view their own progress" ON public.user_progress
FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "Users can insert their own progress" ON public.user_progress
FOR INSERT WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update their own progress" ON public.user_progress
FOR UPDATE USING (user_id = auth.uid());

CREATE POLICY "Admins can view all progress" ON public.user_progress
FOR SELECT USING (public.get_current_user_role() = 'admin');
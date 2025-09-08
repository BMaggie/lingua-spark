-- Create security definer function to get current user's role safely
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE SET search_path = public;

-- Drop existing insecure policies that reference user metadata
DROP POLICY IF EXISTS "Admins can update all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Admins can view all stats" ON public.user_stats;

-- Create secure policies using the security definer function
CREATE POLICY "Admins can update all profiles" ON public.profiles
FOR UPDATE USING (
  (auth.uid() = id) OR (public.get_current_user_role() = 'admin')
);

CREATE POLICY "Admins can view all profiles" ON public.profiles
FOR SELECT USING (
  (auth.uid() = id) OR (public.get_current_user_role() = 'admin')
);

CREATE POLICY "Admins can view all stats" ON public.user_stats
FOR SELECT USING (
  (user_id = auth.uid()) OR (public.get_current_user_role() = 'admin')
);
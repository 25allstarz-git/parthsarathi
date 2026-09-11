-- Drop the overly broad read policy
DROP POLICY IF EXISTS "lawyers_readable_by_signed_in" ON public.lawyer_profiles;

-- Allow an advocate to view their own profile, regardless of availability
CREATE POLICY "lawyers_readable_by_owner" 
ON public.lawyer_profiles 
FOR SELECT 
TO authenticated 
USING (user_id = auth.uid());

-- Allow administrators to view all profiles
CREATE POLICY "lawyers_readable_by_admin" 
ON public.lawyer_profiles 
FOR SELECT 
TO authenticated 
USING (public.has_role(auth.uid(), 'admin'));

-- Allow public/citizens to view ONLY available AND verified advocates
CREATE POLICY "lawyers_readable_by_public" 
ON public.lawyer_profiles 
FOR SELECT 
TO authenticated 
USING (
  is_available = true 
  AND EXISTS (
    SELECT 1 
    FROM public.user_roles ur 
    WHERE ur.user_id = lawyer_profiles.user_id 
      AND ur.role = 'lawyer' 
      AND ur.verification = 'verified'
  )
);

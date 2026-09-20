-- Fix duplicates first
DELETE FROM public.profiles 
WHERE phone IN (
  SELECT phone 
  FROM public.profiles 
  GROUP BY phone 
  HAVING COUNT(*) > 1
) 
AND id NOT IN (
  SELECT min(id::text)::uuid 
  FROM public.profiles 
  GROUP BY phone
);

-- Enforce one account per mobile number
ALTER TABLE public.profiles ADD CONSTRAINT profiles_phone_key UNIQUE (phone);

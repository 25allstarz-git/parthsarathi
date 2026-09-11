-- Enforce one account per mobile number
ALTER TABLE public.profiles ADD CONSTRAINT profiles_phone_key UNIQUE (phone);

CREATE POLICY "lawyer_credentials_insert_own" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'lawyer-credentials' AND (storage.foldername(name))[1] = auth.uid()::text);
CREATE POLICY "lawyer_credentials_select_own" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'lawyer-credentials' AND ((storage.foldername(name))[1] = auth.uid()::text OR public.has_role(auth.uid(), 'admin')));
CREATE POLICY "lawyer_credentials_update_own" ON storage.objects
  FOR UPDATE TO authenticated
  USING (bucket_id = 'lawyer-credentials' AND (storage.foldername(name))[1] = auth.uid()::text)
  WITH CHECK (bucket_id = 'lawyer-credentials' AND (storage.foldername(name))[1] = auth.uid()::text);
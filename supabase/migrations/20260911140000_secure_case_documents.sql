-- Drop the old overly broad policy
DROP POLICY IF EXISTS "docs_select" ON public.case_documents;

-- Create the new restrictive policy for case_documents
CREATE POLICY "docs_select" ON public.case_documents 
FOR SELECT 
TO authenticated 
USING (
  EXISTS (
    SELECT 1 
    FROM public.cases c 
    WHERE c.id = case_documents.case_id 
    AND (
      c.citizen_id = auth.uid() 
      OR c.assigned_lawyer_id = auth.uid() 
      OR public.has_role(auth.uid(), 'admin') 
      OR public.has_verified_role(auth.uid(), 'judge') 
      OR public.has_verified_role(auth.uid(), 'law_enforcement')
    )
  )
);

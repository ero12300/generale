-- Storage buckets + seed (applied to remote via MCP)
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES
  ('equipment-documents', 'equipment-documents', false, 10485760, ARRAY['application/pdf','image/jpeg','image/png','image/webp']),
  ('ticket-attachments', 'ticket-attachments', false, 10485760, ARRAY['application/pdf','image/jpeg','image/png','image/webp','video/mp4']),
  ('quotes-pdf', 'quotes-pdf', false, 5242880, ARRAY['application/pdf']),
  ('reports-pdf', 'reports-pdf', false, 5242880, ARRAY['application/pdf'])
ON CONFLICT (id) DO NOTHING;

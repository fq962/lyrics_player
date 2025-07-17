import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://zxdzhdajrhoxwqkwhsqv.supabase.co";
const supabaseKey =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inp4ZHpoZGFqcmhveHdxa3doc3F2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTIzOTA0ODYsImV4cCI6MjA2Nzk2NjQ4Nn0.limFVK24l9CGDtu-cQGAiWVmq4gM5uikXhQVlvRzEjA";

export const supabase = createClient(supabaseUrl, supabaseKey);

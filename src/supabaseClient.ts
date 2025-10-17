import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://nkcuvbvsgkwvhtpzzmfp.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5rY3V2YnZzZ2t3dmh0cHp6bWZwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjA2OTM5NjQsImV4cCI6MjA3NjI2OTk2NH0.iOa5FfL0OBZp84XMI-qBcyzzE5ufSGJ_qjrT2kQ4efA';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

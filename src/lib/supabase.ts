
import { createClient } from '@supabase/supabase-js';

// For development/demo purposes only
// In production, you should use environment variables
const supabaseUrl = 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = 'your-supabase-anon-key';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

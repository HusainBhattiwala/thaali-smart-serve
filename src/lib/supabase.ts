
import { createClient } from '@supabase/supabase-js';

// Default fallback values (only for development)
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-supabase-project-url.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-supabase-anon-key';

// Check if URL is valid
if (!supabaseUrl || supabaseUrl === 'https://your-supabase-project-url.supabase.co') {
  console.warn('Warning: Using placeholder Supabase URL. Please set VITE_SUPABASE_URL environment variable.');
}

// Check if key is valid
if (!supabaseAnonKey || supabaseAnonKey === 'your-supabase-anon-key') {
  console.warn('Warning: Using placeholder Supabase Anon Key. Please set VITE_SUPABASE_ANON_KEY environment variable.');
}

// Create the Supabase client with error handling
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Helper function to check connection
export const checkSupabaseConnection = async () => {
  try {
    const { error } = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    return !error;
  } catch (err) {
    console.error('Supabase connection error:', err);
    return false;
  }
};

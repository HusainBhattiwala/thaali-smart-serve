
import { createClient } from '@supabase/supabase-js';

// Replace these with your actual Supabase project URL and anon key
// These can be found in your Supabase project settings
const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL || '';
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

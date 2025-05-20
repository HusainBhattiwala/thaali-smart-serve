
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://bjycxyasxeupwxckplsq.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJqeWN4eWFzeGV1cHd4Y2twbHNxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5NTIwMjAsImV4cCI6MjA2MDUyODAyMH0.jx5kbcLFUolFe0w4_IssjfZ32i-fHHksEjaMiTVrQSo";

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

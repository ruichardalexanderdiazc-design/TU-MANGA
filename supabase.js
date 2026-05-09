const SUPABASE_URL = window.APP_CONFIG?.SUPABASE_URL || '';
const SUPABASE_ANON_KEY = window.APP_CONFIG?.SUPABASE_ANON_KEY || '';
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://wkpbdzjhjzmbnbijoyxf.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_FwSsrK2xE2HOLy1INL25Hg_e2GrImog';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

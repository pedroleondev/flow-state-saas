import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://ukivmyxbpznyxeaxdlqq.supabase.co';
const supabaseKey = 'sb_publishable_uGA-7Ofbvb_GdAfCPT8agw__iMGW6RV';

export const supabase = createClient(supabaseUrl, supabaseKey);
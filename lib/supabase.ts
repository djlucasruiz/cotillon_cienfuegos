import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || ''
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ''
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase env vars missing')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey || 'placeholder')
export const supabaseAdmin = typeof window === 'undefined' 
  ? createClient(supabaseUrl, supabaseServiceKey || 'placeholder')
  : createClient(supabaseUrl, supabaseAnonKey || 'placeholder')

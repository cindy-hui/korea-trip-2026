import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

// Validate that environment variables are set
if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables are missing!')
  console.error('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel.')
  // Export a mock supabase that returns errors instead of crashing
  export const supabase = {
    from: () => ({
      select: () => ({ then: () => ({ data: null, error: new Error('Supabase not configured') }) }),
      upsert: () => ({ then: () => ({ error: new Error('Supabase not configured') }) }),
    }),
  }
} else {
  // Create Supabase client
  export const supabase = createClient(supabaseUrl, supabaseAnonKey)
}


import { createClient } from '@supabase/supabase-js'

// Supabase configuration from environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

console.log('🔍 Supabase config:', {
  url: supabaseUrl,
  hasKey: !!supabaseAnonKey,
  keyPreview: supabaseAnonKey ? supabaseAnonKey.slice(0, 20) + '...' : null
})

// Validate that environment variables are set
let supabase
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Supabase environment variables are missing!')
  console.warn('Make sure VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY are set in Vercel.')
  // Create a mock supabase that returns errors instead of crashing
  supabase = {
    from: () => ({
      select: () => ({ then: () => ({ data: null, error: new Error('Supabase not configured') }) }),
      upsert: () => ({ then: () => ({ error: new Error('Supabase not configured') }) }),
    }),
  }
} else {
  try {
    // Create Supabase client
    supabase = createClient(supabaseUrl, supabaseAnonKey)
    console.log('✅ Supabase client created successfully')
  } catch (error) {
    console.error('❌ Failed to create Supabase client:', error)
    supabase = null
  }
}

export { supabase }


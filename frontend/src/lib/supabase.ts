import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const getAuthToken = async (): Promise<string | null> => {
  // Timeout para evitar que fique pendurado
  const timeoutPromise = new Promise<null>((resolve) => {
    setTimeout(() => resolve(null), 5000)
  })
  
  const sessionPromise = supabase.auth.getSession().then(
    ({ data: { session } }) => session?.access_token ?? null
  )
  
  return Promise.race([sessionPromise, timeoutPromise])
}

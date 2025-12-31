import { create } from 'zustand'
import { supabase } from '../lib/supabase'
import { profileApi, type Profile } from '../lib/api'
import type { User, Session } from '@supabase/supabase-js'

interface AuthState {
  user: User | null
  session: Session | null
  profile: Profile | null
  loading: boolean
  error: string | null
  
  // Actions
  initialize: () => Promise<void>
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
  setProfile: (profile: Profile) => void
}

export const useAuthStore = create<AuthState>((set, _get) => ({
  user: null,
  session: null,
  profile: null,
  loading: true,
  error: null,

  initialize: async () => {
    try {
      set({ loading: true, error: null })
      
      const { data: { session } } = await supabase.auth.getSession()
      
      if (session) {
        set({ user: session.user, session })
        
        try {
          const profile = await profileApi.getMe()
          set({ profile })
        } catch (e) {
          console.error('Error fetching profile:', e)
        }
      }
      
      // Listen for auth changes
      supabase.auth.onAuthStateChange(async (_event, session) => {
        set({ user: session?.user ?? null, session })
        
        if (session) {
          try {
            const profile = await profileApi.getMe()
            set({ profile })
          } catch (e) {
            console.error('Error fetching profile:', e)
          }
        } else {
          set({ profile: null })
        }
      })
    } catch (error) {
      set({ error: 'Erro ao inicializar autenticação' })
    } finally {
      set({ loading: false })
    }
  },

  signIn: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) throw error
      
      set({ user: data.user, session: data.session })
      
      const profile = await profileApi.getMe()
      set({ profile })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao fazer login'
      set({ error: message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signUp: async (email: string, password: string) => {
    try {
      set({ loading: true, error: null })
      
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) throw error
      
      set({ user: data.user, session: data.session })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao criar conta'
      set({ error: message })
      throw error
    } finally {
      set({ loading: false })
    }
  },

  signOut: async () => {
    try {
      set({ loading: true })
      await supabase.auth.signOut()
      set({ user: null, session: null, profile: null })
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : 'Erro ao sair'
      set({ error: message })
    } finally {
      set({ loading: false })
    }
  },

  refreshProfile: async () => {
    try {
      const profile = await profileApi.getMe()
      set({ profile })
    } catch (error) {
      console.error('Error refreshing profile:', error)
    }
  },

  setProfile: (profile: Profile) => {
    set({ profile })
  },
}))

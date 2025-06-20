import { createClient } from '@supabase/supabase-js';
import Constants from 'expo-constants';
import { storage } from '../storage';

const { supabaseUrl, supabaseAnonKey } = Constants.expoConfig?.extra ?? {};

const supabaseStorage = {
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  getItem: (key: string) => {
    const value = storage.getString(key);
    return value === undefined ? null : value;
  },
  removeItem: (key: string) => {
    storage.delete(key);
  },
};

export const supabase = createClient(supabaseUrl!, supabaseAnonKey!, {
  auth: {
    storage: supabaseStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
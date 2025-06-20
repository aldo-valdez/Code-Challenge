import { supabase } from "@/lib/supabase";
import { Session } from "@supabase/supabase-js";
import { create } from "zustand";

type AuthState = {
  session: Session | null;
  loading: boolean;
  init: () => void;
};

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  loading: true,
  init: () => {
    supabase.auth.onAuthStateChange((_event, session) => {
      set({ session });
    });

    const fetchSession = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      set({ session, loading: false });
    };

    fetchSession();
  },
})); 
import { supabase } from "@/lib/supabase";
import { useState } from "react";

export interface Profile {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
}

export const useProfile = () => {
  const [isLoading, setIsLoading] = useState(false);

  const createProfile = async (userId: string, name: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .insert({
          id: userId,
          name,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating profile:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.log({ error });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const getProfile = async (userId: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        console.error("Error fetching profile:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.log({ error });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const updateProfile = async (userId: string, updates: Partial<Profile>) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", userId)
        .select()
        .single();

      if (error) {
        console.error("Error updating profile:", error);
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.log({ error });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    createProfile,
    getProfile,
    updateProfile,
  };
};

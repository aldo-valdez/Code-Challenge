import { supabase } from "@/lib/supabase";
import { useState } from "react";
import Toast from "react-native-toast-message";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(false);

  const signIn = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: error.message,
        });
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.log({ error });
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signUp = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        Toast.show({
          type: "error",
          text1: error.message,
        });
        return { success: false, error };
      }

      return { success: true, data };
    } catch (error) {
      console.log({ error });
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) {
        Toast.show({
          type: "error",
          text1: error.message,
        });
        return { success: false, error };
      }
      return { success: true };
    } catch (error) {
      console.log({ error });
      return { success: false, error };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.resetPasswordForEmail(email);
      if (error) {
        Toast.show({
          type: "error",
          text1: error.message,
        });
        return { success: false, error };
      }
      Toast.show({
        type: "success",
        text1: "Password reset email sent!",
      });
      return { success: true };
    } catch (error) {
      console.log({ error });
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred",
      });
      return { success: false, error };
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    signIn,
    signUp,
    signOut,
    resetPassword,
  };
};

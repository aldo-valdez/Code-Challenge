import { Slot, useRouter, useSegments } from "expo-router";
import { useEffect } from "react";
import { Platform } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import { useAuthStore } from "./auth/_store/authStore";

export default function RootLayout() {
  const { session, loading, init } = useAuthStore();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    init();
  }, [init]);

  useEffect(() => {
    if (loading) return;
    const inAuthGroup = segments[0] === "auth";
    if (session && inAuthGroup) {
      router.replace("/journal/list");
    } else if (!session && !inAuthGroup) {
      router.replace("/auth/signin");
    }
  }, [session, loading, segments, router]);

  return (
    <SafeAreaProvider>
      <Slot />
      <Toast
        topOffset={Platform.OS === "ios" ? 70 : 10}
        visibilityTime={3000}
      />
    </SafeAreaProvider>
  );
}

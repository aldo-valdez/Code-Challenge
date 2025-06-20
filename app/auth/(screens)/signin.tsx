import { FormInput, PasswordInput } from "@/app/auth/_components";
import {
  useAuth,
  usePasswordVisibility,
  useSignInForm,
} from "@/app/auth/_hooks";
import PrimaryButton from "@/components/PrimaryButton";
import { storage } from "@/storage";
import { Ionicons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function SignIn() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useSignInForm();
  const { showPassword, togglePasswordVisibility } = usePasswordVisibility();
  const { isLoading, signIn } = useAuth();

  const onSubmit = async (data: any) => {
    const result = await signIn(data.email, data.password);
    if (result.success) {
      storage.set("user", JSON.stringify(result?.data?.session));
      router.replace("/journal/list");
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerClassName="pt-safe"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-8 pb-8">
        <View className="items-center mb-16">
          <View className="w-16 h-16 bg-purple-600 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="journal" size={32} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back
          </Text>
          <Text className="text-gray-500 text-center">
            Sign in to your account
          </Text>
        </View>

        <View className="space-y-6">
          <FormInput
            control={control}
            name="email"
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email}
          />

          <PasswordInput
            control={control}
            name="password"
            label="Password"
            placeholder="Enter your password"
            error={errors.password}
            showPassword={showPassword}
            onTogglePassword={togglePasswordVisibility}
          />

          {/* <Link href="./forgot-password" asChild replace>
            <TouchableOpacity className="items-end mt-3">
              <Text className="text-purple-600 font-medium">
                Forgot password?
              </Text>
            </TouchableOpacity>
          </Link> */}

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-6"
            title={isLoading ? "Signing in…" : "Sign In"}
          />

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Don&apos;t have an account? </Text>
            <Link href="/auth/signup" asChild replace>
              <TouchableOpacity>
                <Text className="text-purple-600 font-semibold">Sign up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

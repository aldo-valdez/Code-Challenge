import { FormInput } from "@/app/auth/_components";
import { useAuth, useForgotPasswordForm } from "@/app/auth/_hooks";
import PrimaryButton from "@/components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

export default function ForgotPassword() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForgotPasswordForm();
  const { isLoading, resetPassword } = useAuth();

  const onSubmit = async (data: { email: string }) => {
    await resetPassword(data.email);
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
            Forgot Password
          </Text>
          <Text className="text-gray-500 text-center">
            Enter your email to receive a password reset link
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

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            disabled={isLoading}
            className="mt-6"
            title={isLoading ? "Sending..." : "Send Reset Link"}
          />

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Remembered your password? </Text>
            <Link href="./signin" asChild replace>
              <Text className="text-purple-600 font-semibold">Sign in</Text>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

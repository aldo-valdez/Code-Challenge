import { FormInput, PasswordInput } from "@/app/auth/_components";
import {
  useAuth,
  useMultiplePasswordVisibility,
  useProfile,
  useSignUpForm,
} from "@/app/auth/_hooks";
import PrimaryButton from "@/components/PrimaryButton";
import { Ionicons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Toast from "react-native-toast-message";

export default function SignUp() {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useSignUpForm();
  const { passwordVisibility, togglePasswordVisibility } =
    useMultiplePasswordVisibility(2);
  const { isLoading: authLoading, signUp } = useAuth();
  const { createProfile } = useProfile();

  const onSubmit = async (data: any) => {
    const signUpResult = await signUp(data.email, data.password);

    if (signUpResult.success && signUpResult.data?.user) {
      const user = signUpResult.data.user;
      const profileResult = await createProfile(user.id, data.fullName);
      if (!signUpResult.data?.session) {
        Toast.show({
          type: "success",
          text1: "Check your email to confirm sign-up!",
        });
        return;
      }
      if (profileResult.success) {
        console.log("Sign up and profile creation successful");
      }
    }
  };

  return (
    <KeyboardAwareScrollView
      className="flex-1 bg-white"
      contentContainerClassName="pt-safe"
      showsVerticalScrollIndicator={false}
    >
      <View className="flex-1 px-8 pb-8">
        <View className="items-center mb-12">
          <View className="w-16 h-16 bg-purple-600 rounded-2xl items-center justify-center mb-6">
            <Ionicons name="journal" size={32} color="white" />
          </View>
          <Text className="text-2xl font-bold text-gray-900 mb-2">
            Create account
          </Text>
          <Text className="text-gray-500 text-center">
            Start your journaling journey
          </Text>
        </View>

        <View className="">
          <FormInput
            control={control}
            name="fullName"
            label="Full Name"
            placeholder="Enter your full name"
            autoCapitalize="words"
            error={errors.fullName}
          />

          <FormInput
            control={control}
            name="email"
            className="mt-4"
            label="Email"
            placeholder="Enter your email"
            keyboardType="email-address"
            error={errors.email}
          />

          <PasswordInput
            control={control}
            name="password"
            label="Password"
            placeholder="Create a password"
            error={errors.password}
            showPassword={passwordVisibility[0]}
            onTogglePassword={() => togglePasswordVisibility(0)}
          />

          <PasswordInput
            control={control}
            name="confirmPassword"
            label="Confirm Password"
            placeholder="Confirm your password"
            error={errors.confirmPassword}
            showPassword={passwordVisibility[1]}
            onTogglePassword={() => togglePasswordVisibility(1)}
          />

          <PrimaryButton
            onPress={handleSubmit(onSubmit)}
            disabled={authLoading}
            className="mt-6"
            title={authLoading ? "Signing up…" : "Sign Up"}
          />

          <View className="flex-row justify-center mt-8">
            <Text className="text-gray-500">Already have an account? </Text>
            <Link href="/auth/signin" asChild replace>
              <TouchableOpacity>
                <Text className="text-purple-600 font-semibold">Sign in</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </View>
      </View>
    </KeyboardAwareScrollView>
  );
}

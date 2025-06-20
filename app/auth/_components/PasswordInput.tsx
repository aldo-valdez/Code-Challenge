import PrimaryInput from "@/components/PrimaryInput";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import { Text, TouchableOpacity, View } from "react-native";

interface PasswordInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  error?: FieldError;
  showPassword: boolean;
  onTogglePassword: () => void;
}

export const PasswordInput: React.FC<PasswordInputProps> = ({
  control,
  name,
  label,
  placeholder,
  error,
  showPassword,
  onTogglePassword,
}) => {
  return (
    <View className="mt-4">
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <View className="relative">
        <Controller
          control={control}
          name={name}
          render={({ field: { onChange, value } }) => (
            <PrimaryInput
              value={value}
              onChangeText={onChange}
              placeholder={placeholder}
              secureTextEntry={!showPassword}
              autoCapitalize="none"
              autoCorrect={false}
              className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900 pr-12"
              placeholderTextColor="#9CA3AF"
            />
          )}
        />
        <TouchableOpacity
          onPress={onTogglePassword}
          className="absolute right-4 top-4"
        >
          <Ionicons
            name={showPassword ? "eye-off" : "eye"}
            size={20}
            color="#9CA3AF"
          />
        </TouchableOpacity>
      </View>
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
      )}
    </View>
  );
};

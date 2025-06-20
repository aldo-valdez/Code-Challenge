import PrimaryInput from "@/components/PrimaryInput";
import React from "react";
import { Control, Controller, FieldError } from "react-hook-form";
import { Text, View } from "react-native";

interface FormInputProps {
  control: Control<any>;
  name: string;
  label: string;
  placeholder: string;
  error?: FieldError;
  keyboardType?: "default" | "email-address" | "numeric" | "phone-pad";
  autoCapitalize?: "none" | "sentences" | "words" | "characters";
  autoCorrect?: boolean;
  className?: string;
}

export const FormInput: React.FC<FormInputProps> = ({
  control,
  name,
  label,
  placeholder,
  error,
  keyboardType = "default",
  autoCapitalize = "none",
  autoCorrect = false,
  className,
}) => {
  return (
    <View className={className}>
      <Text className="text-gray-700 font-medium mb-2">{label}</Text>
      <Controller
        control={control}
        name={name}
        render={({ field: { onChange, value } }) => (
          <PrimaryInput
            value={value}
            onChangeText={onChange}
            placeholder={placeholder}
            keyboardType={keyboardType}
            autoCapitalize={autoCapitalize}
            autoCorrect={autoCorrect}
            className="bg-gray-50 border border-gray-200 rounded-xl px-4 py-4 text-gray-900"
            placeholderTextColor="#9CA3AF"
          />
        )}
      />
      {error && (
        <Text className="text-red-500 text-sm mt-1">{error.message}</Text>
      )}
    </View>
  );
};

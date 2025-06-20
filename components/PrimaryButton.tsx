import React from "react";
import {
  PressableProps,
  StyleProp,
  Text,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

interface PrimaryButtonProps extends PressableProps {
  className?: string;
  style?: StyleProp<ViewStyle>;
  textClassName?: string;
  textStyle?: StyleProp<TextStyle>;
  onPress: () => void;
  title: string;
  disabled?: boolean;
}

export default function PrimaryButton({
  className = "",
  style,
  textClassName = "",
  textStyle,
  onPress,
  title,
  disabled,
  ...props
}: PrimaryButtonProps) {
  return (
    <TouchableOpacity
      className={`bg-purple-600 rounded-xl py-4 items-center justify-center ${
        disabled ? "bg-opacity-30" : "bg-opacity-100"
      } ${className}`}
      style={style}
      onPress={onPress}
      disabled={disabled}
      {...props}
    >
      <Text
        className={`text-white font-semibold text-lg ${textClassName}`}
        style={textStyle}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
}

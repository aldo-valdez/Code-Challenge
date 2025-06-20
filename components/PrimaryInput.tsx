import React, { forwardRef } from 'react';
import { StyleProp, TextInput, TextInputProps, TextStyle } from 'react-native';

interface PrimaryInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  value: string;
  onChangeText: (text: string) => void;
  className?: string;
  style?: StyleProp<TextStyle>;
}

const PrimaryInput = forwardRef<TextInput, PrimaryInputProps>(
  ({ value, onChangeText, className = '', style, ...props }, ref) => {
    return (
      <TextInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        className={className}
        style={style}
        {...props}
      />
    );
  }
);

PrimaryInput.displayName = 'PrimaryInput';

export default PrimaryInput;

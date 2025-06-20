import { useState } from "react";

export const usePasswordVisibility = (initialState = false) => {
  const [showPassword, setShowPassword] = useState(initialState);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return {
    showPassword,
    togglePasswordVisibility,
  };
};

export const useMultiplePasswordVisibility = (count: number) => {
  const [passwordVisibility, setPasswordVisibility] = useState<boolean[]>(
    new Array(count).fill(false)
  );

  const togglePasswordVisibility = (index: number) => {
    setPasswordVisibility((prev) => {
      const newState = [...prev];
      newState[index] = !newState[index];
      return newState;
    });
  };

  return {
    passwordVisibility,
    togglePasswordVisibility,
  };
};

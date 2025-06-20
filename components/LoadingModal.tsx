import React from "react";
import { ActivityIndicator, Modal, Platform, Text, View } from "react-native";

interface Props {
  visible: boolean;
  message?: string;
}

const LoadingModal = ({ visible, message }: Props) => {
  return (
    <Modal transparent={true} visible={visible} animationType="fade">
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-lg p-5 w-2/6 items-center">
          <ActivityIndicator
            size={Platform.OS === "ios" ? "large" : 40}
            color={"black"}
          />
          <Text className="text-black text-sm leading-5 font-bold mt-2.5">
            {message ? message : "Please wait ..."}
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default LoadingModal;

import { useJournalEntries } from "@/app/journal/_hooks";
import { JournalEntry } from "@/app/journal/_types";
import LoadingModal from "@/components/LoadingModal";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import Toast from "react-native-toast-message";
import Header from "../../../components/Header";

export default function JournalDetailScreen() {
  const { id } = useLocalSearchParams();
  const { getEntry, deleteEntry, isLoading } = useJournalEntries();
  const [entry, setEntry] = useState<JournalEntry | null>(null);
  const [isLoadingEntry, setIsLoadingEntry] = useState(true);

  useEffect(() => {
    const fetchEntry = async () => {
      if (id && typeof id === "string") {
        const result = await getEntry(id);
        if (result.success && result.data) {
          setEntry(result.data);
          console.log(result.data);
        } else {
          Toast.show({
            type: "error",
            text1: "Failed to load journal entry",
          });
        }
      }
      setIsLoadingEntry(false);
    };

    fetchEntry();
  }, [id, getEntry]);

  const handleDelete = async () => {
    if (!entry) return;

    const result = await deleteEntry(entry.id);
    if (result.success) {
      router.back();
    }
  };

  if (isLoadingEntry) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-400 text-center mt-4">Loading...</Text>
      </View>
    );
  }

  if (!entry) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <Text className="text-gray-400 text-center mt-10">
          Entry not found.
        </Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <Header title="Entry Details" className="px-5" />
      <View className="flex-1 px-6 pb-4">
        <View className="items-center mt-8 mb-2">
          <View className="bg-purple-100 rounded-full p-6 mb-3">
            <Ionicons name="book-outline" size={48} color="#a78bfa" />
          </View>
          <Text className="text-gray-700 text-xl font-bold mb-1">
            Your Journal Entry
          </Text>
          <Text className="text-gray-400 text-base text-center max-w-xs">
            Reflect, express, and grow.
          </Text>
        </View>

        <View className="bg-gray-50 rounded-2xl p-6 mb-8 border border-gray-100 shadow-md mt-4">
          <View className="flex-row justify-between items-start mb-2">
            <Text className="text-xl font-semibold text-gray-900 leading-7 flex-1">
              {entry.text}
            </Text>
            <TouchableOpacity
              onPress={handleDelete}
              className="ml-3 p-2 bg-red-50 rounded-full"
            >
              <Ionicons name="trash-outline" size={22} color="#ef4444" />
            </TouchableOpacity>
          </View>
          <Text className="text-xs text-gray-400 mb-4">
            {new Date(entry.created_at).toLocaleString()}
          </Text>
          <View className="border-t border-gray-200 pt-5">
            <View className="flex-row flex-wrap gap-2 mb-3">
              {Object.entries(entry.mood).map(([emotion, score]) => {
                if (score > 0) {
                  const iconMap: Record<string, any> = {
                    happiness: "emoticon-happy-outline",
                    sadness: "emoticon-sad-outline",
                    anger: "emoticon-angry-outline",
                    fear: "emoticon-neutral-outline",
                    surprise: "emoticon-excited-outline",
                    disgust: "emoticon-poop-outline",
                  };
                  const colors = {
                    happiness: "bg-green-200 text-green-800",
                    sadness: "bg-blue-200 text-blue-800",
                    anger: "bg-red-200 text-red-800",
                    fear: "bg-purple-200 text-purple-800",
                    surprise: "bg-yellow-200 text-yellow-800",
                    disgust: "bg-gray-200 text-gray-800",
                  };
                  return (
                    <View
                      key={emotion}
                      className={`flex-row items-center px-3 py-1 rounded-full shadow-sm ${
                        colors[emotion as keyof typeof colors] ||
                        "bg-gray-200 text-gray-800"
                      }`}
                    >
                      <MaterialCommunityIcons
                        name={iconMap[emotion] || "emoticon-neutral-outline"}
                        size={16}
                        color="#8B5CF6"
                        style={{ marginRight: 4 }}
                      />
                      <Text className="text-sm font-medium">
                        {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                        {Math.round(score * 10)}%
                      </Text>
                    </View>
                  );
                }
                return null;
              })}
            </View>
            {entry.mood_confidence && (
              <View className="mb-3">
                <Text className="text-purple-700 text-sm font-medium">
                  Confidence: {Math.round(entry.mood_confidence * 100)}%
                </Text>
              </View>
            )}
            {entry.mood_summary && (
              <View className="mb-3">
                <Text className="text-gray-700 text-sm font-medium mb-1">
                  Analysis Summary:
                </Text>
                <Text className="text-gray-600 text-sm leading-5">
                  {entry.mood_summary}
                </Text>
              </View>
            )}
            {entry.mood_keywords && entry.mood_keywords.length > 0 && (
              <View className="mb-3 flex-row flex-wrap gap-2">
                <Text className="text-gray-700 text-sm font-medium mb-1">
                  Keywords:
                </Text>
                {entry.mood_keywords.map((kw) => (
                  <View
                    key={kw}
                    className="bg-purple-100 px-3 py-1 rounded-full"
                  >
                    <Text className="text-purple-700 text-xs font-semibold">
                      {kw}
                    </Text>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </View>
      <LoadingModal visible={isLoading} />
    </View>
  );
}

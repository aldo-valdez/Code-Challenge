import { useJournalEntries } from "@/app/journal/_hooks";
import { JournalEntry, Mood } from "@/app/journal/_types";
import Header from "@/components/Header";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useMemo } from "react";
import {
  ActivityIndicator,
  FlatList,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const moodTypes: (keyof Mood)[] = ["happiness", "fear", "sadness", "anger"];

export default function JournalListScreen() {
  const {
    entries,
    isLoading,
    error,
    filters,
    updateFilters,
    clearFilters,
    fetchEntries,
  } = useJournalEntries();

  const filteredEntries = useMemo(() => {
    if (!filters.mood) return entries;
    return entries.filter((entry) => {
      return (
        entry.mood &&
        entry.mood[filters.mood?.toLowerCase() as keyof Mood] &&
        (entry.mood[filters.mood?.toLowerCase() as keyof Mood] || 0) >= 1
      );
    });
  }, [entries, filters.mood]);

  const renderItem = useCallback(
    ({ item }: { item: JournalEntry }) => (
      <TouchableOpacity
        onPress={() =>
          router.push({ pathname: "/journal/detail", params: { id: item.id } })
        }
        className="bg-white rounded-2xl p-5 shadow-md border border-gray-100 mx-6 my-3 flex-row items-start gap-4"
        activeOpacity={0.85}
      >
        <View className="mt-1">
          <Ionicons name="document-text-outline" size={30} color="#8B5CF6" />
        </View>
        <View className="flex-1">
          <Text
            className="text-lg text-gray-900 mb-1 font-semibold"
            numberOfLines={3}
          >
            {item.text}
          </Text>
          <View className="mt-1">
            <View className="flex-row flex-wrap gap-1 mb-2">
              {Object.entries(item.mood).map(([emotion, score]) => {
                if (score > 0) {
                  const colors = {
                    happiness: "bg-green-100 text-green-700",
                    sadness: "bg-blue-100 text-blue-700",
                    anger: "bg-red-100 text-red-700",
                    fear: "bg-purple-100 text-purple-700",
                    surprise: "bg-yellow-100 text-yellow-700",
                    disgust: "bg-gray-100 text-gray-700",
                  };
                  return (
                    <Text
                      key={emotion}
                      className={`${
                        colors[emotion as keyof typeof colors] ||
                        "bg-gray-100 text-gray-700"
                      } px-2 py-1 rounded-full text-xs font-medium`}
                    >
                      {emotion.charAt(0).toUpperCase() + emotion.slice(1)}:{" "}
                      {Math.round(score * 10)}%
                    </Text>
                  );
                }
                return null;
              })}
            </View>
            {item.mood_confidence && (
              <Text className="text-xs text-gray-500">
                Confidence: {Math.round(item.mood_confidence * 100)}%
              </Text>
            )}
            {item.mood_keywords && item.mood_keywords.length > 0 && (
              <Text className="text-xs text-gray-500 mt-1" numberOfLines={1}>
                Keywords: {item.mood_keywords.slice(0, 3).join(", ")}
                {item.mood_keywords.length > 3 && "..."}
              </Text>
            )}
          </View>
          <Text className="text-xs text-gray-400 mt-2">
            {new Date(item.created_at).toLocaleDateString()}
          </Text>
        </View>
      </TouchableOpacity>
    ),
    []
  );

  const renderMoodItem = ({ item }: { item: keyof Mood }) => (
    <TouchableOpacity
      onPress={() => updateFilters({ mood: item })}
      className={`px-4 py-2 rounded-full border mr-4 ${
        filters.mood === item
          ? "bg-purple-600 border-purple-600"
          : "bg-gray-100 border-gray-200"
      }`}
    >
      <Text
        className={
          "text-xl" +
          (filters.mood === item ? "text-white font-semibold" : "text-gray-700")
        }
      >
        {item.charAt(0).toUpperCase() + item.slice(1)}
      </Text>
    </TouchableOpacity>
  );

  const ListEmptyComponent = useCallback(() => {
    if (isLoading) {
      return (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#8B5CF6" />
          <Text className="text-gray-400 text-center mt-4">
            Loading entries...
          </Text>
        </View>
      );
    }

    if (error) {
      return (
        <View className="flex-1 items-center justify-center">
          <Text className="text-red-500 text-center mt-10">{error}</Text>
        </View>
      );
    }

    return (
      <View className="flex-1 items-center justify-center mt-16">
        <MaterialCommunityIcons
          name="notebook-outline"
          size={64}
          color="#a3a3a3"
        />
        <Text className="text-gray-500 text-lg font-semibold text-center mt-6">
          {filters.mood
            ? `No entries found for ${filters.mood}.`
            : "No journal entries yet."}
        </Text>
        <Text className="text-gray-400 text-center mt-2 mb-4">
          Start writing to see your entries here.
        </Text>
      </View>
    );
  }, [isLoading, error, filters.mood]);

  if (isLoading) {
    return (
      <View className="flex-1 bg-white items-center justify-center">
        <ActivityIndicator size="large" color="#8B5CF6" />
        <Text className="text-gray-400 text-center mt-4">Loading...</Text>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white pb-4 pb-safe">
      <Header title="Journal Entries" className="px-5" justTitle />

      <View className="flex-row space-x-3 mt-6 px-6">
        <TouchableOpacity
          onPress={clearFilters}
          className={`px-4 py-2 rounded-full border mr-4 ${
            !filters.mood
              ? "bg-purple-600 border-purple-600"
              : "bg-gray-100 border-gray-200"
          }`}
        >
          <Text
            className={
              !filters.mood ? "text-white font-semibold" : "text-gray-700"
            }
          >
            All
          </Text>
        </TouchableOpacity>

        <FlatList
          data={moodTypes}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item}
          renderItem={renderMoodItem}
        />
      </View>

      <FlatList
        data={filteredEntries}
        keyExtractor={(item) => item.id}
        className="flex-1 mt-4"
        renderItem={renderItem}
        ListEmptyComponent={ListEmptyComponent}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity
        onPress={() => router.push("/journal/create")}
        className="absolute bottom-8 right-8 bg-purple-600 rounded-full p-5 shadow-lg z-50"
        activeOpacity={0.85}
        accessibilityLabel="Add new journal entry"
      >
        <Ionicons name="add" size={32} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}

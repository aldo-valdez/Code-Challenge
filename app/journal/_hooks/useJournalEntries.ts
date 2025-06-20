import { storage } from "@/storage";
import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
import Toast from "react-native-toast-message";
import { journalService } from "../_services";
import {
  CreateJournalEntryData,
  JournalEntry,
  JournalEntryFilters,
  UpdateJournalEntryData,
} from "../_types";

export const useJournalEntries = () => {
  const user = JSON.parse(storage.getString("user") || "{}");
  const userId = user?.user?.id;
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<JournalEntryFilters>({});

  const fetchEntries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await journalService.getEntries(userId, filters);

      if (result.success && result.data) {
        setEntries(result.data);
      } else {
        setError(result.error?.message || "Failed to fetch entries");
        Toast.show({
          type: "error",
          text1: "Failed to load journal entries",
        });
      }
    } catch (err) {
      setError("An unexpected error occurred");
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred",
      });
    } finally {
      setIsLoading(false);
    }
  }, [userId, filters]);

  const createEntry = useCallback(
    async (data: CreateJournalEntryData) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await journalService.createEntry(userId, data);

        if (result.success && result.data) {
          setEntries((prev) => [result.data!, ...prev]);
          Toast.show({
            type: "success",
            text1: "Journal entry created successfully",
          });
          return { success: true, data: result.data };
        } else {
          setError(result.error?.message || "Failed to create entry");
          Toast.show({
            type: "error",
            text1: "Failed to create journal entry",
          });
          return { success: false, error: result.error };
        }
      } catch (err) {
        setError("An unexpected error occurred");
        Toast.show({
          type: "error",
          text1: "An unexpected error occurred",
        });
        return { success: false, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    [userId]
  );

  const updateEntry = useCallback(
    async (entryId: string, data: UpdateJournalEntryData) => {
      try {
        setIsLoading(true);
        setError(null);

        const result = await journalService.updateEntry(entryId, data);

        if (result.success && result.data) {
          setEntries((prev) =>
            prev.map((entry) => (entry.id === entryId ? result.data! : entry))
          );
          Toast.show({
            type: "success",
            text1: "Journal entry updated successfully",
          });
          return { success: true, data: result.data };
        } else {
          setError(result.error?.message || "Failed to update entry");
          Toast.show({
            type: "error",
            text1: "Failed to update journal entry",
          });
          return { success: false, error: result.error };
        }
      } catch (err) {
        setError("An unexpected error occurred");
        Toast.show({
          type: "error",
          text1: "An unexpected error occurred",
        });
        return { success: false, error: err };
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const deleteEntry = useCallback(async (entryId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await journalService.deleteEntry(entryId);

      if (result.success) {
        setEntries((prev) => prev.filter((entry) => entry.id !== entryId));
        Toast.show({
          type: "success",
          text1: "Journal entry deleted successfully",
        });
        return { success: true };
      } else {
        setError(result.error?.message || "Failed to delete entry");
        Toast.show({
          type: "error",
          text1: "Failed to delete journal entry",
        });
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError("An unexpected error occurred");
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const getEntry = useCallback(async (entryId: string) => {
    try {
      setIsLoading(true);
      setError(null);

      const result = await journalService.getEntry(entryId);

      if (result.success && result.data) {
        return { success: true, data: result.data };
      } else {
        setError(result.error?.message || "Failed to fetch entry");
        Toast.show({
          type: "error",
          text1: "Failed to load journal entry",
        });
        return { success: false, error: result.error };
      }
    } catch (err) {
      setError("An unexpected error occurred");
      Toast.show({
        type: "error",
        text1: "An unexpected error occurred",
      });
      return { success: false, error: err };
    } finally {
      setIsLoading(false);
    }
  }, []);

  const updateFilters = useCallback((newFilters: JournalEntryFilters) => {
    setFilters(newFilters);
  }, [setFilters]);

  const clearFilters = useCallback(() => {
    setFilters({});
  }, [setFilters]);

  useFocusEffect(
    useCallback(() => {
      fetchEntries();
    }, [])
  );

  return {
    entries,
    isLoading,
    error,
    filters,
    fetchEntries,
    createEntry,
    updateEntry,
    deleteEntry,
    getEntry,
    updateFilters,
    clearFilters,
  };
};

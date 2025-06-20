import { supabase } from "@/lib/supabase";
import {
  CreateJournalEntryData,
  JournalEntry,
  JournalEntryFilters,
  Mood,
  UpdateJournalEntryData,
} from "../_types";

export class JournalService {
  private tableName = "journal_entries";

  async createEntry(
    userId: string,
    data: CreateJournalEntryData
  ): Promise<{ success: boolean; data?: JournalEntry; error?: any }> {
    try {
      const { data: entry, error } = await supabase
        .from(this.tableName)
        .insert({
          user_id: userId,
          text: data.text,
          mood: data.mood || { happiness: 5, fear: 5 },
          mood_confidence: data.mood_confidence,
          mood_keywords: data.mood_keywords,
          mood_summary: data.mood_summary,
        })
        .select()
        .single();

      if (error) {
        console.error("Error creating journal entry:", error);
        return { success: false, error };
      }

      return { success: true, data: entry };
    } catch (error) {
      console.error("Unexpected error creating journal entry:", error);
      return { success: false, error };
    }
  }

  async getEntries(
    userId: string,
    filters?: JournalEntryFilters
  ): Promise<{ success: boolean; data?: JournalEntry[]; error?: any }> {
    try {
      let query = supabase
        .from(this.tableName)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (filters?.search) {
        query = query.ilike("text", `%${filters.search}%`);
      }

      if (filters?.dateRange) {
        query = query
          .gte("created_at", filters.dateRange.start)
          .lte("created_at", filters.dateRange.end);
      }

      const { data: entries, error } = await query;

      if (error) {
        console.error("Error fetching journal entries:", error);
        return { success: false, error };
      }

      let filteredEntries = entries;
      if (filters?.mood) {
        filteredEntries = entries.filter(
          (entry) =>
            entry.mood &&
            entry.mood[filters.mood!] &&
            entry.mood[filters.mood!] > 5
        );
      }

      return { success: true, data: filteredEntries };
    } catch (error) {
      console.error("Unexpected error fetching journal entries:", error);
      return { success: false, error };
    }
  }

  async getEntry(
    entryId: string
  ): Promise<{ success: boolean; data?: JournalEntry; error?: any }> {
    try {
      const { data: entry, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("id", entryId)
        .single();

      if (error) {
        console.error("Error fetching journal entry:", error);
        return { success: false, error };
      }

      return { success: true, data: entry };
    } catch (error) {
      console.error("Unexpected error fetching journal entry:", error);
      return { success: false, error };
    }
  }

  async updateEntry(
    entryId: string,
    data: UpdateJournalEntryData
  ): Promise<{ success: boolean; data?: JournalEntry; error?: any }> {
    try {
      const { data: entry, error } = await supabase
        .from(this.tableName)
        .update({
          ...data,
          updated_at: new Date().toISOString(),
        })
        .eq("id", entryId)
        .select()
        .single();

      if (error) {
        console.error("Error updating journal entry:", error);
        return { success: false, error };
      }

      return { success: true, data: entry };
    } catch (error) {
      console.error("Unexpected error updating journal entry:", error);
      return { success: false, error };
    }
  }

  async deleteEntry(
    entryId: string
  ): Promise<{ success: boolean; error?: any }> {
    try {
      const { error } = await supabase
        .from(this.tableName)
        .delete()
        .eq("id", entryId);

      if (error) {
        console.error("Error deleting journal entry:", error);
        return { success: false, error };
      }

      return { success: true };
    } catch (error) {
      console.error("Unexpected error deleting journal entry:", error);
      return { success: false, error };
    }
  }

  async getEntriesByMood(
    userId: string,
    moodType: keyof Mood
  ): Promise<{ success: boolean; data?: JournalEntry[]; error?: any }> {
    try {
      const { data: entries, error } = await supabase
        .from(this.tableName)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching entries by mood:", error);
        return { success: false, error };
      }

      const filteredEntries = entries.filter(
        (entry) =>
          entry.mood && entry.mood[moodType] && entry.mood[moodType] > 5
      );

      return { success: true, data: filteredEntries };
    } catch (error) {
      console.error("Unexpected error fetching entries by mood:", error);
      return { success: false, error };
    }
  }
}

export const journalService = new JournalService();

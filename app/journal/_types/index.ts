export interface Mood {
  happiness: number;
  fear: number;
  sadness?: number;
  anger?: number;
  surprise?: number;
  disgust?: number;
}

export interface JournalEntry {
  id: string;
  user_id: string;
  text: string;
  mood: Mood;
  mood_confidence?: number;
  mood_keywords?: string[];
  mood_summary?: string;
  created_at: string;
  updated_at: string;
}

export interface CreateJournalEntryData {
  text: string;
  mood?: Mood;
  mood_confidence?: number;
  mood_keywords?: string[];
  mood_summary?: string;
}

export interface UpdateJournalEntryData {
  text?: string;
  mood?: Mood;
  mood_confidence?: number;
  mood_keywords?: string[];
  mood_summary?: string;
}

export interface JournalEntryFilters {
  mood?: keyof Mood;
  dateRange?: {
    start: string;
    end: string;
  };
  search?: string;
}

export interface MoodAnalysisResult {
  mood: Mood;
  confidence: number;
  keywords: string[];
  summary?: string;
}

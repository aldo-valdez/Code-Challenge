import Constants from "expo-constants";
import OpenAI from "openai";
import { supabase } from "../../../lib/supabase";
import { MoodAnalysisResult } from "../_types";

const openai = new OpenAI({
  apiKey: Constants.expoConfig?.extra?.openaiApiKey,
});

export class MoodAnalysisService {
  async analyzeMood(
    text: string,
    userId: string
  ): Promise<{ success: boolean; data?: MoodAnalysisResult; error?: any }> {
    try {
      const result = await this.analyzeMoodWithAI(text);

      if (!result.success || !result.data) {
        throw new Error("Failed to analyze mood with AI");
      }

      const { error: dbError } = await supabase.from("mood_analyses").insert({
        user_id: userId,
        text: text,
        analysis_result: result.data,
        created_at: new Date().toISOString(),
      });

      if (dbError) {
        console.error("Error storing mood analysis:", dbError);
      }

      return result;
    } catch (error) {
      console.error("Error in mood analysis:", error);
      return { success: false, error };
    }
  }

  private async analyzeMoodWithAI(
    text: string
  ): Promise<{ success: boolean; data?: MoodAnalysisResult; error?: any }> {
    try {
      const prompt = `Analyze the emotional content of this journal entry and provide a detailed analysis. 
      Return your response in the following JSON format:
      {
        "mood": {
          "happiness": number (0-10),
          "fear": number (0-10),
          "sadness": number (0-10),
          "anger": number (0-10),
          "surprise": number (0-10),
          "disgust": number (0-10)
        },
        "keywords": string[],
        "summary": string
      }

      The numbers should reflect the intensity of each emotion in the text.
      Keywords should be emotional terms or significant phrases from the text.
      The summary should be a brief emotional analysis of the text.

      Journal entry: "${text}"`;

      const response = await openai.chat.completions.create({
        model: "gpt-4-turbo-preview",
        messages: [
          {
            role: "system",
            content:
              "You are an expert emotional analysis AI. Your task is to analyze the emotional content of journal entries and provide detailed, accurate emotional assessments.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        response_format: { type: "json_object" },
      });

      const analysis = JSON.parse(
        response?.choices[0]?.message?.content || "{}"
      );

      const confidence = Math.min(
        0.95,
        0.7 + (response.usage?.completion_tokens || 0) / 1000
      );

      const result: MoodAnalysisResult = {
        ...analysis,
        confidence,
      };

      return { success: true, data: result };
    } catch (error) {
      console.error("Error in AI mood analysis:", error);
      return { success: false, error };
    }
  }
}

export const moodAnalysisService = new MoodAnalysisService();

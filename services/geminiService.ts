import { GoogleGenAI, Modality } from "@google/genai";
import { MEDICAL_SYSTEM_INSTRUCTION } from "../constants";

export class HealBotService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("Gemini API key is missing");
    }

    this.ai = new GoogleGenAI({ apiKey });
  }

  async getResponse(
    prompt: string,
    history: any[] = [],
    location?: { lat: number; lng: number },
    imageBase64?: string
  ) {
    try {
      const config: any = {
        systemInstruction: MEDICAL_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      };

      // Location support
      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng,
            },
          },
        };
      }

      // Prompt + optional image
      const currentParts: any[] = [{ text: prompt }];

      if (imageBase64) {
        const mimeMatch = imageBase64.match(/^data:(.*);base64,/);
        const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
        const data = imageBase64.split(",")[1] || imageBase64;

        currentParts.push({
          inlineData: {
            mimeType,
            data,
          },
        });
      }

      const response = await this.ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          ...history,
          { role: "user", parts: currentParts },
        ],
        config,
      });

      const text = response.text || "";

      return {
        text,
        groundingChunks:
          response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
        isEmergency:
          text.toLowerCase().includes("emergency") ||
          text.toLowerCase().includes("critical") ||
          text.toLowerCase().includes("urgent"),
      };
    } catch (error) {
      console.error("Gemini Service Error:", error);
      throw error;
    }
  }

  // 🎤 Live Voice Connection
  connectLive(callbacks: any, patientInfo: any) {
    return this.ai.live.connect({
      model: "gemini-2.5-flash-native-audio-preview-12-2025",
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Zephyr" },
          },
        },
        systemInstruction: `
${MEDICAL_SYSTEM_INSTRUCTION}

PATIENT CONTEXT:
- Name: ${patientInfo.name}
- Patient ID: ${patientInfo.patientId}
- Session ID: ${patientInfo.sessionId}

VOICE MODE: Keep responses concise. You are a medical assistant speaking via audio.
`,
      },
    });
  }
}

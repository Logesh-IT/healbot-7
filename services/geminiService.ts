
import { GoogleGenAI, Modality } from "@google/genai";
import { MEDICAL_SYSTEM_INSTRUCTION } from "../constants";

export class HealBotService {
  public ai: GoogleGenAI;

  constructor() {
    this.ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  }

  async getResponse(prompt: string, history: any[] = [], location?: { lat: number; lng: number }, imageBase64?: string) {
    try {
      const model = 'gemini-2.5-flash';
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

      const config: any = {
        systemInstruction: MEDICAL_SYSTEM_INSTRUCTION,
        tools: [{ googleSearch: {} }, { googleMaps: {} }],
      };

      if (location) {
        config.toolConfig = {
          retrievalConfig: {
            latLng: {
              latitude: location.lat,
              longitude: location.lng
            }
          }
        };
      }

      const currentParts: any[] = [{ text: prompt }];
      
      if (imageBase64) {
        const mimeTypeMatch = imageBase64.match(/^data:(.*);base64,/);
        const mimeType = mimeTypeMatch ? mimeTypeMatch[1] : "image/jpeg";
        const data = imageBase64.split(',')[1] || imageBase64;
        
        currentParts.push({
          inlineData: {
            mimeType,
            data
          }
        });
      }

      const response = await ai.models.generateContent({
        model,
        contents: [
          ...history,
          { role: 'user', parts: currentParts }
        ],
        config
      });

      const text = response.text || '';
      
      return {
        text,
        groundingChunks: response.candidates?.[0]?.groundingMetadata?.groundingChunks || [],
        isEmergency: text.toLowerCase().includes('emergency') || text.toLowerCase().includes('critical') || text.toLowerCase().includes('urgent')
      };
    } catch (error: any) {
      console.error("Gemini Service Error:", error);
      throw error;
    }
  }

  // Connect to the Live Voice-to-Voice API (Free Tier Preview)
  connectLive(callbacks: any, patientInfo: any) {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    return ai.live.connect({
      model: 'gemini-2.5-flash-native-audio-preview-12-2025',
      callbacks,
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } },
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

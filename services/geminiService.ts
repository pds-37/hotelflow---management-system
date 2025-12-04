import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize client only when needed to avoid crashes if env is missing
const getAiClient = () => {
    if (!apiKey) {
        console.warn("API Key is missing for Gemini");
        return null;
    }
    return new GoogleGenAI({ apiKey });
};

export const GeminiService = {
    async askAssistant(prompt: string, contextData: string): Promise<string> {
        const ai = getAiClient();
        if (!ai) return "AI Service is unavailable. Please configure the API Key.";

        try {
            const model = 'gemini-2.5-flash';
            const systemInstruction = `You are a helpful Hotel Management Assistant. 
            You help staff with drafting emails, summarizing reports, and offering hospitality advice.
            Use the provided context about the hotel's current state (bookings, guests, rooms) to answer accurately.
            Keep answers professional, concise, and polite.`;

            const response = await ai.models.generateContent({
                model,
                contents: [
                    { role: 'user', parts: [{ text: `Context Data:\n${contextData}\n\nUser Request: ${prompt}` }] }
                ],
                config: {
                    systemInstruction,
                }
            });

            return response.text || "I couldn't generate a response.";
        } catch (error) {
            console.error("Gemini API Error:", error);
            return "Sorry, I encountered an error processing your request.";
        }
    }
};
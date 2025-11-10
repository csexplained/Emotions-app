import { GoogleGenerativeAI } from '@google/generative-ai';

const GEMINI_API_KEY = process.env.EXPO_PUBLIC_GEMINI_API_KEY;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY || '');

export const getGeminiResponse = async (userMessage: string, mode: string) => {
  try {
    // For text-only input
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const prompt = `You are a helpful and emotionally intelligent mental wellness assistant. The user wants to talk about: "${mode}". Respond kindly and supportively.

User: ${userMessage}

Assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error("Gemini API Error", error);
    return "Sorry, I'm having trouble understanding that. Can you rephrase?";
  }
};

// For image + text input
export const getGeminiVisionResponse = async (
  userMessage: string,
  mode: string,
  imageBase64: string,
  mimeType: string = 'image/jpeg'
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const prompt = `You are a helpful and emotionally intelligent mental wellness assistant. The user wants to talk about: "${mode}". 
    
Look at the image and respond kindly and supportively to the user's message.

User message: ${userMessage}

Assistant:`;

    const imagePart = {
      inlineData: {
        data: imageBase64,
        mimeType: mimeType,
      },
    };

    const result = await model.generateContent([
      { text: prompt },
      imagePart,
    ]);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error("Gemini Vision API Error", error);
    return "Sorry, I'm having trouble processing your image and message. Can you try again?";
  }
};

// For chat history (multi-turn conversations)
export interface ChatMessage {
  role: 'user' | 'model';
  parts: { text: string }[];
}

export const getGeminiChatResponse = async (
  userMessage: string,
  mode: string,
  chatHistory: ChatMessage[] = []
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const systemMessage: ChatMessage = {
      role: 'user',
      parts: [{ text: `You are a helpful and emotionally intelligent mental wellness assistant. The user wants to talk about: "${mode}". Always respond kindly and supportively.` }]
    };

    const systemResponse: ChatMessage = {
      role: 'model',
      parts: [{ text: "I understand. I'm here to provide kind, supportive, and emotionally intelligent responses about mental wellness and emotions." }]
    };

    const chat = model.startChat({
      history: [
        systemMessage,
        systemResponse,
        ...chatHistory,
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error("Gemini Chat API Error", error);
    return "Sorry, I'm having trouble understanding that. Can you rephrase?";
  }
};

// Alternative simpler chat function without history
export const getGeminiSimpleChat = async (userMessage: string, mode: string) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `You are a helpful and emotionally intelligent mental wellness assistant. The user wants to talk about: "${mode}". Always respond kindly and supportively.` }],
        },
        {
          role: "model",
          parts: [{ text: "I understand. I'm here to provide kind, supportive, and emotionally intelligent responses about mental wellness and emotions." }],
        },
      ],
    });

    const result = await chat.sendMessage(userMessage);
    const response = await result.response;
    return response.text().trim();

  } catch (error) {
    console.error("Gemini Chat API Error", error);
    return "Sorry, I'm having trouble understanding that. Can you rephrase?";
  }
};

// Utility to convert image to base64 for Gemini Vision
export const imageToBase64 = async (imageUri: string): Promise<string> => {
  try {
    // For React Native, you might need to use a different approach
    // This is a simplified version - you may need to adjust based on your image source
    const response = await fetch(imageUri);
    const blob = await response.blob();

    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => {
        // Remove the data:image/jpeg;base64, prefix
        const base64 = reader.result?.toString().split(',')[1];
        if (base64) {
          resolve(base64);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    });
  } catch (error) {
    console.error('Error converting image to base64:', error);
    throw error;
  }
};

// Helper function to create chat history
export const createChatMessage = (role: 'user' | 'model', text: string): ChatMessage => {
  return {
    role,
    parts: [{ text }]
  };
};

// services/geminiService.ts
// Add this function to your existing service

export const getGeminiStreamResponse = async (
  userMessage: string,
  mode: string,
  onChunk: (chunk: string) => void
) => {
  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 1024,
      },
    });

    const prompt = `You are a helpful and emotionally intelligent mental wellness assistant. The user wants to talk about: "${mode}". Respond kindly and supportively.

User: ${userMessage}

Assistant:`;

    const result = await model.generateContentStream(prompt);
    let fullResponse = '';

    for await (const chunk of result.stream) {
      const chunkText = chunk.text();
      fullResponse += chunkText;
      onChunk(chunkText);
    }

    return fullResponse;
  } catch (error) {
    console.error("Gemini Stream API Error", error);
    throw error;
  }
};
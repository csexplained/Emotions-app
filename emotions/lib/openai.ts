import axios from "axios";

const OPENAI_API_KEY = process.env.EXPO_PUBLIC_OPENAI_API_KEY;

export const getOpenAIResponse = async (userMessage: string, mode: string) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: `You are a helpful and emotionally intelligent mental wellness assistant. The user wants to talk about: "${mode}". Respond kindly and supportively.`,
          },
          {
            role: "user",
            content: userMessage,
          },
        ],
        temperature: 0.7,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error("OpenAI API Error", error);
    return "Sorry, I'm having trouble understanding that. Can you rephrase?";
  }
};

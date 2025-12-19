import OpenAI from "openai/index.js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

async function getAIResponse(prompt) {
  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      { role: "system", content: "You are a helpful Discord chatbot." },
      { role: "user", content: prompt },
      { max_tokens: 300 }, // 🔑 limits response size
    ],
  });

  console.log(response);

  return response.choices[0].message.content;
}

export { getAIResponse };

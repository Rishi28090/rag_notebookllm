import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { queryQdrant } from "./qdrant.js";


const chatModel = new ChatGoogleGenerativeAI({
    apiKey:process.env.GEMINI_API_KEY,
    model:"gemini-2.0-flash"
});

export async function chatWithDocs(userMessage) {
  const contextDocs = await queryQdrant(userMessage);

  const contextText = contextDocs
    .map((d, i) => `(${i+1}) ${d.snippet}\nSource: ${d.source}`)
    .join("\n\n");

  const response = await chatModel.invoke([
    { role: "system", content: `You are a helpful AI assistant.
Your responses must always follow these rules:
1. Be **concise and clear** — avoid long paragraphs.
2. Use **bullet points, numbered lists, or short sections** instead of big text blocks.
3. Provide **examples in code blocks** when relevant.
4. Only explain what is necessary for the question — avoid repeating context multiple times.
5. If extra details exist, summarize them briefly and suggest further exploration instead of dumping everything.
6. Always make responses **easy to scan** with proper formatting (headings, bullets, code).` },
    { role: "user", content: `Question: ${userMessage}\n\nContext:\n${contextText}` }
  ]);

  return {
    answer: response.content,
    sources: contextDocs
  };
}
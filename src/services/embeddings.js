// src/services/embeddings.js
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";

const embeddings = new GoogleGenerativeAIEmbeddings({
  model: "text-embedding-004", // correct Gemini embeddings model
  apiKey: process.env.GEMINI_API_KEY,
});

export async function embedText(text) {
  if (!text || typeof text !== "string") {
    throw new Error("❌ embedText() received invalid text: " + text);
  }
  return embeddings.embedQuery(text);
}

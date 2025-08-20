import express from "express";
import { upload } from "../middlewares/upload.js";
import { loadDocs } from "../services/loader.js";
import { saveDocsToQdrant } from "../services/qdrant.js";
import { chatWithDocs } from "../services/chat.js";

const router = express.Router();

// In-memory storage (simple, resets on server restart)
let messages = [];
let sources = [];

// Home page: upload + chat on same page
router.get("/", (req, res) => {
  res.render("chat", { messages, sources });
});

// Upload PDF or website
router.post("/upload", upload.single("file"), async (req, res) => {
  const pdfPath = req.file ? req.file.path : null;
  const websiteUrl = req.body.website;

  try {
    const docs = await loadDocs(pdfPath, websiteUrl);
    await saveDocsToQdrant(docs);

    if (pdfPath) sources.push(pdfPath);
    if (websiteUrl) sources.push(websiteUrl);

    res.redirect("/");
  } catch (err) {
    console.error("Upload error:", err);
    res.render("chat", {
      messages: [...messages, { user: "Upload Error", bot: "Failed to process your file/website." }],
      sources,
    });
  }
});

// Chat with LLM
router.post("/chat", async (req, res) => {
  const { question } = req.body;

  if (!question || question.trim() === "") {
    messages.push({ user: "⚠️ No question", bot: "Please enter a question." });
    return res.redirect("/");
  }

  try {
    const { answer, sources: chatSources } = await chatWithDocs(question.trim());
    messages.push({ user: question, bot: answer });
    if (chatSources && chatSources.length > 0) sources.push(...chatSources);

    res.redirect("/");
  } catch (err) {
    console.error("Chat error:", err);
    messages.push({ user: question, bot: "⚠️ Error while processing your question." });
    res.redirect("/");
  }
});

export default router;

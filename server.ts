import express from "express";
import path from "path";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "10mb" }));

// Helper to initialize GoogleGenAI client safely
function getGeminiClient() {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is missing.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// 1. Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// 2. Multi-turn AI Chat Endpoint
app.post("/api/chat", async (req, res) => {
  try {
    const { messages, systemInstruction, model, temperature } = req.body;

    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required." });
    }

    // Supported models per requirements
    const validModels = [
      "gemini-3.5-flash",
      "gemini-3.1-pro-preview",
      "gemini-3.1-flash-lite",
      "gemini-3.6-flash"
    ];
    const selectedModel = validModels.includes(model) ? model : "gemini-3.5-flash";

    const ai = getGeminiClient();

    const fullSystemInstruction = systemInstruction || 
      "You are Gemini AI Studio Assistant, a helpful, intelligent, and versatile AI companion. Provide detailed, well-structured markdown answers.";

    // Map conversation history into SDK format
    const formattedContents = messages.map((m: { role: string; text: string }) => ({
      role: m.role === "assistant" || m.role === "model" ? "model" : "user",
      parts: [{ text: m.text }],
    }));

    const response = await ai.models.generateContent({
      model: selectedModel,
      contents: formattedContents,
      config: {
        systemInstruction: fullSystemInstruction,
        temperature: typeof temperature === "number" ? temperature : 0.7,
      },
    });

    const reply = response.text || "No response generated.";

    return res.json({
      reply,
      modelUsed: selectedModel,
      timestamp: new Date().toISOString(),
    });
  } catch (err: any) {
    console.error("Gemini Chat API Error:", err);
    return res.status(500).json({
      error: err.message || "Failed to communicate with Gemini AI.",
    });
  }
});

// Start Express + Vite dev server middleware
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Gemini AI Chatbot server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

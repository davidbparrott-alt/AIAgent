import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import Anthropic from "@anthropic-ai/sdk";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const client = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

// Simple test route
app.get("/", (req, res) => {
  res.send("BeeAgent backend is running");
});

// AI route
app.post("/api/ask", async (req, res) => {
  try {
    const { question, weather, pollen } = req.body;

    const response = await client.messages.create({
      model: "claude-3-5-sonnet-latest",
      max_tokens: 500,
      messages: [
        {
          role: "user",
          content: `
You are a beekeeping assistant. The beekeeper is in the UK.

Local weather:
${JSON.stringify(weather)}

Local pollen:
${JSON.stringify(pollen)}

User question:
${question}

Give practical, concise beekeeping advice.
          `
        }
      ]
    });

    res.json({ answer: response.content[0].text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "AI request failed" });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`BeeAgent backend running on http://localhost:${PORT}`);
});

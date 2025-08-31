import { Router } from "express";
import { generateNextQuestion, NextQuestionPayload } from "../services/aiService";

const router = Router();

/**
 * POST /ai/generate-next-question
 * Body: { name, category, description, previousAnswer? }
 * Returns: { question: string | null }
 */
router.post("/generate-next-question", async (req, res) => {
  try {
    const { name, category, description, previousAnswer } = req.body as NextQuestionPayload;

    if (!name || !category || !description) {
      return res.status(400).json({ error: "Missing required product fields." });
    }

    const question = await generateNextQuestion({ name, category, description, previousAnswer });

    res.json({ question });
  } catch (err: any) {
    console.error("❌ /generate-next-question error:", err);
    res.status(500).json({ error: "Failed to generate question", details: err.message });
  }
});

// Optional: test route
router.get("/test", async (_req, res) => {
  try {
    const question = await generateNextQuestion({
      name: "Test Product",
      category: "Electronics",
      description: "Sample product for testing AI questions",
    });

    res.json({ question, success: true });
  } catch (err: any) {
    console.error("❌ Test route error:", err);
    res.status(500).json({ error: err.message, success: false });
  }
});

export default router;

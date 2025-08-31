import { Router } from "express";
import { Product, IProduct } from "../models/Product";
import { generateAISummary, generateProductPDF } from "../services/reportService";

const router = Router();

/**
 * GET /api/reports/preview/:productId
 * Returns AI-generated summary text only
 */
router.get("/preview/:productId", async (req, res) => {
  try {
    const { productId } = req.params;
    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: "Product not found" });

    const summary = await generateAISummary(product);
    res.json({ summary });
  } catch (err: any) {
    console.error("❌ Failed to generate preview summary:", err);
    res.status(500).json({ error: "Failed to generate summary", message: err.message });
  }
});

/**
 * POST /api/reports/generate/:productId
 * Generates PDF with AI summary + follow-up answers
 */
router.post("/generate/:productId", async (req, res) => {
  try {
    const { productId } = req.params;

    const productDoc = await Product.findById(productId);
    if (!productDoc) return res.status(404).json({ error: "Product not found" });

    const summary = await generateAISummary(productDoc);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Product_Summary_${productDoc.name}.pdf`
    );

    await generateProductPDF(productDoc, summary, res);
  } catch (err: any) {
    console.error("❌ Failed to generate PDF:", err);
    res.status(500).json({ error: "Failed to generate PDF", message: err.message });
  }
});


export default router;

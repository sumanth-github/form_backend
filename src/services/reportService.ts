import PDFDocument from "pdfkit";
import { IProduct } from "../models/Product";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize Gemini AI
const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

if (!genAI) {
  console.warn("⚠️ GEMINI_API_KEY not found. AI summaries will fallback to default text.");
}

/**
 * Generate a professional AI summary based on product info and follow-up answers
 */
export const generateAISummary = async (product: IProduct): Promise<string> => {
  console.log("🔹 Generating AI summary for product:", product.name);

  if (!genAI) {
    console.warn("⚠️ GEMINI_API_KEY missing, using fallback");
    return fallbackSummary(product);
  }

  try {
    const prompt = `
Summarize product and its follow-up answers for stakeholders:
Product: ${product.name}
Category: ${product.category}
Description: ${product.description}
Follow-Up Answers:
${product.questions?.map((q, idx) => `${idx + 1}. ${q.question}: ${q.answer || "Not answered"}`).join("\n")}
`;

    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: { temperature: 0.7, maxOutputTokens: 1024 },
    });

    const result = await model.generateContent(prompt);
    const summary = (await result.response).text().trim();
    console.log("🔹 AI summary received:", summary);

    return summary || fallbackSummary(product);
  } catch (err) {
    console.error("❌ AI summary failed:", err);
    return fallbackSummary(product);
  }
};


/**
 * Fallback summary if AI fails or GEMINI_API_KEY missing
 */
export const fallbackSummary = (product: IProduct): string => {
  return `Product Report for "${product.name}"
Category: ${product.category}
Description: ${product.description}

Follow-Up Answers:
${product.questions?.map((q, idx) => `${idx + 1}. ${q.question}: ${q.answer || "Not answered"}`).join("\n")}
  `;
};

/**
 * Generate a PDF (writes to a writable stream)
 */
export const generateProductPDF = async (
  product: IProduct,
  summaryText: string,
  writeStream: NodeJS.WritableStream
): Promise<void> => {
  const doc = new PDFDocument({ size: "A4", margin: 50 });

  doc.pipe(writeStream);

  // Header
  doc.fontSize(20).text("Product Summary Report", { align: "center" });
  doc.moveDown();

  // Product info
  doc.fontSize(16).text(`Product: ${product.name}`);
  doc.fontSize(14).text(`Category: ${product.category}`);
  doc.moveDown();
  doc.fontSize(12).text(`Description: ${product.description}`);
  doc.moveDown();

  // Follow-up Q&A
  doc.fontSize(12).text("Follow-Up Questions & Answers:");
  product.questions?.forEach((q, idx) => {
    doc.fontSize(12).text(`${idx + 1}. ${q.question}: ${q.answer || "Not answered"}`);
  });
  doc.moveDown();

  // AI Summary
  doc.fontSize(12).text("AI Summary:", { underline: true });
  doc.moveDown();
  doc.fontSize(12).text(summaryText);

  doc.end();
};

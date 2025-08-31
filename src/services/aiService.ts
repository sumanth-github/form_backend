import { GoogleGenerativeAI } from "@google/generative-ai";

console.log("🔍 Environment Debug:");
console.log("NODE_ENV:", process.env.NODE_ENV);
console.log("GEMINI_API_KEY exists:", !!process.env.GEMINI_API_KEY);
const MAX_QUESTIONS = 5; // limit number of AI follow-up questions

if (!process.env.GEMINI_API_KEY) {
  console.error("❌ GEMINI_API_KEY is missing!");
}

const genAI = process.env.GEMINI_API_KEY
  ? new GoogleGenerativeAI(process.env.GEMINI_API_KEY)
  : null;

export interface NextQuestionPayload {
  name: string;
  category: string;
  description: string;
  previousAnswer?: string | null;
  existingQuestionsCount?: number; // ✅ add this
}


/**
 * Generate a **single, context-aware follow-up question**.
 * If previousAnswer is provided, generate the next question based on it.
 */
export async function generateNextQuestion(payload: NextQuestionPayload & { existingQuestions?: string[] }): Promise<string | null> {
  if (payload.existingQuestionsCount && payload.existingQuestionsCount >= MAX_QUESTIONS) {
    return null; // stop generating
  }
  if (!genAI) {
    console.warn("⚠️ GoogleGenerativeAI not initialized, returning fallback question.");
    return "What is the target audience for this product?";
  }

  const { name, category, description, previousAnswer, existingQuestions = [] } = payload;

  // STOP if max questions reached
  

const prompt = previousAnswer
  ? `Based on the previous answer: "${previousAnswer}", generate **one concise, professional follow-up question** that helps uncover transparent and verifiable information about the product. Focus on details such as ingredients, sourcing, certifications, sustainability, claims, or safety. If no more questions are needed, return "DONE".

Product Name: ${name}
Category: ${category}
Description: ${description}

Return only the question text. Do not add numbering, explanations, or filler text.`
  : `Generate the first professional, context-aware follow-up question that gathers transparent and verifiable information about this product. Focus on details such as ingredients, sourcing, certifications, sustainability, claims, or safety. If no questions are needed, return "DONE".

Product Name: ${name}
Category: ${category}
Description: ${description}

Return only the question text. Do not add numbering, explanations, or filler text.`;


  try {
    const model = genAI.getGenerativeModel({
      model: "gemini-1.5-flash",
      generationConfig: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
        maxOutputTokens: 256,
      },
    });

    const result = await model.generateContent(prompt);
    const responseText = (await result.response).text().trim();

    if (!responseText || responseText === "DONE") return null;

    return responseText;
  } catch (err: any) {
    console.error("❌ Error generating next question:", err);
    return "What is the target audience for this product?"; // fallback
  }
}

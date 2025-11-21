import { GoogleGenAI } from "@google/genai";
import { Invoice } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const GeminiService = {
  generateSalesInsights: async (invoices: Invoice[]) => {
    if (invoices.length === 0) {
      return "No sales data available yet. Create some invoices to get AI insights!";
    }

    // Prepare a summary for the model to reduce token usage
    const summary = invoices.map(inv => ({
      date: inv.date,
      total: inv.total,
      customer: inv.customerName,
      itemCount: inv.items.length
    }));

    const prompt = `
      Analyze the following sales invoice data and provide a brief, actionable executive summary (max 3 bullet points) highlighting trends, top performers, or anomalies. 
      Format the output as Markdown.
      
      Data: ${JSON.stringify(summary)}
    `;

    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            systemInstruction: "You are a helpful financial analyst for a small business.",
            temperature: 0.7,
        }
      });
      return response.text;
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "Unable to generate insights at this time. Please try again later.";
    }
  }
};
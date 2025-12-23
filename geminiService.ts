
import { GoogleGenAI } from "@google/genai";
import { SelectedCardInfo, TarotCard } from "./types";

// The SDK handles authentication via the provided API KEY.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Generates a mystical interpretation of the chosen cards.
 */
export async function getTarotInterpretation(
  question: string,
  selectedCards: SelectedCardInfo[]
): Promise<string> {
  const cardsPrompt = selectedCards
    .map(
      (c, i) =>
        `位置 ${i + 1}: ${c.card.name} - 關鍵字: ${c.card.keyword}`
    )
    .join("\n");

  const prompt = `
    你是一位精通亞歷斯特·克勞利「托特塔羅牌」的神祕學導師。
    使用者在「托特之鏡」特展中詢問：「${question}」
    
    抽出的牌陣：
    ${cardsPrompt}

    請進行深度靈魂解析：
    1. 【氣氛】：神祕、優雅、富有哲理。
    2. 【結構】：
       - 能量感應：簡述當下的靈性氛圍。
       - 三牌解析：分別解讀三張牌對應「過去/基礎」、「現況/阻礙」、「未來/建議」。
       - 總結：給予一個充滿光力量的指引。
    
    請用繁體中文回答，約 400 字。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "連結阿卡西紀錄時發生波動，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "連線異常。請確認您的授權權杖（st_開頭學號）是否正確設定。";
  }
}

/**
 * Generates a unique visual representation for a Thoth Tarot card 
 * using the gemini-2.5-flash-image (Nano Banana) model.
 */
export async function generateCardVisual(cardName: string, question: string): Promise<string> {
  const prompt = `A mystical Thoth Tarot card artwork for "${cardName}". 
    The theme is related to the question: "${question}". 
    Style: Sacred geometry, Crowleyan occult art, deep purples, golds, and cosmic energy, high detail, symmetrical, esoteric symbols.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: { aspectRatio: "3:4" }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned");
  } catch (error) {
    console.error("Image Generation Error:", error);
    // Fallback to a placeholder if image generation fails
    return `https://picsum.photos/seed/${cardName}/300/500`;
  }
}

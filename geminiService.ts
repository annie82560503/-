
import { GoogleGenAI } from "@google/genai";
import { SelectedCardInfo } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTarotInterpretation(
  question: string,
  selectedCards: SelectedCardInfo[]
): Promise<string> {
  const cardsPrompt = selectedCards
    .map(
      (c, i) =>
        `位置 ${i + 1}: ${c.card.name} - 核心意涵: ${c.card.keyword}`
    )
    .join("\n");

  const prompt = `
    你是一位精通亞歷斯特·克勞利 (Aleister Crowley) 「托特塔羅牌」的神祕學導師。
    使用者在「托特之鏡」特展中提出了以下問題：「${question}」
    
    抽出的三張牌陣與能量如下：
    ${cardsPrompt}

    請遵循以下解讀規格：
    1. 【語氣】：深邃、優雅、富有哲理且具啟發性。請適度融入「元素（火水風土）」、「占星符號」或「生命之樹」的術語。
    2. 【結構】：
       - 序言：感應問題的能量流動。
       - 第一張（過去/基礎）：分析目前狀態的根源。
       - 第二張（當下/挑戰）：指出目前最需要關注的能量衝突或契機。
       - 第三張（建議/趨勢）：給予靈魂層面的具體建議。
       - 總結：一句充滿力量的結束語。
    
    3. 請使用繁體中文，字數約 300-500 字，讓讀者感到這是場心靈的洗禮。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "星辰暫時沈默，請稍後再試。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "連結阿卡西紀錄時發生波動，建議您專注呼吸，再次嘗試。";
  }
}

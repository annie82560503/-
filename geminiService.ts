
import { GoogleGenAI, Type } from "@google/genai";
import { SelectedCardInfo } from "./types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export async function getTarotInterpretation(
  question: string,
  selectedCards: SelectedCardInfo[]
): Promise<string> {
  const cardsPrompt = selectedCards
    .map(
      (c, i) =>
        `牌卡 ${i + 1}: ${c.card.name} (${c.isReversed ? "逆位" : "正位"}) - 關鍵字: ${c.card.keyword}`
    )
    .join("\n");

  const prompt = `
    你是一位專業的托特塔羅牌大師（Thoth Tarot Master）。
    使用者詢問的問題是：「${question}」
    抽出的三張牌陣如下：
    ${cardsPrompt}

    請針對以上三張牌進行深度解讀：
    1. 第一張代表過去或目前的基礎能量。
    2. 第二張代表目前的阻礙或發展能量。
    3. 第三張代表未來的趨勢或建議。
    4. 最後給予一個綜合性的總結。
    
    請使用神秘、優雅且具啟發性的語氣，並融合托特塔羅牌特有的幾何美學與象徵意涵進行分析。
    請用繁體中文回答。
  `;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
    });
    return response.text || "無法獲取解讀內容。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "連線異常，請手動參考牌義：\n" + cardsPrompt;
  }
}


import { SelectedCardInfo } from "./types";

const BASE_URL = "https://gemini-for-student.annchen1982.workers.dev";
// 修正 Token：根據規格應為 st_112050047
const AUTH_TOKEN = "st_112050047";

/**
 * 呼叫學生代理 API 的通用函數 (純 fetch 實作)
 */
async function callProxy(endpoint: string, prompt: string) {
  const response = await fetch(`${BASE_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Authorization': AUTH_TOKEN,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: prompt }]
      }]
    })
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error(`API Error (${response.status}):`, errorData);
    throw new Error(`API Error: ${response.status}`);
  }

  return await response.json();
}

/**
 * 透過 /chat 取得塔羅牌義解讀
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
       - 總結：給予一個充滿力量的指引。
    
    請用繁體中文回答，約 400 字。
  `;

  try {
    const data = await callProxy('/chat', prompt);
    // 根據代理 API 文件定義的解析路徑：data.candidates[0].content.parts[0].text
    return data.candidates?.[0]?.content?.parts?.[0]?.text || "連結阿卡西紀錄時發生波動，請稍後再試。";
  } catch (error) {
    console.error("Chat API Error:", error);
    return "連線異常。請確認您的授權權杖是否正確設定 (st_112050047)。";
  }
}

/**
 * 透過 /text-to-image 生成獨一無二的塔羅牌視覺
 */
export async function generateCardVisual(cardName: string, question: string): Promise<string> {
  const prompt = `A high-quality mystical Thoth Tarot card artwork for "${cardName}". 
    The theme relates to: "${question}". 
    Style: Crowleyan esoteric art, sacred geometry, gold and deep purple palette, cinematic lighting, highly detailed occult symbols.`;

  try {
    const data = await callProxy('/text-to-image', prompt);
    
    // 增加容錯：同時檢查 inline_data 與 inlineData
    const part = data.candidates?.[0]?.content?.parts?.[0];
    const base64Image = part?.inline_data?.data || part?.inlineData?.data;
    
    if (!base64Image) {
      console.warn("No image data found in response, using fallback.", data);
      throw new Error("No image data found");
    }
    
    return `data:image/png;base64,${base64Image}`;
  } catch (error) {
    console.error("Image Generation Error:", error);
    // 失敗時回傳 placeholder，確保網頁不會白屏
    return `https://picsum.photos/seed/${encodeURIComponent(cardName + Math.random())}/300/500`;
  }
}

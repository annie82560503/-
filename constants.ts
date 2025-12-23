
import { TarotCard } from './types';

export const THOTH_DECK: TarotCard[] = [
  // Major Arcana (0-21)
  { id: 0, name: "愚者 (The Fool)", keyword: "冒險、純真、自由", type: 'major', imageUrl: "https://picsum.photos/seed/thoth0/300/500" },
  { id: 1, name: "魔術師 (The Magus)", keyword: "技巧、智慧、溝通", type: 'major', imageUrl: "https://picsum.photos/seed/thoth1/300/500" },
  { id: 2, name: "女祭司 (The Priestess)", keyword: "直覺、神秘、潛意識", type: 'major', imageUrl: "https://picsum.photos/seed/thoth2/300/500" },
  { id: 3, name: "皇后 (The Empress)", keyword: "豐盛、愛、母性", type: 'major', imageUrl: "https://picsum.photos/seed/thoth3/300/500" },
  { id: 4, name: "皇帝 (The Emperor)", keyword: "權威、結構、秩序", type: 'major', imageUrl: "https://picsum.photos/seed/thoth4/300/500" },
  { id: 5, name: "教皇 (The Hierophant)", keyword: "靈性引導、傳統、教義", type: 'major', imageUrl: "https://picsum.photos/seed/thoth5/300/500" },
  { id: 6, name: "戀人 (The Lovers)", keyword: "結合、選擇、二元性", type: 'major', imageUrl: "https://picsum.photos/seed/thoth6/300/500" },
  { id: 7, name: "戰車 (The Chariot)", keyword: "勝利、意志、克服", type: 'major', imageUrl: "https://picsum.photos/seed/thoth7/300/500" },
  { id: 8, name: "調整 (Adjustment)", keyword: "平衡、公義、平衡點", type: 'major', imageUrl: "https://picsum.photos/seed/thoth8/300/500" },
  { id: 9, name: "隱士 (The Hermit)", keyword: "內省、孤獨、尋求", type: 'major', imageUrl: "https://picsum.photos/seed/thoth9/300/500" },
  { id: 10, name: "命運之輪 (Fortune)", keyword: "循環、機會、變化", type: 'major', imageUrl: "https://picsum.photos/seed/thoth10/300/500" },
  { id: 11, name: "欲望 (Lust)", keyword: "激情、力量、創造力", type: 'major', imageUrl: "https://picsum.photos/seed/thoth11/300/500" },
  { id: 12, name: "倒吊人 (The Hanged Man)", keyword: "犧牲、暫停、視角", type: 'major', imageUrl: "https://picsum.photos/seed/thoth12/300/500" },
  { id: 13, name: "死神 (Death)", keyword: "轉化、終結、重生", type: 'major', imageUrl: "https://picsum.photos/seed/thoth13/300/500" },
  { id: 14, name: "藝術 (Art)", keyword: "融合、煉金術、平衡", type: 'major', imageUrl: "https://picsum.photos/seed/thoth14/300/500" },
  { id: 15, name: "惡魔 (The Devil)", keyword: "創意力、本能、束縛", type: 'major', imageUrl: "https://picsum.photos/seed/thoth15/300/500" },
  { id: 16, name: "高塔 (The Tower)", keyword: "崩毀、突破、真相", type: 'major', imageUrl: "https://picsum.photos/seed/thoth16/300/500" },
  { id: 17, name: "星星 (The Star)", keyword: "希望、靈感、清晰", type: 'major', imageUrl: "https://picsum.photos/seed/thoth17/300/500" },
  { id: 18, name: "月亮 (The Moon)", keyword: "幻影、潛意識、恐懼", type: 'major', imageUrl: "https://picsum.photos/seed/thoth18/300/500" },
  { id: 19, name: "太陽 (The Sun)", keyword: "光明、成功、繁榮", type: 'major', imageUrl: "https://picsum.photos/seed/thoth19/300/500" },
  { id: 20, name: "永恆 (Aeon)", keyword: "判斷、新時代、清晰", type: 'major', imageUrl: "https://picsum.photos/seed/thoth20/300/500" },
  { id: 21, name: "宇宙 (The Universe)", keyword: "完成、整合、合一", type: 'major', imageUrl: "https://picsum.photos/seed/thoth21/300/500" },

  // Minor Arcana & Court Cards - Simplified generation for brevity, covering all 78
  ...Array.from({ length: 56 }, (_, i) => {
    const id = i + 22;
    const suites = ["Wands", "Cups", "Swords", "Disks"] as const;
    const suite = suites[Math.floor(i / 14)];
    const rankIndex = i % 14;
    let name = "";
    let type: "minor" | "court" = "minor";
    
    if (rankIndex === 0) name = `Ace of ${suite}`;
    else if (rankIndex < 10) name = `${rankIndex + 1} of ${suite}`;
    else {
      type = "court";
      const courtNames = ["Princess", "Prince", "Queen", "Knight"];
      name = `${courtNames[rankIndex - 10]} of ${suite}`;
    }

    return {
      id,
      name: `${name} (托特)`,
      keyword: `${suite} 元素能量`,
      type,
      suite,
      imageUrl: `https://picsum.photos/seed/thoth${id}/300/500`
    };
  })
];

export const CARD_BACK_URL = "https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?auto=format&fit=crop&w=400&q=80";
export const BACKGROUND_IMAGE = "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&q=80&w=2000";

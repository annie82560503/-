
import React, { useState, useEffect } from 'react';
import { GameState, TarotCard, SelectedCardInfo } from './types';
import { THOTH_DECK, BACKGROUND_IMAGE, CARD_BACK_URL } from './constants';
import { getTarotInterpretation } from './geminiService';
import { 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  Info, 
  ChevronDown,
  Eye,
  Type
} from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WAIT);
  const [question, setQuestion] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  // 隨機打亂數字順序，模擬抽牌感
  useEffect(() => {
    setShuffledIndices(Array.from({ length: 78 }, (_, i) => i).sort(() => Math.random() - 0.5));
  }, [gameState === GameState.WAIT]);

  const handleStartExperience = () => {
    const element = document.getElementById('experience-section');
    element?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleStartShuffling = () => {
    if (question.length < 5) return;
    setGameState(GameState.SHUFFLING);
    setTimeout(() => {
      setGameState(GameState.SELECTING);
    }, 2000);
  };

  const toggleCardSelection = (id: number) => {
    if (gameState !== GameState.SELECTING) return;
    if (selectedIds.includes(id)) {
      setSelectedIds(prev => prev.filter(item => item !== id));
    } else if (selectedIds.length < 3) {
      setSelectedIds(prev => [...prev, id]);
    }
  };

  const handleConfirmFlip = async () => {
    if (selectedIds.length !== 3) return;
    setGameState(GameState.FLIPPING);
    setIsLoading(true);

    const cardsForInterpretation: SelectedCardInfo[] = selectedIds.map(id => ({
      card: THOTH_DECK[id],
      isReversed: Math.random() > 0.85 // 托特牌通常不強調逆位，但保留一點變數
    }));

    const result = await getTarotInterpretation(question, cardsForInterpretation);
    setInterpretation(result);
    setGameState(GameState.RESULT);
    setIsLoading(false);
  };

  useEffect(() => {
    if (gameState === GameState.RESULT && interpretation) {
      let i = 0;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText(prev => prev + interpretation.charAt(i));
        i++;
        if (i >= interpretation.length) clearInterval(interval);
      }, 25);
      return () => clearInterval(interval);
    }
  }, [gameState, interpretation]);

  return (
    <div className="min-h-screen bg-black text-slate-200 selection:bg-purple-500/30">
      
      {/* 1. Hero Section - 活動封面 */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center opacity-40 scale-105"
          style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-black/60 to-black z-0" />
        
        <div className="relative z-10 text-center px-4 animate-fade-in-up">
          <h2 className="font-mystical text-purple-400 tracking-[0.5em] text-sm md:text-xl mb-4 opacity-80">
            2025 SPECIAL EXHIBITION
          </h2>
          <h1 className="font-mystical text-6xl md:text-9xl text-white mb-8 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]">
            托特之鏡
          </h1>
          <p className="text-xl md:text-2xl font-light tracking-widest text-slate-300 max-w-2xl mx-auto mb-12">
            探索克勞利神祕主義下的 78 則命運啟示
          </p>
          
          <div className="flex flex-col md:flex-row items-center justify-center gap-8 mb-16">
            <div className="flex items-center gap-2 text-purple-200/70">
              <Calendar size={20} className="text-purple-500" />
              <span className="tracking-tighter">2025.04.12 — 04.20</span>
            </div>
            <div className="flex items-center gap-2 text-purple-200/70">
              <MapPin size={20} className="text-purple-500" />
              <span>台北華山 1914 文創園區</span>
            </div>
          </div>

          <button 
            onClick={handleStartExperience}
            className="group relative px-12 py-4 overflow-hidden rounded-full border border-purple-500/50 hover:border-purple-400 transition-all duration-500"
          >
            <div className="absolute inset-0 bg-purple-600/10 group-hover:bg-purple-600/20 transition-all" />
            <span className="relative z-10 font-mystical tracking-[0.3em] text-white flex items-center gap-3">
              進入冥想體驗 <ChevronDown className="group-hover:translate-y-1 transition-transform" />
            </span>
          </button>
        </div>
      </section>

      {/* 2. Intro Section - 活動介紹 */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <div className="space-y-8">
            <div className="inline-block px-4 py-1 rounded-full border border-purple-800 bg-purple-900/20 text-purple-400 text-xs tracking-widest uppercase">
              About Event
            </div>
            <h2 className="text-4xl font-bold tracking-tight">揭開阿萊斯特．克勞利的<br/><span className="text-purple-500">煉金術視野</span></h2>
            <p className="text-slate-400 leading-relaxed text-lg">
              托特塔羅牌 (Thoth Tarot) 是二十世紀最具神祕學影響力的藝術作品之一。本次特展結合 AI 深度學習技術，透過鏡面裝置與光影渲染，讓每位參與者都能在數字與幾何之間，尋找內在靈魂的共鳴。
            </p>
            <ul className="space-y-4">
              {[
                { title: "全幅牌卡展示", desc: "78張原版繪畫高畫質復刻展示" },
                { title: "AI 靈魂解讀", desc: "結合現代語言模型提供專屬占卜" },
                { title: "神祕學工作坊", desc: "資深塔羅師帶領深度探索課程" }
              ].map((item, idx) => (
                <li key={idx} className="flex gap-4 p-4 rounded-xl bg-white/5 border border-white/5">
                  <div className="w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center text-purple-500">
                    <Info size={24} />
                  </div>
                  <div>
                    <h4 className="font-bold text-white">{item.title}</h4>
                    <p className="text-sm text-slate-500">{item.desc}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative aspect-square rounded-3xl overflow-hidden border border-white/10 shadow-2xl">
            <img src="https://images.unsplash.com/photo-1572947650440-e8a97ef053b2?auto=format&fit=crop&q=80&w=1000" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
            <div className="absolute inset-0 bg-gradient-to-tr from-purple-900/40 to-transparent" />
          </div>
        </div>
      </section>

      {/* 3. Interactive Section - 互動體驗 (遊戲主體) */}
      <section id="experience-section" className="py-24 bg-mystic-gradient">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-mystical text-4xl text-white mb-4">預約你的啟示</h2>
            <p className="text-slate-500 tracking-widest">在數字的矩陣中，選擇與你共鳴的頻率</p>
          </div>

          <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[3rem] p-8 md:p-16 shadow-[0_0_100px_rgba(0,0,0,0.5)]">
            
            {/* Step 1: Input Question */}
            {gameState === GameState.WAIT && (
              <div className="max-w-md mx-auto space-y-8 text-center">
                <div className="space-y-2">
                  <label className="text-purple-400 font-mystical tracking-widest text-sm uppercase">輸入您的問題</label>
                  <textarea 
                    value={question}
                    onChange={(e) => setQuestion(e.target.value)}
                    placeholder="請靜下心，思考你想指引的方向..."
                    className="w-full bg-transparent border-b border-purple-900 focus:border-purple-500 outline-none p-4 text-white text-center text-xl min-h-[100px] transition-all resize-none"
                  />
                </div>
                <button 
                  disabled={question.length < 5}
                  onClick={handleStartShuffling}
                  className="w-full py-5 rounded-full bg-gradient-to-r from-purple-800 to-indigo-900 text-white font-mystical tracking-widest hover:scale-105 transition-all disabled:opacity-30 disabled:hover:scale-100"
                >
                  開始共鳴 <Sparkles className="inline ml-2" size={18} />
                </button>
              </div>
            )}

            {/* Step 2: Shuffling & Selection */}
            {(gameState === GameState.SHUFFLING || gameState === GameState.SELECTING) && (
              <div className="space-y-12 animate-fade-in">
                <div className="text-center space-y-2">
                  <p className="text-purple-300 font-mystical text-xl animate-pulse">
                    {gameState === GameState.SHUFFLING ? '星辰正在重新排列...' : `請依序挑選 3 個數字`}
                  </p>
                </div>

                {/* Number Grid - 改為選數字邏輯 */}
                <div className="grid grid-cols-6 sm:grid-cols-10 gap-2 p-2 max-h-[400px] overflow-y-auto scrollbar-hide">
                  {shuffledIndices.map((idx) => {
                    const isSelected = selectedIds.includes(idx);
                    const selectionOrder = selectedIds.indexOf(idx) + 1;
                    return (
                      <div 
                        key={idx}
                        onClick={() => toggleCardSelection(idx)}
                        className={`aspect-square flex items-center justify-center rounded-lg border cursor-pointer transition-all duration-300 font-mystical text-lg ${
                          isSelected 
                            ? 'bg-purple-600 border-purple-400 text-white scale-110 shadow-lg shadow-purple-500/50' 
                            : 'bg-black/40 border-white/5 text-slate-600 hover:border-purple-800 hover:text-purple-300'
                        }`}
                      >
                        {isSelected ? selectionOrder : idx + 1}
                      </div>
                    );
                  })}
                </div>

                {selectedIds.length === 3 && (
                  <button 
                    onClick={handleConfirmFlip}
                    className="mx-auto block px-16 py-4 bg-white text-black rounded-full font-mystical tracking-widest hover:bg-purple-100 transition-colors shadow-xl"
                  >
                    揭曉命運 <Eye size={18} className="inline ml-2" />
                  </button>
                )}
              </div>
            )}

            {/* Step 3: Result */}
            {(gameState === GameState.FLIPPING || gameState === GameState.RESULT) && (
              <div className="space-y-16 animate-fade-in">
                <div className="flex flex-wrap justify-center gap-8">
                  {selectedIds.map((id, index) => {
                    const card = THOTH_DECK[id];
                    return (
                      <div key={id} className="w-44 space-y-4 group animate-card-reveal" style={{ animationDelay: `${index * 0.4}s` }}>
                        <div className="relative aspect-[2/3.4] rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-transform duration-500 group-hover:scale-105">
                          <img src={card.imageUrl} className="w-full h-full object-cover" />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                          <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                            <span className="text-[10px] text-purple-400 font-mystical uppercase block mb-1">Position {index+1}</span>
                            <span className="text-xs font-bold text-white tracking-tighter">{card.name}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="max-w-2xl mx-auto p-8 rounded-3xl bg-black/40 border border-white/5 relative">
                  <div className="absolute -top-4 left-8 px-4 py-1 bg-purple-600 rounded-full text-[10px] font-mystical tracking-[0.2em]">ANALYSIS</div>
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center py-12 gap-4">
                      <RefreshCw className="animate-spin text-purple-500" size={32} />
                      <p className="text-slate-500 font-mystical animate-pulse">正在解讀阿卡西紀錄...</p>
                    </div>
                  ) : (
                    <div className="text-slate-300 leading-relaxed text-lg font-light tracking-wide whitespace-pre-wrap">
                      {typedText}
                    </div>
                  )}
                  {gameState === GameState.RESULT && !isLoading && typedText.length === interpretation.length && (
                    <button 
                      onClick={() => setGameState(GameState.WAIT)}
                      className="mt-8 mx-auto flex items-center gap-2 text-purple-400 hover:text-purple-300 font-mystical text-xs tracking-widest transition-colors"
                    >
                      重新啟程 <RefreshCw size={12} />
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. Footer - 活動詳情回顧 */}
      <footer className="py-24 px-6 border-t border-white/5 text-center">
        <div className="max-w-4xl mx-auto space-y-12">
          <div className="grid md:grid-cols-3 gap-8">
            <div className="space-y-2">
              <h5 className="font-mystical text-purple-500 uppercase tracking-widest text-xs">Exhibition</h5>
              <p className="text-white">托特之鏡：冥想展</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-mystical text-purple-500 uppercase tracking-widest text-xs">Dates</h5>
              <p className="text-white">2025.04.12 — 04.20</p>
            </div>
            <div className="space-y-2">
              <h5 className="font-mystical text-purple-500 uppercase tracking-widest text-xs">Location</h5>
              <p className="text-white">華山文創園區 中4A</p>
            </div>
          </div>
          <div className="pt-12 opacity-30 text-[10px] font-mystical tracking-widest uppercase">
            © 2025 Mirror of Thoth Exhibition. Guided by Gemini AI.
          </div>
        </div>
      </footer>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
          animation: fade-in-up 1.5s cubic-bezier(0.2, 0.8, 0.2, 1) forwards;
        }
        .animate-card-reveal {
          animation: fade-in-up 1s ease-out forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;

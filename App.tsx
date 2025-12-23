
import React, { useState, useEffect } from 'react';
import { GameState, SelectedCardInfo } from './types';
import { THOTH_DECK, BACKGROUND_IMAGE } from './constants';
import { getTarotInterpretation, generateCardVisual } from './geminiService';
import { 
  Sparkles, 
  RefreshCw, 
  MapPin, 
  Calendar, 
  ChevronDown,
  Eye,
  Zap
} from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WAIT);
  const [question, setQuestion] = useState('');
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [cardImages, setCardImages] = useState<Record<number, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [shuffledIndices, setShuffledIndices] = useState<number[]>([]);

  useEffect(() => {
    // Generate static matrix indices (1-78)
    setShuffledIndices(Array.from({ length: 78 }, (_, i) => i));
  }, []);

  const handleStartExperience = () => {
    document.getElementById('experience-section')?.scrollIntoView({ behavior: 'smooth' });
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

    try {
      // 1. Generate interpretations
      const cardsForInterpretation: SelectedCardInfo[] = selectedIds.map(id => ({
        card: THOTH_DECK[id],
        isReversed: false
      }));

      const textResult = await getTarotInterpretation(question, cardsForInterpretation);
      setInterpretation(textResult);

      // 2. Parallel generate card visuals (AI Drawing)
      const visualPromises = selectedIds.map(id => 
        generateCardVisual(THOTH_DECK[id].name, question)
      );
      const visuals = await Promise.all(visualPromises);
      
      const newImages: Record<number, string> = {};
      selectedIds.forEach((id, idx) => {
        newImages[id] = visuals[idx];
      });
      setCardImages(newImages);

      setGameState(GameState.RESULT);
    } catch (err) {
      setInterpretation("連結虛空時發生錯誤。請確認您的 API Key 是否正確設定。");
      setGameState(GameState.RESULT);
    } finally {
      setIsLoading(false);
    }
  };

  // Typing animation for interpretation
  useEffect(() => {
    if (gameState === GameState.RESULT && interpretation) {
      let i = 0;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText(prev => interpretation.slice(0, i + 1));
        i++;
        if (i >= interpretation.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [gameState, interpretation]);

  return (
    <div className="min-h-screen bg-black text-slate-100 selection:bg-purple-900/50 overflow-x-hidden">
      
      {/* Hero Section */}
      <section className="relative h-[100vh] flex flex-col items-center justify-center">
        <div className="absolute inset-0 bg-cover bg-center opacity-30" style={{ backgroundImage: `url(${BACKGROUND_IMAGE})` }} />
        <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black" />
        
        <div className="relative z-10 text-center px-6 animate-fade-in-up">
          <p className="font-mystical text-purple-400 tracking-[0.4em] mb-4 text-sm">THE MIRROR OF THOTH</p>
          <h1 className="font-mystical text-7xl md:text-9xl text-white mb-6 drop-shadow-[0_0_20px_rgba(168,85,247,0.3)]">托特之鏡</h1>
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center text-slate-400 mb-12">
            <span className="flex items-center gap-2"><Calendar size={18} /> 2025.04.12 — 04.20</span>
            <span className="flex items-center gap-2"><MapPin size={18} /> 台北華山文創園區</span>
          </div>
          <button onClick={handleStartExperience} className="px-10 py-4 rounded-full border border-purple-500/50 hover:bg-purple-500/10 transition-all font-mystical tracking-widest flex items-center gap-3 mx-auto">
            開始占卜 <ChevronDown size={18} />
          </button>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience-section" className="py-24 px-6 bg-mystic-gradient">
        <div className="max-w-6xl mx-auto bg-black/40 backdrop-blur-3xl border border-white/5 rounded-[4rem] p-12 shadow-2xl">
          
          {gameState === GameState.WAIT && (
            <div className="max-w-xl mx-auto text-center space-y-12 py-12">
              <h2 className="text-3xl font-mystical text-white">啟動冥想陣列</h2>
              <div className="relative">
                <textarea 
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="請在此輸入您想諮詢的問題..."
                  className="w-full bg-transparent border-b border-purple-800 focus:border-purple-500 outline-none p-6 text-white text-xl min-h-[120px] transition-all text-center resize-none"
                />
              </div>
              <button 
                disabled={question.length < 5}
                onClick={() => setGameState(GameState.SELECTING)}
                className="w-full py-5 rounded-full bg-purple-700 hover:bg-purple-600 text-white font-mystical tracking-widest transition-all disabled:opacity-20 shadow-lg"
              >
                進入選號區域 <Sparkles className="inline ml-2" size={18} />
              </button>
            </div>
          )}

          {(gameState === GameState.SELECTING) && (
            <div className="animate-fade-in space-y-10">
              <div className="text-center">
                <h3 className="text-2xl font-mystical text-purple-300">請挑選三個感應數字</h3>
                <p className="text-slate-500 text-sm mt-2">數字矩陣代表著與您的共鳴頻率</p>
              </div>

              <div className="grid grid-cols-6 sm:grid-cols-10 md:grid-cols-13 gap-2 max-h-[450px] overflow-y-auto pr-2 custom-scroll">
                {shuffledIndices.map((idx) => {
                  const isSelected = selectedIds.includes(idx);
                  const order = selectedIds.indexOf(idx) + 1;
                  return (
                    <button 
                      key={idx}
                      onClick={() => toggleCardSelection(idx)}
                      className={`aspect-square flex items-center justify-center rounded-lg border text-lg font-mystical transition-all duration-300 ${
                        isSelected 
                          ? 'bg-purple-600 border-purple-400 text-white scale-110 shadow-purple-500/50 shadow-xl' 
                          : 'bg-white/5 border-white/5 text-slate-500 hover:border-purple-500 hover:text-purple-300'
                      }`}
                    >
                      {isSelected ? order : idx + 1}
                    </button>
                  );
                })}
              </div>

              {selectedIds.length === 3 && (
                <button 
                  onClick={handleConfirmFlip}
                  className="mx-auto block px-16 py-4 bg-white text-black rounded-full font-mystical tracking-widest hover:scale-105 transition-all shadow-2xl"
                >
                  揭曉命運 <Eye size={18} className="inline ml-2" />
                </button>
              )}
            </div>
          )}

          {(gameState === GameState.FLIPPING || gameState === GameState.RESULT) && (
            <div className="animate-fade-in space-y-16">
              <div className="flex flex-wrap justify-center gap-8">
                {selectedIds.map((id, index) => (
                  <div key={id} className="w-52 flex flex-col items-center gap-4 group animate-card-reveal" style={{ animationDelay: `${index * 0.3}s` }}>
                    <div className="relative aspect-[3/4.5] w-full rounded-2xl overflow-hidden border border-white/10 shadow-2xl transition-all duration-700 group-hover:scale-105">
                      {cardImages[id] ? (
                        <img src={cardImages[id]} className="w-full h-full object-cover" alt={THOTH_DECK[id].name} />
                      ) : (
                        <div className="w-full h-full bg-slate-900 flex items-center justify-center">
                          <Zap className="animate-pulse text-purple-600" size={32} />
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />
                      <div className="absolute bottom-4 left-0 right-0 text-center px-2">
                        <span className="text-[10px] text-purple-400 font-mystical block opacity-60">
                          {index === 0 ? "PAST" : index === 1 ? "PRESENT" : "FUTURE"}
                        </span>
                        <span className="text-xs font-bold text-white tracking-tight">{THOTH_DECK[id].name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="max-w-3xl mx-auto p-10 bg-black/40 border border-white/5 rounded-3xl relative min-h-[300px]">
                <div className="absolute -top-4 left-10 px-4 py-1 bg-purple-700 rounded-full text-[10px] font-mystical tracking-widest">AI REVELATION</div>
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <RefreshCw className="animate-spin text-purple-500" size={32} />
                    <p className="text-slate-500 font-mystical animate-pulse">正在共鳴靈性空間...</p>
                  </div>
                ) : (
                  <div className="text-slate-300 leading-relaxed text-lg font-light whitespace-pre-wrap">
                    {typedText}
                  </div>
                )}
                
                {gameState === GameState.RESULT && !isLoading && typedText.length === interpretation.length && (
                  <button 
                    onClick={() => { setGameState(GameState.WAIT); setSelectedIds([]); setTypedText(''); }}
                    className="mt-10 mx-auto flex items-center gap-2 px-8 py-3 rounded-full border border-purple-500/20 text-purple-400 hover:bg-purple-500/10 transition-all font-mystical text-xs"
                  >
                    再次占卜 <RefreshCw size={12} />
                  </button>
                )}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-20 text-center border-t border-white/5 opacity-30 text-[10px] font-mystical tracking-[0.5em]">
        © 2025 MIRROR OF THOTH • POWERED BY GEMINI NANO BANANA
      </footer>

      <style>{`
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up { animation: fade-in-up 1s ease-out forwards; }
        .animate-card-reveal { animation: fade-in-up 1.2s cubic-bezier(0.2, 0.8, 0.2, 1) forwards; }
        .custom-scroll::-webkit-scrollbar { width: 4px; }
        .custom-scroll::-webkit-scrollbar-track { background: transparent; }
        .custom-scroll::-webkit-scrollbar-thumb { background: #4c1d95; border-radius: 10px; }
      `}</style>
    </div>
  );
};

export default App;


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameState, TarotCard, SelectedCardInfo } from './types';
import { THOTH_DECK, BACKGROUND_IMAGE, CARD_BACK_URL } from './constants';
import { getTarotInterpretation } from './geminiService';
import { Sparkles, RefreshCw, ChevronRight, Eye, Send } from 'lucide-react';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.WAIT);
  const [question, setQuestion] = useState('');
  const [deck, setDeck] = useState<TarotCard[]>([]);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);
  const [interpretation, setInterpretation] = useState('');
  const [shufflingCards, setShufflingCards] = useState<number[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [typedText, setTypedText] = useState('');
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);

  // Initialize deck
  useEffect(() => {
    setDeck(THOTH_DECK);
  }, []);

  // Shuffle logic
  const handleStartShuffling = () => {
    if (question.length < 5) return;
    setGameState(GameState.SHUFFLING);
    
    // Create random visual flickering indices
    const timer = setInterval(() => {
      const randoms = Array.from({ length: 5 }, () => Math.floor(Math.random() * 78));
      setShufflingCards(randoms);
    }, 100);

    setTimeout(() => {
      clearInterval(timer);
      const shuffled = [...THOTH_DECK].sort(() => Math.random() - 0.5);
      setShuffledDeck(shuffled);
      setGameState(GameState.SELECTING);
      setShufflingCards([]);
    }, 2500);
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
      card: THOTH_DECK.find(c => c.id === id)!,
      isReversed: Math.random() > 0.8 // 20% chance of reversal for flavor
    }));

    const result = await getTarotInterpretation(question, cardsForInterpretation);
    setInterpretation(result);
    setGameState(GameState.RESULT);
    setIsLoading(false);
  };

  // Typing effect
  useEffect(() => {
    if (gameState === GameState.RESULT && interpretation) {
      let i = 0;
      setTypedText('');
      const interval = setInterval(() => {
        setTypedText(prev => prev + interpretation.charAt(i));
        i++;
        if (i >= interpretation.length) clearInterval(interval);
      }, 30);
      return () => clearInterval(interval);
    }
  }, [gameState, interpretation]);

  const resetGame = () => {
    setGameState(GameState.WAIT);
    setQuestion('');
    setSelectedIds([]);
    setInterpretation('');
    setTypedText('');
  };

  return (
    <div 
      className="min-h-screen relative flex flex-col items-center justify-center p-4 overflow-hidden bg-black"
      style={{
        backgroundImage: `linear-gradient(rgba(0,0,0,0.6), rgba(0,0,0,0.6)), url(${BACKGROUND_IMAGE})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none opacity-30">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-900 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-900 rounded-full blur-[100px]" />
      </div>

      <main className="relative z-10 w-full max-w-4xl flex flex-col items-center gap-8">
        
        {/* Title Section */}
        <header className="text-center animate-fade-in">
          <h1 className="text-5xl md:text-7xl font-mystical text-white tracking-widest mb-2 drop-shadow-2xl">
            Thoth Tarot
          </h1>
          <p className="text-gray-300 font-mystical text-lg tracking-wide opacity-80">
            DRAW YOUR FATE
          </p>
          <div className="h-px w-32 bg-gradient-to-r from-transparent via-purple-500 to-transparent mx-auto mt-4" />
        </header>

        {/* Dynamic Content Based on GameState */}
        <div className="w-full flex flex-col items-center gap-6">
          
          {/* Section A: Question Input */}
          {gameState === GameState.WAIT && (
            <div className="w-full max-w-lg bg-black/40 backdrop-blur-md p-8 rounded-3xl border border-white/10 shadow-2xl animate-float">
              <label className="block text-gray-400 text-sm mb-4 text-center tracking-widest font-mystical uppercase">
                請輸入您想占卜的問題...
              </label>
              <textarea 
                className="w-full bg-transparent border-b border-purple-500/30 focus:border-purple-400 outline-none p-4 text-white text-lg min-h-[120px] transition-all resize-none text-center"
                placeholder="例如：我最近的感情發展如何？"
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
              />
              <button 
                disabled={question.length < 5}
                onClick={handleStartShuffling}
                className={`mt-8 w-full py-4 rounded-full flex items-center justify-center gap-2 font-mystical tracking-widest transition-all ${
                  question.length >= 5 
                    ? 'bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-white shadow-lg' 
                    : 'bg-gray-800 text-gray-500 cursor-not-allowed opacity-50'
                }`}
              >
                開始抽牌 <Sparkles size={18} />
              </button>
            </div>
          )}

          {/* Section B: Game Board (Shuffling & Selecting) */}
          {(gameState === GameState.SHUFFLING || gameState === GameState.SELECTING) && (
            <div className="w-full flex flex-col items-center gap-8 animate-fade-in">
              <div className="text-center">
                <p className="text-purple-300 font-mystical text-xl tracking-widest animate-pulse">
                  {gameState === GameState.SHUFFLING ? 'AI 正在為您感應牌陣...' : `請從下方選擇 ${3 - selectedIds.length} 張牌`}
                </p>
              </div>

              {/* Grid of Cards */}
              <div className="grid grid-cols-6 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-2 p-4 bg-white/5 rounded-2xl border border-white/5 overflow-y-auto max-h-[50vh] scrollbar-hide">
                {shuffledDeck.map((card, index) => {
                  const isShuffling = shufflingCards.includes(index);
                  const isSelected = selectedIds.includes(card.id);
                  const selectionIndex = selectedIds.indexOf(card.id) + 1;

                  return (
                    <div 
                      key={card.id}
                      onClick={() => toggleCardSelection(card.id)}
                      className={`relative aspect-[2/3] w-full rounded-md cursor-pointer transition-all duration-300 group ${
                        isSelected ? 'scale-110 -translate-y-2 ring-2 ring-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)]' : 'hover:-translate-y-1'
                      } ${isShuffling ? 'brightness-150 translate-x-1 translate-y-1' : ''}`}
                    >
                      <img 
                        src={CARD_BACK_URL} 
                        className={`w-full h-full object-cover rounded-md opacity-80 ${isSelected ? 'opacity-100' : 'group-hover:opacity-100'}`}
                        alt="Card Back"
                      />
                      {isSelected && (
                        <div className="absolute inset-0 flex items-center justify-center bg-purple-900/40 rounded-md">
                          <span className="text-white font-mystical text-2xl font-bold">{selectionIndex}</span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {selectedIds.length === 3 && gameState === GameState.SELECTING && (
                <button 
                  onClick={handleConfirmFlip}
                  className="px-12 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-mystical tracking-[0.2em] hover:scale-105 transition-transform shadow-xl flex items-center gap-2"
                >
                  確認揭牌 <Eye size={18} />
                </button>
              )}
            </div>
          )}

          {/* Section D: Result & Analysis */}
          {(gameState === GameState.FLIPPING || gameState === GameState.RESULT) && (
            <div className="w-full max-w-5xl flex flex-col items-center gap-12 animate-fade-in">
              {/* Display Chosen Cards */}
              <div className="flex flex-wrap justify-center gap-8 w-full">
                {selectedIds.map((id, index) => {
                  const card = THOTH_DECK.find(c => c.id === id)!;
                  return (
                    <div key={id} className="flex flex-col items-center gap-4 group animate-card-reveal" style={{ animationDelay: `${index * 0.5}s` }}>
                      <p className="text-purple-300 font-mystical tracking-widest text-sm opacity-60">
                        {index === 0 ? "過去 / 現況" : index === 1 ? "挑戰 / 行動" : "建議 / 結果"}
                      </p>
                      <div className="relative w-48 h-80 rounded-xl overflow-hidden shadow-2xl transition-transform duration-700 [transform-style:preserve-3d] hover:[transform:rotateY(10deg)]">
                        <div className="absolute inset-0 w-full h-full">
                          <img 
                            src={card.imageUrl} 
                            className="w-full h-full object-cover grayscale-[0.2] hover:grayscale-0 transition-all duration-500" 
                            alt={card.name} 
                          />
                          <div className="absolute bottom-0 left-0 right-0 bg-black/60 backdrop-blur-sm p-3 text-center">
                            <h3 className="text-white font-bold text-sm mb-1">{card.name}</h3>
                            <p className="text-purple-200 text-xs italic">{card.keyword}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Analysis Textbox */}
              <div className="w-full bg-black/50 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl min-h-[300px] relative">
                <div className="flex items-center gap-3 mb-6 text-purple-400 font-mystical uppercase tracking-widest text-sm border-b border-purple-500/20 pb-4">
                  <Send size={16} /> AI 命運解析
                </div>
                
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center h-48 gap-4">
                    <RefreshCw className="animate-spin text-purple-500" size={32} />
                    <p className="text-gray-400 font-mystical animate-pulse">正在共鳴靈性空間...</p>
                  </div>
                ) : (
                  <div className="text-gray-200 leading-relaxed text-lg whitespace-pre-wrap font-light">
                    {typedText}
                  </div>
                )}

                {gameState === GameState.RESULT && !isLoading && typedText.length === interpretation.length && (
                  <button 
                    onClick={resetGame}
                    className="mt-8 mx-auto flex items-center gap-2 px-8 py-3 rounded-full border border-purple-500/40 text-purple-400 hover:bg-purple-500/10 transition-all font-mystical text-sm tracking-widest"
                  >
                    再測一次 <RefreshCw size={14} />
                  </button>
                )}
              </div>
            </div>
          )}

        </div>

        {/* Footer */}
        <footer className="mt-12 opacity-40 text-xs tracking-widest font-mystical text-gray-500">
          © {new Date().getFullYear()} THOTH MYSTIC ARCANA • AI GUIDED FATE
        </footer>
      </main>

      {/* Animation Styles */}
      <style>{`
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 1.2s ease-out forwards;
        }
        @keyframes card-reveal {
          from { opacity: 0; transform: rotateY(90deg) scale(0.8); }
          to { opacity: 1; transform: rotateY(0deg) scale(1); }
        }
        .animate-card-reveal {
          animation: card-reveal 1s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
};

export default App;

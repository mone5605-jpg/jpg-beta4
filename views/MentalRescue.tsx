
import React, { useState, useEffect } from 'react';
import { generateComfortMessage } from '../services/geminiService';
import { X, Heart, Wind, PenTool, Send, MessageCircle, ChevronLeft } from 'lucide-react';

interface MentalRescueProps {
  isOpen: boolean;
  onClose: () => void;
}

type RescueMode = 'menu' | 'breathing' | 'journal' | 'message';

export const MentalRescue: React.FC<MentalRescueProps> = ({ isOpen, onClose }) => {
  const [mode, setMode] = useState<RescueMode>('menu');
  const [messageRecipient, setMessageRecipient] = useState('');
  const [messageContext, setMessageContext] = useState('');
  const [generatedMessage, setGeneratedMessage] = useState('');
  const [loading, setLoading] = useState(false);

  // Reset when closed
  useEffect(() => {
    if (!isOpen) setMode('menu');
  }, [isOpen]);

  if (!isOpen) return null;

  // --- Sub-components for modes ---

  const MenuMode = () => (
    <div className="flex flex-col gap-4 w-full">
      <h3 className="text-lg text-slate-600 font-medium mb-2 text-center">지금 필요한 도움을 선택하세요</h3>
      
      <button 
        onClick={() => setMode('breathing')}
        className="flex items-center gap-4 p-4 bg-sky-50 rounded-2xl border border-sky-100 hover:bg-sky-100 transition-all text-left"
      >
        <div className="p-3 bg-white rounded-full text-sky-500 shadow-sm">
           <Wind className="w-6 h-6" />
        </div>
        <div>
           <p className="font-bold text-sky-800">지금 잠깐 1분 호흡할래?</p>
           <p className="text-xs text-sky-600">불안한 마음을 진정시켜요</p>
        </div>
      </button>

      <button 
        onClick={() => setMode('journal')}
        className="flex items-center gap-4 p-4 bg-violet-50 rounded-2xl border border-violet-100 hover:bg-violet-100 transition-all text-left"
      >
        <div className="p-3 bg-white rounded-full text-violet-500 shadow-sm">
           <PenTool className="w-6 h-6" />
        </div>
        <div>
           <p className="font-bold text-violet-800">감정 기록할래?</p>
           <p className="text-xs text-violet-600">복잡한 머릿속을 비워봐요</p>
        </div>
      </button>

      <button 
        onClick={() => setMode('message')}
        className="flex items-center gap-4 p-4 bg-rose-50 rounded-2xl border border-rose-100 hover:bg-rose-100 transition-all text-left"
      >
        <div className="p-3 bg-white rounded-full text-rose-500 shadow-sm">
           <MessageCircle className="w-6 h-6" />
        </div>
        <div>
           <p className="font-bold text-rose-800">대신 메시지 써줄까?</p>
           <p className="text-xs text-rose-600">누구에게 보내면 좋을까요?</p>
        </div>
      </button>
    </div>
  );

  const BreathingMode = () => {
     const [scale, setScale] = useState(1);
     const [text, setText] = useState('들이마쉬세요...');
     
     useEffect(() => {
        const interval = setInterval(() => {
            setScale(prev => prev === 1 ? 1.5 : 1);
            setText(prev => prev === '들이마쉬세요...' ? '내쉬세요...' : '들이마쉬세요...');
        }, 4000);
        return () => clearInterval(interval);
     }, []);

     return (
         <div className="flex flex-col items-center justify-center py-8">
             <div 
                className="w-32 h-32 bg-sky-300 rounded-full flex items-center justify-center transition-all duration-[4000ms] ease-in-out opacity-80"
                style={{ transform: `scale(${scale})` }}
             >
                 <span className="text-white font-bold">{text}</span>
             </div>
             <p className="mt-8 text-slate-500 text-sm">이 원에 맞춰서 천천히 숨을 쉬어보세요.</p>
         </div>
     )
  };

  const MessageMode = () => {
    const handleGenerate = async () => {
        if(!messageRecipient || !messageContext) return;
        setLoading(true);
        const result = await generateComfortMessage(messageRecipient, messageContext);
        setGeneratedMessage(result || "Error");
        setLoading(false);
    }

    return (
        <div className="space-y-4">
             {!generatedMessage ? (
                 <>
                    <div>
                        <label className="text-xs font-bold text-slate-500">누구에게 보낼까요?</label>
                        <input 
                            value={messageRecipient}
                            onChange={(e) => setMessageRecipient(e.target.value)}
                            placeholder="예: 엄마, 김대리님, 친구..."
                            className="w-full p-3 rounded-xl border border-slate-200 mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-xs font-bold text-slate-500">어떤 상황인가요?</label>
                        <textarea 
                            value={messageContext}
                            onChange={(e) => setMessageContext(e.target.value)}
                            placeholder="예: 너무 우울해서 오늘 약속 못 나가겠어..."
                            className="w-full p-3 rounded-xl border border-slate-200 mt-1 h-24 resize-none"
                        />
                    </div>
                    <button 
                        onClick={handleGenerate}
                        disabled={loading || !messageRecipient}
                        className="w-full bg-rose-500 text-white py-3 rounded-xl font-bold hover:bg-rose-600 disabled:opacity-50"
                    >
                        {loading ? '문장 만드는 중...' : '부드러운 문장 만들기'}
                    </button>
                 </>
             ) : (
                 <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                     <p className="text-slate-800 whitespace-pre-wrap">{generatedMessage}</p>
                     <div className="flex gap-2 mt-4">
                        <button onClick={() => navigator.clipboard.writeText(generatedMessage)} className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">복사하기</button>
                        <button onClick={() => setGeneratedMessage('')} className="flex-1 bg-white border border-slate-200 py-2 rounded-lg text-sm text-slate-600 hover:bg-slate-50">다시 만들기</button>
                     </div>
                 </div>
             )}
        </div>
    )
  }

  const JournalMode = () => {
      const [entry, setEntry] = useState('');
      const [saved, setSaved] = useState(false);

      if (saved) {
          return (
              <div className="text-center py-8">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Heart className="w-8 h-8 text-green-500 fill-green-500" />
                  </div>
                  <h4 className="font-bold text-slate-800">기록이 완료되었습니다.</h4>
                  <p className="text-slate-500 mt-2">감정을 털어놓는 것만으로도 큰 용기입니다.</p>
              </div>
          )
      }

      return (
          <div className="space-y-4">
              <p className="text-slate-600 text-sm">지금 느끼는 감정을 솔직하게 적어보세요. 아무도 보지 않아요.</p>
              <textarea 
                  value={entry}
                  onChange={(e) => setEntry(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 h-40 resize-none focus:ring-2 focus:ring-violet-200 focus:outline-none"
                  placeholder="오늘 나는..."
              />
              <button 
                onClick={() => setSaved(true)}
                className="w-full bg-violet-500 text-white py-3 rounded-xl font-bold hover:bg-violet-600"
              >
                  감정 묻어두기
              </button>
          </div>
      )
  }

  return (
    <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white w-full max-w-md rounded-3xl p-6 shadow-2xl relative animate-in slide-in-from-bottom-10 duration-300 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
            {mode !== 'menu' ? (
                <button onClick={() => setMode('menu')} className="p-2 hover:bg-slate-100 rounded-full">
                    <ChevronLeft className="w-6 h-6 text-slate-500" />
                </button>
            ) : <div className="w-10"></div>}
            
            <div className="flex flex-col items-center">
                <div className="flex items-center gap-2">
                    <Heart className="w-5 h-5 text-rose-500 fill-rose-500" />
                    <span className="font-bold text-lg text-slate-800">AI 응급 구조대</span>
                </div>
            </div>
            
            <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-full text-slate-400">
               <X className="w-6 h-6" />
            </button>
        </div>

        {/* Content */}
        {mode === 'menu' && <MenuMode />}
        {mode === 'breathing' && <BreathingMode />}
        {mode === 'journal' && <JournalMode />}
        {mode === 'message' && <MessageMode />}
        
      </div>
    </div>
  );
};

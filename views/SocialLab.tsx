import React, { useState, useRef, useEffect } from 'react';
import { getSocialSimulationResponse } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, User, Bot, Sparkles } from 'lucide-react';

interface SocialLabProps {
    addXp: (amount: number) => void;
}

const SCENARIOS = [
  "카페에서 커피 주문하기",
  "교수님께 이메일로 과제 기한 연장 요청하기",
  "친구의 파티 초대 거절하기",
  "엘리베이터에서 이웃과 스몰토크하기"
];

export const SocialLab: React.FC<SocialLabProps> = ({ addXp }) => {
  const [scenario, setScenario] = useState<string | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const startScenario = (s: string) => {
    setScenario(s);
    setMessages([{
      id: 'init',
      sender: 'ai',
      text: `상황: ${s}. 마음의 준비가 되면 먼저 말을 걸어주세요!`
    }]);
  };

  const handleSend = async () => {
    if (!input.trim() || !scenario) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      sender: 'user',
      text: input
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    const history = messages.map(m => ({ role: m.sender, content: m.text }));
    const result = await getSocialSimulationResponse(scenario, history, userMsg.text);

    const aiMsg: ChatMessage = {
      id: Date.now().toString() + '_ai',
      sender: 'ai',
      text: result.reply,
      feedback: result.feedback
    };

    setMessages(prev => [...prev, aiMsg]);
    setLoading(false);
    
    // XP reward for practice
    if (result.feedback && result.feedback.score > 70) {
        addXp(10);
    }
  };

  if (!scenario) {
    return (
      <div className="space-y-6">
        <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-3xl p-8 text-white">
          <h2 className="text-3xl font-bold mb-2">소셜 연습실</h2>
          <p className="opacity-90">안전하고 편안한 대화 연습 공간입니다.</p>
        </div>
        
        <h3 className="font-bold text-slate-700 text-lg">상황 선택하기</h3>
        <div className="grid md:grid-cols-2 gap-4">
          {SCENARIOS.map((s, i) => (
            <button
              key={i}
              onClick={() => startScenario(s)}
              className="p-6 bg-white rounded-2xl border border-slate-200 text-left hover:border-blue-500 hover:shadow-md transition-all group"
            >
              <span className="font-semibold text-slate-800 block mb-2 group-hover:text-blue-600">{s}</span>
              <span className="text-sm text-slate-400">클릭해서 롤플레잉 시작하기 &rarr;</span>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col h-[calc(100vh-140px)] md:h-[600px] overflow-hidden">
      {/* Header */}
      <div className="p-4 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h3 className="font-semibold text-slate-700 truncate max-w-[70%]">{scenario}</h3>
        <button onClick={() => setScenario(null)} className="text-xs text-red-500 hover:underline">시뮬레이션 종료</button>
      </div>

      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
            <div className={`flex gap-2 max-w-[85%] ${msg.sender === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${msg.sender === 'user' ? 'bg-blue-100' : 'bg-green-100'}`}>
                {msg.sender === 'user' ? <User className="w-4 h-4 text-blue-600" /> : <Bot className="w-4 h-4 text-green-600" />}
              </div>
              <div className={`p-3 rounded-2xl text-sm ${
                msg.sender === 'user' ? 'bg-blue-600 text-white rounded-tr-none' : 'bg-slate-100 text-slate-800 rounded-tl-none'
              }`}>
                {msg.text}
              </div>
            </div>

            {/* AI Feedback Box */}
            {msg.feedback && (
              <div className="mt-2 ml-10 p-3 bg-yellow-50 border border-yellow-200 rounded-xl max-w-[80%] text-xs">
                 <div className="flex items-center gap-2 font-bold text-yellow-700 mb-1">
                    <Sparkles className="w-3 h-3" /> 코치 피드백 (점수: {msg.feedback.score}/100)
                 </div>
                 <p className="text-slate-700">{msg.feedback.advice}</p>
              </div>
            )}
          </div>
        ))}
        {loading && (
           <div className="flex items-center gap-2 text-slate-400 text-xs ml-10">
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-100"></span>
              <span className="w-2 h-2 bg-slate-300 rounded-full animate-bounce delay-200"></span>
           </div>
        )}
        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-slate-100 bg-white">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="답변을 입력하세요..."
            className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
          <button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            className="bg-blue-600 text-white p-3 rounded-xl hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};
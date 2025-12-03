
import React, { useState } from 'react';
import { getOutdoorMissions } from '../services/geminiService';
import { Map, Footprints, CheckCircle2, RefreshCw, Compass } from 'lucide-react';

interface ExplorationQuestProps {
  level: number;
  addXp: (amount: number) => void;
}

export const ExplorationQuest: React.FC<ExplorationQuestProps> = ({ level, addXp }) => {
  const [missions, setMissions] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeMission, setActiveMission] = useState<string | null>(null);

  const handleGetMissions = async () => {
    setLoading(true);
    const result = await getOutdoorMissions(level);
    setMissions(result);
    setLoading(false);
    setActiveMission(null);
  };

  const handleComplete = () => {
    if (!activeMission) return;
    addXp(50); // High reward for outdoor tasks
    alert(`대단해요! 용기내어 밖으로 나갔군요. 🌟 (+50 XP)`);
    setMissions([]);
    setActiveMission(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-cyan-500 to-blue-500 rounded-3xl p-8 text-white relative overflow-hidden">
         <div className="absolute right-0 top-0 opacity-10 p-4">
             <Map className="w-48 h-48" />
         </div>
         <h2 className="text-3xl font-bold mb-2">AI 탐색 퀘스트</h2>
         <p className="opacity-90 max-w-md">
            세상은 넓지만, 우리는 아주 작은 한 걸음부터 시작해요. <br/>
            현재 탐험 레벨: <span className="font-bold text-yellow-300">Lv.{level}</span>
         </p>
      </div>

      {!activeMission && missions.length === 0 && (
          <div className="bg-white rounded-3xl p-8 border border-slate-100 text-center shadow-sm">
             <div className="w-20 h-20 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Compass className="w-10 h-10 text-cyan-600" />
             </div>
             <h3 className="text-xl font-bold text-slate-700 mb-2">오늘의 모험을 떠날까요?</h3>
             <p className="text-slate-500 mb-8">당신의 상태에 맞는 아주 작은 미션을 준비했어요.</p>
             
             <button 
               onClick={handleGetMissions}
               disabled={loading}
               className="bg-cyan-600 text-white px-8 py-4 rounded-xl font-bold hover:bg-cyan-700 transition-all flex items-center gap-2 mx-auto disabled:opacity-50"
             >
                {loading ? <RefreshCw className="animate-spin w-5 h-5"/> : <Footprints className="w-5 h-5"/>}
                {loading ? '퀘스트 생성 중...' : '미션 받기'}
             </button>
          </div>
      )}

      {!activeMission && missions.length > 0 && (
          <div className="grid md:grid-cols-3 gap-4">
              {missions.map((mission, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setActiveMission(mission)}
                    className="bg-white p-6 rounded-2xl border-2 border-slate-100 hover:border-cyan-400 hover:shadow-md transition-all text-left flex flex-col h-full justify-between group"
                  >
                      <div>
                          <span className="text-xs font-bold text-cyan-600 bg-cyan-50 px-2 py-1 rounded mb-3 inline-block">Option {idx + 1}</span>
                          <p className="text-lg font-bold text-slate-700 group-hover:text-cyan-700">{mission}</p>
                      </div>
                      <div className="mt-4 text-sm text-slate-400 group-hover:text-cyan-500 font-medium">
                          이 미션 선택하기 &rarr;
                      </div>
                  </button>
              ))}
          </div>
      )}

      {activeMission && (
          <div className="bg-white rounded-3xl p-8 border-2 border-cyan-100 shadow-lg text-center animate-in zoom-in-95 duration-300">
              <span className="text-cyan-600 font-bold tracking-wider text-sm uppercase mb-2 block">Current Mission</span>
              <h3 className="text-2xl md:text-3xl font-bold text-slate-800 mb-8 leading-relaxed">
                  "{activeMission}"
              </h3>
              
              <div className="flex flex-col items-center gap-4">
                  <button 
                    onClick={handleComplete}
                    className="w-full max-w-sm bg-gradient-to-r from-cyan-500 to-blue-600 text-white py-4 rounded-xl font-bold shadow-lg hover:shadow-xl hover:scale-105 transition-all flex items-center justify-center gap-2"
                  >
                      <CheckCircle2 className="w-6 h-6" /> 미션 완료!
                  </button>
                  <button 
                    onClick={() => setActiveMission(null)}
                    className="text-slate-400 text-sm hover:text-slate-600 underline"
                  >
                      다른 미션 고를래요
                  </button>
              </div>
          </div>
      )}
    </div>
  );
};

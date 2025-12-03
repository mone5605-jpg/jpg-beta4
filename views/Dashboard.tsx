
import React, { useState } from 'react';
import { Mood, Task } from '../types';
import { getRoutineRecommendation, getPraiseForTask } from '../services/geminiService';
import { CheckCircle2, Circle, Loader2, Sparkles, RefreshCcw } from 'lucide-react';

interface DashboardProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  addXp: (amount: number) => void;
  triggerRescue: () => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ tasks, setTasks, addXp, triggerRescue }) => {
  const [mood, setMood] = useState<Mood | null>(null);
  const [energy, setEnergy] = useState<number>(5);
  const [loading, setLoading] = useState(false);
  const [generated, setGenerated] = useState(false);
  const [lastPraise, setLastPraise] = useState<string | null>(null);

  const moodEmojis: Record<Mood, string> = {
    [Mood.GREAT]: '🤩',
    [Mood.OKAY]: '🙂',
    [Mood.TIRED]: '😴',
    [Mood.ANXIOUS]: '😰',
    [Mood.DOWN]: '😞',
  };

  const moodLabels: Record<Mood, string> = {
    [Mood.GREAT]: '최고',
    [Mood.OKAY]: '보통',
    [Mood.TIRED]: '피곤',
    [Mood.ANXIOUS]: '불안',
    [Mood.DOWN]: '우울',
  };

  const handleMoodSelect = (m: Mood) => {
    setMood(m);
    if (m === Mood.DOWN || m === Mood.ANXIOUS) {
      setTimeout(() => {
        if(window.confirm("마음이 조금 힘들어 보이네요. AI 응급 구조대를 불러올까요?")) {
            triggerRescue();
        }
      }, 500);
    }
  }

  const handleGenerateRoutine = async () => {
    if (!mood) return;
    setLoading(true);
    const routine = await getRoutineRecommendation(mood, energy);
    const newTasks: Task[] = routine.map((text: string, idx: number) => ({
      id: Date.now().toString() + idx,
      text,
      completed: false,
      xp: 20
    }));
    setTasks(newTasks);
    setLoading(false);
    setGenerated(true);
  };

  const handleCompleteTask = async (id: string) => {
    const task = tasks.find(t => t.id === id);
    if (!task || task.completed) return;

    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: true } : t));
    addXp(task.xp);
    
    // Get AI praise
    const praise = await getPraiseForTask(task.text);
    setLastPraise(praise);
    setTimeout(() => setLastPraise(null), 4000);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header Section */}
      <section className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-8 text-white shadow-lg relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <Sparkles className="w-32 h-32" />
        </div>
        <h2 className="text-3xl font-bold mb-2">안녕, 친구! 👋</h2>
        <p className="opacity-90">지금 기분이 어때요?</p>
      </section>

      {/* Mood Checker - Only show if not generated yet */}
      {!generated ? (
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <h3 className="font-semibold text-slate-700 mb-4">상태 체크하기</h3>
          
          <div className="grid grid-cols-5 gap-2 md:gap-4 mb-6">
            {(Object.keys(moodEmojis) as Mood[]).map((m) => (
              <button
                key={m}
                onClick={() => handleMoodSelect(m)}
                className={`flex flex-col items-center justify-center p-3 rounded-2xl transition-all ${
                  mood === m ? 'bg-teal-100 border-2 border-teal-500 scale-105' : 'bg-slate-50 hover:bg-slate-100'
                }`}
              >
                <span className="text-2xl md:text-3xl mb-1">{moodEmojis[m]}</span>
                <span className="text-xs font-medium text-slate-600">{moodLabels[m]}</span>
              </button>
            ))}
          </div>

          <div className="mb-6">
            <label className="text-sm font-medium text-slate-600 mb-2 block">
              에너지 레벨: {energy}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={energy}
              onChange={(e) => setEnergy(Number(e.target.value))}
              className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-teal-500"
            />
          </div>

          <button
            onClick={handleGenerateRoutine}
            disabled={!mood || loading}
            className="w-full bg-teal-600 text-white py-4 rounded-xl font-bold hover:bg-teal-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all"
          >
            {loading ? <Loader2 className="animate-spin" /> : <Sparkles className="w-5 h-5" />}
            {loading ? '루틴 만드는 중...' : '오늘의 작은 할 일 추천받기'}
          </button>
        </section>
      ) : (
        <div className="flex justify-end">
            <button 
                onClick={() => setGenerated(false)} 
                className="text-sm text-slate-500 flex items-center gap-1 hover:text-teal-600"
            >
                <RefreshCcw className="w-3 h-3"/> 다시 체크하기
            </button>
        </div>
      )}

      {/* Task List */}
      {tasks.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
            나의 마이크로 미션
            <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded-full">{tasks.filter(t => t.completed).length}/{tasks.length}</span>
          </h3>
          
          <div className="grid gap-3">
            {tasks.map((task) => (
              <div
                key={task.id}
                onClick={() => handleCompleteTask(task.id)}
                className={`group flex items-center p-4 bg-white rounded-2xl border transition-all cursor-pointer ${
                  task.completed 
                    ? 'border-teal-200 bg-teal-50/50 opacity-75' 
                    : 'border-slate-100 shadow-sm hover:shadow-md hover:-translate-y-1'
                }`}
              >
                <div className={`mr-4 transition-colors ${task.completed ? 'text-teal-500' : 'text-slate-300 group-hover:text-teal-400'}`}>
                  {task.completed ? <CheckCircle2 className="w-8 h-8" /> : <Circle className="w-8 h-8" />}
                </div>
                <div>
                  <p className={`font-medium text-lg ${task.completed ? 'text-slate-500 line-through' : 'text-slate-800'}`}>
                    {task.text}
                  </p>
                  <p className="text-xs text-slate-400 font-semibold">+{task.xp} XP</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Praise Toast */}
      {lastPraise && (
        <div className="fixed bottom-24 left-1/2 -translate-x-1/2 bg-slate-800 text-white px-6 py-3 rounded-full shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 z-50">
           <Sparkles className="w-4 h-4 text-yellow-400" />
           {lastPraise}
        </div>
      )}
    </div>
  );
};

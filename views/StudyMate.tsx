import React, { useState, useEffect, useRef } from 'react';
import { breakDownStudyGoal } from '../services/geminiService';
import { Play, Pause, RotateCcw, BrainCircuit, ArrowRight, Check } from 'lucide-react';

interface StudyMateProps {
    addXp: (amount: number) => void;
}

export const StudyMate: React.FC<StudyMateProps> = ({ addXp }) => {
  const [goal, setGoal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [studyPlan, setStudyPlan] = useState<{message: string, steps: string[]} | null>(null);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = window.setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      if (timerRef.current) clearInterval(timerRef.current);
      // Timer finished reward
      addXp(50);
      alert("세션 종료! 훌륭한 집중력이네요.");
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, timeLeft, addXp]);

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(25 * 60);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCreatePlan = async () => {
    if (!goal.trim()) return;
    setIsProcessing(true);
    const result = await breakDownStudyGoal(goal);
    setStudyPlan(result);
    setIsProcessing(false);
    setCompletedSteps([]);
  };

  const toggleStep = (index: number) => {
      if(completedSteps.includes(index)) {
          setCompletedSteps(prev => prev.filter(i => i !== index));
      } else {
          setCompletedSteps(prev => [...prev, index]);
          addXp(15);
      }
  }

  return (
    <div className="grid md:grid-cols-2 gap-6 h-full">
      {/* Left Col: Timer & Status */}
      <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col items-center justify-center text-center space-y-8">
        <div>
           <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
             <BrainCircuit className="w-8 h-8 text-indigo-600" />
           </div>
           <h2 className="text-2xl font-bold text-slate-800">집중 모드</h2>
           <p className="text-slate-500">25분 동안 오직 공부에만 집중</p>
        </div>

        <div className="text-7xl font-mono font-bold text-slate-800 tracking-tighter">
          {formatTime(timeLeft)}
        </div>

        <div className="flex gap-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3 rounded-full font-bold flex items-center gap-2 transition-all ${
              isActive 
                ? 'bg-amber-100 text-amber-700 hover:bg-amber-200' 
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isActive ? <><Pause className="w-5 h-5" /> 일시정지</> : <><Play className="w-5 h-5" /> 시작</>}
          </button>
          <button
            onClick={resetTimer}
            className="px-4 py-3 rounded-full bg-slate-100 text-slate-600 hover:bg-slate-200"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Right Col: Goal Planning */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col">
        {!studyPlan ? (
          <div className="flex-1 flex flex-col justify-center">
            <label className="block text-sm font-bold text-slate-700 mb-2">
              어떤 공부를 할까요?
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={goal}
                onChange={(e) => setGoal(e.target.value)}
                placeholder="예: 리액트 훅 배우기..."
                className="flex-1 px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                onKeyDown={(e) => e.key === 'Enter' && handleCreatePlan()}
              />
              <button
                onClick={handleCreatePlan}
                disabled={isProcessing || !goal}
                className="bg-indigo-600 text-white p-3 rounded-xl hover:bg-indigo-700 disabled:opacity-50"
              >
                {isProcessing ? <BrainCircuit className="w-5 h-5 animate-spin"/> : <ArrowRight className="w-5 h-5" />}
              </button>
            </div>
            <p className="text-xs text-slate-400 mt-3">
              아주 작고 쉬운 단계로 쪼개드릴게요.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex justify-between items-start">
                 <div>
                    <h3 className="font-bold text-lg text-slate-800">학습 계획</h3>
                    <p className="text-sm text-slate-500">{studyPlan.message}</p>
                 </div>
                 <button onClick={() => setStudyPlan(null)} className="text-xs text-indigo-600 hover:underline">새로운 목표</button>
            </div>
           
            <div className="space-y-3">
              {studyPlan.steps.map((step, idx) => (
                <div 
                    key={idx} 
                    onClick={() => toggleStep(idx)}
                    className={`p-4 rounded-xl border flex items-center gap-3 cursor-pointer transition-all ${
                        completedSteps.includes(idx) 
                        ? 'bg-green-50 border-green-200 opacity-60' 
                        : 'bg-white border-slate-100 hover:border-indigo-200'
                    }`}
                >
                  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      completedSteps.includes(idx) ? 'bg-green-500 border-green-500 text-white' : 'border-slate-300 text-transparent'
                  }`}>
                      <Check className="w-4 h-4" />
                  </div>
                  <span className={completedSteps.includes(idx) ? 'line-through text-slate-400' : 'text-slate-700'}>{step}</span>
                </div>
              ))}
            </div>

            {completedSteps.length === studyPlan.steps.length && (
                <div className="p-4 bg-indigo-50 text-indigo-700 rounded-xl text-center font-bold">
                    미션 완료! +{studyPlan.steps.length * 15} XP
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
import React from 'react';
import { UserStats } from '../types';
import { Trophy, Flame, Target } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface GrowthGardenProps {
  stats: UserStats;
}

// Simulated data for the chart
const data = [
  { name: '월', xp: 40 },
  { name: '화', xp: 30 },
  { name: '수', xp: 20 },
  { name: '목', xp: 60 },
  { name: '금', xp: 50 },
  { name: '토', xp: 80 },
  { name: '일', xp: 90 },
];

export const GrowthGarden: React.FC<GrowthGardenProps> = ({ stats }) => {
  const progressPercent = Math.min((stats.currentXp / stats.nextLevelXp) * 100, 100);

  // Simple SVG Tree generator based on level
  const TreeVisualization = ({ level }: { level: number }) => {
    const scale = Math.min(1 + level * 0.1, 2.5); // Tree grows with level
    return (
      <svg width="200" height="200" viewBox="0 0 200 200" className="mx-auto drop-shadow-lg">
         {/* Pot */}
         <path d="M70 160 L130 160 L140 190 L60 190 Z" fill="#A0522D" />
         
         <g transform={`translate(100, 160) scale(${scale}) translate(-100, -160)`} style={{ transition: 'transform 1s ease-out' }}>
            {/* Stem */}
            <rect x="95" y="100" width="10" height="60" fill="#8B4513" rx="2" />
            
            {/* Leaves - visible based on complexity/level */}
            <circle cx="100" cy="90" r="30" fill="#22C55E" opacity="0.9" />
            <circle cx="80" cy="110" r="20" fill="#4ADE80" opacity="0.8" />
            <circle cx="120" cy="110" r="20" fill="#16A34A" opacity="0.8" />
            
            {level > 2 && <circle cx="100" cy="60" r="25" fill="#86EFAC" opacity="0.9" />}
            {level > 5 && <circle cx="130" cy="80" r="15" fill="#4ADE80" opacity="0.9" />}
            {level > 5 && <circle cx="70" cy="80" r="15" fill="#22C55E" opacity="0.9" />}
         </g>
      </svg>
    );
  };

  return (
    <div className="space-y-6">
       <div className="bg-gradient-to-r from-emerald-500 to-teal-600 rounded-3xl p-8 text-white relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
             <div className="flex-1 text-center md:text-left">
                <h2 className="text-3xl font-bold mb-2">나의 성장 정원</h2>
                <p className="opacity-90 mb-4">레벨 {stats.level} 정원사</p>
                
                <div className="bg-white/20 h-4 rounded-full w-full max-w-md overflow-hidden backdrop-blur-sm">
                   <div 
                     className="bg-yellow-400 h-full transition-all duration-1000 ease-out" 
                     style={{ width: `${progressPercent}%` }}
                   ></div>
                </div>
                <p className="text-xs mt-2 font-mono opacity-80">다음 레벨까지 {stats.currentXp} / {stats.nextLevelXp} XP</p>
             </div>
             
             <div className="flex-shrink-0">
                <TreeVisualization level={stats.level} />
             </div>
          </div>
       </div>

       {/* Stats Grid */}
       <div className="grid grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
             <div className="p-3 bg-orange-100 text-orange-600 rounded-full mb-2">
                 <Flame className="w-6 h-6" />
             </div>
             <span className="text-2xl font-bold text-slate-800">{stats.streak}</span>
             <span className="text-xs text-slate-500 uppercase tracking-wider">연속 달성</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
             <div className="p-3 bg-blue-100 text-blue-600 rounded-full mb-2">
                 <Target className="w-6 h-6" />
             </div>
             <span className="text-2xl font-bold text-slate-800">{stats.totalTasks}</span>
             <span className="text-xs text-slate-500 uppercase tracking-wider">완료한 미션</span>
          </div>
          <div className="bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center">
             <div className="p-3 bg-purple-100 text-purple-600 rounded-full mb-2">
                 <Trophy className="w-6 h-6" />
             </div>
             <span className="text-2xl font-bold text-slate-800">상위 5%</span>
             <span className="text-xs text-slate-500 uppercase tracking-wider">꾸준함</span>
          </div>
       </div>

       {/* Activity Chart */}
       <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
          <h3 className="font-bold text-slate-700 mb-6">활동 로그</h3>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data}>
                <defs>
                  <linearGradient id="colorXp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0F766E" stopOpacity={0.2}/>
                    <stop offset="95%" stopColor="#0F766E" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94A3B8', fontSize: 12}} />
                <Tooltip 
                    contentStyle={{borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                />
                <Area type="monotone" dataKey="xp" stroke="#0F766E" strokeWidth={3} fillOpacity={1} fill="url(#colorXp)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
       </div>
    </div>
  );
};
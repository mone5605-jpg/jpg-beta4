
import React, { useState } from 'react';
import { Home, BookOpen, MessageCircle, Sprout, Menu, X, HeartPulse, Map } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  currentView: AppView;
  onChangeView: (view: AppView) => void;
  children: React.ReactNode;
  triggerRescue: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ currentView, onChangeView, children, triggerRescue }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { id: AppView.DASHBOARD, label: '오늘의 루틴', icon: Home },
    { id: AppView.STUDY, label: '스터디 메이트', icon: BookOpen },
    { id: AppView.SOCIAL, label: '소셜 연습실', icon: MessageCircle },
    { id: AppView.QUEST, label: 'AI 탐색 퀘스트', icon: Map },
    { id: AppView.GROWTH, label: '성장 정원', icon: Sprout },
  ];

  const NavContent = () => (
    <>
      <div className="p-6">
        <h1 className="text-2xl font-bold text-teal-600 flex items-center gap-2">
          <Sprout className="w-8 h-8 fill-teal-100" /> StepUp
        </h1>
        <p className="text-slate-500 text-sm mt-1">작은 발걸음, 큰 성장.</p>
      </div>
      <nav className="flex-1 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => {
              onChangeView(item.id);
              setIsMobileMenuOpen(false);
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
              currentView === item.id
                ? 'bg-teal-100 text-teal-800 font-semibold shadow-sm'
                : 'text-slate-600 hover:bg-slate-50'
            }`}
          >
            <item.icon className={`w-5 h-5 ${currentView === item.id ? 'text-teal-600' : 'text-slate-400'}`} />
            {item.label}
          </button>
        ))}
      </nav>
      
      <div className="p-4">
         <button 
           onClick={triggerRescue}
           className="w-full flex items-center justify-center gap-2 bg-rose-100 text-rose-700 py-3 rounded-xl hover:bg-rose-200 transition-colors font-semibold shadow-sm"
         >
           <HeartPulse className="w-5 h-5" />
           멘탈 구조대
         </button>
      </div>
    </>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-[#F0F9FF]">
      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r border-slate-100 shadow-sm h-full z-10">
        <NavContent />
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 w-full bg-white z-20 border-b border-slate-100 px-4 py-3 flex justify-between items-center shadow-sm">
        <h1 className="text-lg font-bold text-teal-600 flex items-center gap-2">StepUp</h1>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-slate-600 p-2">
          {isMobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-black/20 z-10" onClick={() => setIsMobileMenuOpen(false)}>
          <div 
            className="absolute top-[60px] left-0 w-64 bg-white h-[calc(100%-60px)] shadow-xl flex flex-col animate-in slide-in-from-left duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <NavContent />
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto w-full pt-20 md:pt-0 pb-20 md:pb-0 scroll-smooth">
        <div className="max-w-4xl mx-auto p-4 md:p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

import { BookOpen, FileText, CheckCircle, Sparkles, HelpCircle, ArrowRight } from 'lucide-react';
import { Agent } from '../types';

interface WelcomeDashboardProps {
  activeAgent: Agent;
  onSelectSuggestion: (question: string) => void;
}

export default function WelcomeDashboard({ activeAgent, onSelectSuggestion }: WelcomeDashboardProps) {
  
  const getAgentColorGlow = (id: string) => {
    switch (id) {
      case 'Tutor':
        return 'from-blue-500/5 to-indigo-500/5 dark:from-[#1A1A1A] dark:to-[#1A1A1A] border-blue-500/20 dark:border-white/5 hover:border-blue-500/40 dark:hover:border-indigo-500/50';
      case 'Exam':
        return 'from-orange-500/5 to-amber-500/5 dark:from-[#1A1A1A] dark:to-[#1A1A1A] border-orange-500/20 dark:border-white/5 hover:border-orange-500/40 dark:hover:border-orange-500/50';
      case 'Solver':
        return 'from-green-500/5 to-emerald-500/5 dark:from-[#1A1A1A] dark:to-[#1A1A1A] border-green-500/20 dark:border-white/5 hover:border-green-500/40 dark:hover:border-emerald-500/50';
      default:
        return 'from-indigo-500/5 to-purple-500/5 dark:from-[#1A1A1A] dark:to-[#1A1A1A] border-indigo-500/20 dark:border-white/5 hover:border-indigo-500/40 dark:hover:border-slate-400/50';
    }
  };

  const getAgentIcon = (id: string) => {
    switch (id) {
      case 'Tutor':
        return <BookOpen className="h-6 w-6 text-blue-500" />;
      case 'Exam':
        return <FileText className="h-6 w-6 text-orange-500" />;
      case 'Solver':
        return <CheckCircle className="h-6 w-6 text-green-500" />;
      default:
        return <Sparkles className="h-6 w-6 text-indigo-500" />;
    }
  };

  const getAgentThemeText = (id: string) => {
    switch (id) {
      case 'Tutor':
        return 'text-blue-600 dark:text-blue-400';
      case 'Exam':
        return 'text-orange-600 dark:text-orange-400';
      case 'Solver':
        return 'text-green-600 dark:text-green-400';
      default:
        return 'text-indigo-600 dark:text-indigo-400';
    }
  };

  // Custom visual templates for each agent to enrich the welcome state
  const getAgentIntroFeature = (id: string) => {
    switch (id) {
      case 'Tutor':
        return (
          <div className="flex flex-col gap-1 text-center bg-blue-500/5 dark:bg-blue-500/10 p-4 rounded-xl border border-blue-500/10 max-w-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-500">Conceptual Teaching</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Uses interactive metaphors and real-world parallels.</span>
          </div>
        );
      case 'Exam':
        return (
          <div className="flex flex-col gap-1 text-center bg-orange-500/5 dark:bg-orange-500/10 p-4 rounded-xl border border-orange-500/10 max-w-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-orange-500">Retrieval Practice</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Asks questions, processes responses, and grades results.</span>
          </div>
        );
      case 'Solver':
        return (
          <div className="flex flex-col gap-1 text-center bg-green-500/5 dark:bg-green-500/10 p-4 rounded-xl border border-green-500/10 max-w-sm">
            <span className="text-xs font-bold uppercase tracking-wider text-green-500">Calculative Rigor</span>
            <span className="text-xs text-zinc-500 dark:text-zinc-400">Provides step-by-step proofs, formulas, and math tags.</span>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="flex-1 flex flex-col justify-center items-center px-6 py-12 md:py-20 max-w-4xl mx-auto w-full select-none"
      id="welcome-dashboard-container"
    >
      {/* Decorative Top Accent */}
      <div className="relative mb-8 flex justify-center items-center">
        <div className="absolute inset-0 bg-indigo-500/10 dark:bg-indigo-500/20 blur-3xl rounded-full h-24 w-24 -z-10 animate-pulse" />
        <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 shadow-xl border border-zinc-200/80 dark:border-zinc-800/80 text-zinc-900 dark:text-white flex items-center justify-center">
          <div className="p-3 rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-indigo-600 text-white shadow-lg shadow-indigo-500/30">
            <Sparkles className="h-8 w-8" id="sparkles-decor" />
          </div>
        </div>
      </div>

      {/* Main Headers */}
      <div className="text-center space-y-4 max-w-2xl mb-8">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/20 text-indigo-700 dark:text-indigo-300 text-xs font-bold tracking-wide">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
          </span>
          Agents for Good Initiative
        </div>

        <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight text-zinc-900 dark:text-white leading-tight">
          Agents for Good <br />
          <span className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 bg-clip-text text-transparent">
            Smart Education Platform
          </span>
        </h1>
        
        <p className="text-sm md:text-base text-zinc-500 dark:text-zinc-400 max-w-lg mx-auto leading-relaxed">
          Unlock personalized tutoring, dynamic testing, and logical problem solving. Choose an agent in the sidebar to specialize your learning session.
        </p>
      </div>

      {/* Specialty badge */}
      <div className="mb-10 flex flex-col items-center gap-3">
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white dark:bg-[#1A1A1A] border border-zinc-200/80 dark:border-white/5 shadow-xs">
          {getAgentIcon(activeAgent.id)}
          <span className="font-semibold text-sm text-zinc-800 dark:text-zinc-200">
            Active Agent: <span className={getAgentThemeText(activeAgent.id)}>{activeAgent.name}</span>
          </span>
        </div>
        {getAgentIntroFeature(activeAgent.id)}
      </div>

      {/* 2x2 Suggested Questions Grid */}
      <div className="w-full space-y-4">
        <div className="flex items-center gap-2 justify-center mb-1">
          <HelpCircle className="h-4.5 w-4.5 text-zinc-400 dark:text-zinc-500" />
          <h2 className="text-xs font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
            Suggested Queries for {activeAgent.id}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4" id="suggested-questions-grid">
          {activeAgent.suggestedQuestions.map((question, idx) => (
            <button
              key={idx}
              onClick={() => onSelectSuggestion(question)}
              id={`suggestion-card-${idx}`}
              className={`text-left p-5 rounded-2xl border bg-gradient-to-b ${getAgentColorGlow(activeAgent.id)} transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-xs hover:shadow-md hover:-translate-y-0.5`}
            >
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 uppercase tracking-wider">
                  Option {idx + 1}
                </span>
                <p className="text-sm font-semibold text-zinc-800 dark:text-zinc-100 group-hover:text-zinc-950 dark:group-hover:text-white transition-colors duration-150">
                  "{question}"
                </p>
              </div>
              
              <div className="mt-4 flex items-center justify-end gap-1.5 text-xs font-medium text-zinc-400 dark:text-zinc-500 group-hover:text-zinc-700 dark:group-hover:text-zinc-300 transition-colors duration-150">
                <span>Try this now</span>
                <ArrowRight className="h-3.5 w-3.5 transform group-hover:translate-x-1 transition-transform duration-150" />
              </div>
            </button>
          ))}
          
          {/* Static informational card to round out the 2x2 layout */}
          <div className="p-5 rounded-2xl border border-zinc-200/50 dark:border-zinc-900 bg-zinc-100/30 dark:bg-zinc-900/10 flex flex-col justify-between">
            <div className="space-y-1">
              <span className="text-[10px] font-bold text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">
                Multi-Agent Framework
              </span>
              <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400">
                You can switch agents at any time. The conversation is saved so you can query other agents about the same topic.
              </p>
            </div>
            <span className="text-[10px] text-zinc-400 dark:text-zinc-500 font-mono mt-4">
              COLLABORATIVE INTERFACE PHASE 2
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  GraduationCap, 
  Moon, 
  Sun, 
  Trash2, 
  X, 
  Heart,
  History,
  Plus,
  MessageSquare
} from 'lucide-react';
import { Agent, ChatSession } from '../types';
import { AGENTS } from '../constants';

interface SidebarProps {
  selectedAgentId: 'Tutor' | 'Exam' | 'Solver';
  onSelectAgent: (id: 'Tutor' | 'Exam' | 'Solver') => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  sessions: ChatSession[];
  currentSessionId: string;
  onCreateNewChat: () => void;
  onSelectSession: (id: string) => void;
  onDeleteSession: (id: string) => void;
  onClearHistory: () => void;
  hasMessages: boolean;
}

export default function Sidebar({
  selectedAgentId,
  onSelectAgent,
  isMobileOpen,
  onCloseMobile,
  isDarkMode,
  onToggleDarkMode,
  sessions,
  currentSessionId,
  onCreateNewChat,
  onSelectSession,
  onDeleteSession,
  onClearHistory,
  hasMessages,
}: SidebarProps) {

  // Helper to render the proper Lucide icon based on name
  const renderIcon = (iconName: string, className: string) => {
    switch (iconName) {
      case 'BookOpen':
        return <BookOpen className={className} id={`icon-${iconName}`} />;
      case 'FileText':
        return <FileText className={className} id={`icon-${iconName}`} />;
      case 'CheckCircle':
        return <CheckCircle className={className} id={`icon-${iconName}`} />;
      default:
        return <GraduationCap className={className} id={`icon-default`} />;
    }
  };

  // Theme-specific styles for active state borders/bg
  const getAgentColorClasses = (agentId: string, isActive: boolean) => {
    if (!isActive) return 'border-zinc-200/80 dark:border-white/5 hover:border-zinc-350 dark:hover:bg-white/5 bg-white/50 dark:bg-transparent transition-all duration-200';
    
    switch (agentId) {
      case 'Tutor':
        return 'border-blue-500 bg-blue-50/70 dark:bg-blue-500/10 dark:border-blue-500/20 text-blue-900 dark:text-white shadow-sm shadow-blue-500/10';
      case 'Exam':
        return 'border-orange-500 bg-orange-50/70 dark:bg-orange-500/10 dark:border-orange-500/20 text-orange-900 dark:text-white shadow-sm shadow-orange-500/10';
      case 'Solver':
        return 'border-green-500 bg-green-50/70 dark:bg-emerald-500/10 dark:border-emerald-500/20 text-green-900 dark:text-white shadow-sm shadow-green-500/10';
      default:
        return 'border-indigo-500 bg-indigo-50/70 dark:bg-indigo-500/10 dark:border-indigo-500/20 text-indigo-900 dark:text-white';
    }
  };

  const getAgentBadgeColor = (agentId: string) => {
    switch (agentId) {
      case 'Tutor':
        return 'bg-blue-500/10 text-blue-600 dark:text-blue-400';
      case 'Exam':
        return 'bg-orange-500/10 text-orange-600 dark:text-orange-400';
      case 'Solver':
        return 'bg-green-500/10 text-green-600 dark:text-green-400';
      default:
        return 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400';
    }
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-zinc-50 dark:bg-[#121212] text-zinc-800 dark:text-slate-200 transition-colors duration-200 border-r border-zinc-200/80 dark:border-white/5">
      {/* Brand Header */}
      <div className="p-6 border-b border-zinc-200/80 dark:border-white/5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-600 text-white shadow-md shadow-indigo-500/20">
              <GraduationCap className="h-6 w-6" id="brand-logo-icon" />
            </div>
            <div>
              <h1 className="text-lg font-bold tracking-tight text-zinc-900 dark:text-white leading-tight">
                Agents for Good
              </h1>
              <p className="text-xs text-zinc-500 dark:text-zinc-500 font-medium">
                Smart Education Hub
              </p>
            </div>
          </div>
          {/* Mobile close button inside the sidebar drawer */}
          <button
            onClick={onCloseMobile}
            className="md:hidden p-1.5 rounded-lg hover:bg-zinc-200 dark:hover:bg-white/5 text-zinc-500 dark:text-zinc-400"
            aria-label="Close sidebar"
            id="mobile-close-sidebar-btn"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        
        {/* Project Tag */}
        <div className="mt-4 px-3 py-1.5 rounded-lg bg-zinc-100 dark:bg-white/5 flex items-center gap-2">
          <Heart className="h-3.5 w-3.5 text-rose-500 fill-rose-500 animate-pulse" />
          <span className="text-xs font-semibold text-zinc-600 dark:text-zinc-400">
            Education Initiative
          </span>
        </div>
      </div>

      {/* Agents Selection List */}
      <div className="flex-1 overflow-y-auto px-4 py-6 space-y-6">
        {/* Create New Chat Button / Box */}
        <div className="px-1">
          <button
            onClick={onCreateNewChat}
            id="new-chat-btn"
            className="w-full flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl border border-dashed border-indigo-500/30 dark:border-white/10 bg-indigo-50/20 dark:bg-white/5 hover:bg-indigo-50 dark:hover:bg-white/10 text-indigo-600 dark:text-indigo-400 font-semibold text-xs transition-all duration-200 cursor-pointer shadow-xs group hover:border-indigo-500"
          >
            <Plus className="h-4 w-4 transition-transform group-hover:rotate-90 duration-200" />
            <span>Create New Chat</span>
          </button>
        </div>

        <div>
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-4">
            Active Agents
          </h2>
          
          <div className="space-y-3" id="agent-list-container">
            {AGENTS.map((agent) => {
              const isActive = selectedAgentId === agent.id;
              return (
                <button
                  key={agent.id}
                  onClick={() => {
                    onSelectAgent(agent.id);
                    onCloseMobile();
                  }}
                  id={`agent-btn-${agent.id}`}
                  className={`w-full text-left p-4 rounded-xl border flex gap-3.5 transition-all duration-200 cursor-pointer ${getAgentColorClasses(agent.id, isActive)}`}
                >
                  <div className={`p-2.5 rounded-lg shrink-0 flex items-center justify-center ${
                    isActive 
                      ? agent.id === 'Tutor' ? 'bg-blue-500/10 text-blue-500 dark:bg-indigo-600/20 dark:text-indigo-400'
                        : agent.id === 'Exam' ? 'bg-orange-500/10 text-orange-500 dark:bg-orange-600/20 dark:text-orange-400'
                        : 'bg-green-500/10 text-green-500 dark:bg-emerald-600/20 dark:text-emerald-400'
                      : 'bg-zinc-200/60 dark:bg-white/5 text-zinc-500 dark:text-zinc-400'
                  }`}>
                    {renderIcon(agent.iconName, "h-5 w-5")}
                  </div>
                  
                  <div className="space-y-1 overflow-hidden">
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-semibold text-sm text-zinc-900 dark:text-white truncate">
                        {agent.name}
                      </span>
                    </div>
                    <p className={`text-[11px] font-medium leading-tight ${
                      isActive
                        ? agent.id === 'Tutor' ? 'text-blue-600 dark:text-indigo-400'
                          : agent.id === 'Exam' ? 'text-orange-600 dark:text-orange-400'
                          : 'text-green-600 dark:text-emerald-400'
                        : 'text-zinc-500 dark:text-zinc-500'
                    }`}>
                      {agent.id === 'Tutor' ? 'Conceptual Learning' : agent.id === 'Exam' ? 'Practice & Quizzes' : 'Step-by-step Help'}
                    </p>
                    <p className="text-[11px] text-zinc-400 dark:text-zinc-500 line-clamp-2 leading-relaxed mt-1">
                      {agent.description}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat History Section */}
        <div>
          <h2 className="px-2 text-xs font-semibold uppercase tracking-widest text-zinc-400 dark:text-zinc-500 mb-3 flex items-center gap-1.5">
            <History className="h-3.5 w-3.5" />
            <span>Chat History</span>
          </h2>
          
          <div className="space-y-1 max-h-56 overflow-y-auto pr-1" id="chat-history-container">
            {sessions.map((session) => {
              const isSessionActive = session.id === currentSessionId;
              return (
                <div
                  key={session.id}
                  className={`group relative flex items-center justify-between rounded-lg p-2.5 transition-all duration-150 border text-xs cursor-pointer ${
                    isSessionActive
                      ? 'bg-zinc-100 dark:bg-white/5 border-zinc-200/80 dark:border-white/5 text-zinc-900 dark:text-white font-medium'
                      : 'border-transparent text-zinc-500 dark:text-zinc-400 hover:bg-zinc-100/50 dark:hover:bg-white/5 hover:text-zinc-900 dark:hover:text-zinc-200'
                  }`}
                  onClick={() => {
                    onSelectSession(session.id);
                    onCloseMobile();
                  }}
                  id={`history-item-${session.id}`}
                >
                  <div className="flex items-center gap-2 min-w-0 pr-6">
                    <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isSessionActive ? 'text-indigo-500' : 'text-zinc-450'}`} />
                    <span className="truncate text-[11px]">{session.title}</span>
                  </div>
                  
                  {/* Delete Button (visible on hover) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteSession(session.id);
                    }}
                    className="absolute right-2 opacity-0 group-hover:opacity-100 p-1 rounded-md hover:bg-zinc-200 dark:hover:bg-zinc-800 text-zinc-400 hover:text-red-500 transition-all duration-150 cursor-pointer flex items-center justify-center"
                    title="Delete Chat"
                    id={`delete-history-btn-${session.id}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
              );
            })}
            {sessions.length === 0 && (
              <p className="text-[10px] text-zinc-400 dark:text-zinc-500 text-center py-4">
                No saved chats
              </p>
            )}
          </div>
        </div>

        {/* Quick Instructions info panel */}
        <div className="p-4 rounded-xl border border-zinc-200/50 dark:border-white/5 bg-zinc-100/50 dark:bg-[#1A1A1A]">
          <h3 className="text-xs font-semibold text-zinc-700 dark:text-zinc-300 flex items-center gap-1.5">
            <span>Collaborative Spec</span>
          </h3>
          <p className="text-[11px] text-zinc-500 dark:text-zinc-500 mt-1.5 leading-relaxed">
            The active agent's responses are prefixed with <code className="bg-zinc-200 dark:bg-zinc-900/40 px-1 py-0.5 rounded text-[10px] text-zinc-700 dark:text-zinc-400 font-mono">[AGENT: Name]</code> for smooth parsing by Person 1's backend orchestration.
          </p>
        </div>
      </div>

      {/* Sidebar Footer with Theme Toggle and Reset */}
      <div className="p-4 border-t border-zinc-200/80 dark:border-white/5 bg-white dark:bg-[#121212] transition-colors duration-200">
        <div className="flex items-center justify-between gap-2">
          {/* Theme Toggle */}
          <button
            onClick={onToggleDarkMode}
            id="theme-toggle-btn"
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 font-medium text-xs transition-all duration-150 cursor-pointer text-zinc-700 dark:text-zinc-400"
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <>
                <Sun className="h-4 w-4 text-amber-500" />
                <span>Light Theme</span>
              </>
            ) : (
              <>
                <Moon className="h-4 w-4 text-indigo-500" />
                <span>Dark Theme</span>
              </>
            )}
          </button>

          {/* Clear Chat Button */}
          {hasMessages && (
            <button
              onClick={onClearHistory}
              id="clear-chat-btn"
              className="px-3 py-2.5 rounded-lg border border-red-200 dark:border-red-950/20 bg-red-50/50 dark:bg-red-950/10 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-950/20 font-medium text-xs transition-all duration-150 cursor-pointer flex items-center gap-1.5"
              title="Reset conversation"
            >
              <Trash2 className="h-4 w-4" />
              <span className="hidden lg:inline">Clear Chat</span>
            </button>
          )}
        </div>
        
        {/* Developer Info */}
        <div className="mt-3 text-center">
          <p className="text-[10px] text-zinc-400 dark:text-zinc-500">
            UI/UX Dashboard &bull; Phase 2 Completed
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Sidebar (Permanent) */}
      <aside className="hidden md:block w-80 lg:w-96 shrink-0 h-full select-none" id="desktop-sidebar">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer (Overlay and slide-in panel) */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex" id="mobile-sidebar-overlay">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/55 backdrop-blur-xs transition-opacity duration-200" 
            onClick={onCloseMobile} 
            id="mobile-sidebar-backdrop"
          />
          {/* Sidebar drawer body */}
          <div className="relative w-76 max-w-[85vw] h-full flex flex-col z-10 shadow-2xl animate-in slide-in-from-left duration-200">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}

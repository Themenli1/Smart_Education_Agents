import React, { useState, useRef, useEffect } from 'react';
import { 
  BookOpen, 
  FileText, 
  CheckCircle, 
  GraduationCap, 
  Send, 
  Sparkles, 
  Menu,
  ChevronDown
} from 'lucide-react';
import { Message, Agent } from '../types';
import { parseAgentMessage } from '../utils/parser';
import WelcomeDashboard from './WelcomeDashboard';

interface ChatAreaProps {
  activeAgent: Agent;
  messages: Message[];
  isThinking: boolean;
  onSendMessage: (text: string) => void;
  onOpenMobileSidebar: () => void;
  onSelectSuggestion: (question: string) => void;
}

export default function ChatArea({
  activeAgent,
  messages,
  isThinking,
  onSendMessage,
  onOpenMobileSidebar,
  onSelectSuggestion,
}: ChatAreaProps) {
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-scroll mechanism
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isThinking]);

  // Handle auto-resizing textarea
  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target;
    setInputValue(textarea.value);
    
    // Auto-resize logic
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 180)}px`;
  };

  // Handle Form Submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim() || isThinking) return;

    onSendMessage(inputValue);
    setInputValue('');
    
    // Reset height of textarea
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  // Handle Enter (Send) and Shift+Enter (New line)
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  // Extract agent details for Badge rendering
  const getAgentBadgeConfig = (agentName: string | null) => {
    const name = agentName || activeAgent.id;
    switch (name) {
      case 'Tutor':
        return {
          icon: <BookOpen className="h-3.5 w-3.5" />,
          label: 'Study Mentor',
          bg: 'bg-blue-500/10 dark:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/15',
          text: 'text-blue-600 dark:text-blue-400'
        };
      case 'Exam':
        return {
          icon: <FileText className="h-3.5 w-3.5" />,
          label: 'Exam Coach',
          bg: 'bg-orange-500/10 dark:bg-orange-500/20 text-orange-700 dark:text-orange-300 border-orange-500/15',
          text: 'text-orange-600 dark:text-orange-400'
        };
      case 'Solver':
        return {
          icon: <CheckCircle className="h-3.5 w-3.5" />,
          label: 'STEM Solver',
          bg: 'bg-green-500/10 dark:bg-green-500/20 text-green-700 dark:text-green-300 border-green-500/15',
          text: 'text-green-600 dark:text-green-400'
        };
      default:
        return {
          icon: <GraduationCap className="h-3.5 w-3.5" />,
          label: name,
          bg: 'bg-indigo-500/10 dark:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/15',
          text: 'text-indigo-600 dark:text-indigo-400'
        };
    }
  };

  // Custom rich text formatting helper to parse code blocks, inline code, dollar sign math expressions, bold, etc.
  const renderInlineFormatting = (text: string) => {
    const boldRegex = /\*\*(.*?)\*\*/g;
    const codeRegex = /`(.*?)`/g;
    const mathRegex = /\$(.*?)\$/g;
    
    const tokenRegex = /(\*\*.*?\*\*|`.*?`|\$.*?\$)/g;
    const matches = [...text.matchAll(tokenRegex)];
    
    if (matches.length === 0) {
      return text;
    }
    
    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    
    matches.forEach((match, idx) => {
      const matchText = match[0];
      const matchIndex = match.index ?? 0;
      
      if (matchIndex > lastIndex) {
        elements.push(text.substring(lastIndex, matchIndex));
      }
      
      if (matchText.startsWith('**') && matchText.endsWith('**')) {
        const boldVal = matchText.substring(2, matchText.length - 2);
        elements.push(<strong key={`bold-${idx}`} className="font-bold text-zinc-950 dark:text-white">{boldVal}</strong>);
      } else if (matchText.startsWith('`') && matchText.endsWith('`')) {
        const codeVal = matchText.substring(1, matchText.length - 1);
        elements.push(<code key={`code-${idx}`} className="px-1.5 py-0.5 rounded-md bg-zinc-200/80 dark:bg-zinc-800 font-mono text-xs text-indigo-600 dark:text-indigo-400">{codeVal}</code>);
      } else if (matchText.startsWith('$') && matchText.endsWith('$')) {
        const mathVal = matchText.substring(1, matchText.length - 1);
        elements.push(<code key={`math-${idx}`} className="px-1.5 py-0.5 rounded-md bg-emerald-500/10 dark:bg-emerald-500/20 font-mono text-xs text-emerald-700 dark:text-emerald-300 font-semibold italic">{mathVal}</code>);
      } else {
        elements.push(matchText);
      }
      
      lastIndex = matchIndex + matchText.length;
    });
    
    if (lastIndex < text.length) {
      elements.push(text.substring(lastIndex));
    }
    
    return <>{elements}</>;
  };

  const renderFormattedContent = (content: string) => {
    if (!content) return null;
    const lines = content.split('\n');
    
    return (
      <div className="space-y-1.5 break-words">
        {lines.map((line, lineIdx) => {
          const cleanLine = line.trim();
          
          if (cleanLine === '') {
            return <div key={lineIdx} className="h-2" />;
          }
          
          // Check for bullet points
          const bulletMatch = line.match(/^(\*\s+|-|\s*\*\s+)(.*)$/);
          if (bulletMatch) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 ml-2 my-1 text-zinc-850 dark:text-zinc-200">
                <span className="text-indigo-500 dark:text-indigo-400 shrink-0 select-none mt-1 text-[10px]">&bull;</span>
                <span className="text-sm leading-relaxed">{renderInlineFormatting(bulletMatch[2])}</span>
              </div>
            );
          }
          
          // Check for numbered lists
          const numberMatch = line.match(/^(\d+\.\s+)(.*)$/);
          if (numberMatch) {
            return (
              <div key={lineIdx} className="flex items-start gap-2 ml-2 my-1 text-zinc-850 dark:text-zinc-200">
                <span className="text-indigo-500 dark:text-indigo-400 font-bold shrink-0 select-none text-xs mt-0.5">{numberMatch[1]}</span>
                <span className="text-sm leading-relaxed">{renderInlineFormatting(numberMatch[2])}</span>
              </div>
            );
          }
          
          // Render plain paragraph
          return (
            <p key={lineIdx} className="text-sm leading-relaxed text-zinc-850 dark:text-zinc-200">
              {renderInlineFormatting(line)}
            </p>
          );
        })}
      </div>
    );
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-white dark:bg-[#141414] transition-colors duration-200 relative overflow-hidden" id="chat-area-viewport">
      {/* Top Header */}
      <header className="h-16 shrink-0 border-b border-zinc-200/80 dark:border-white/5 bg-white/80 dark:bg-[#141414]/80 backdrop-blur-md px-4 md:px-6 flex items-center justify-between z-10">
        <div className="flex items-center gap-3 min-w-0">
          {/* Hamburger toggle for mobile sidebar */}
          <button
            onClick={onOpenMobileSidebar}
            className="md:hidden p-2 rounded-lg border border-zinc-200 dark:border-white/5 hover:bg-zinc-100 dark:hover:bg-white/5 text-zinc-700 dark:text-zinc-300"
            id="mobile-menu-btn"
            aria-label="Open sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>
          
          {/* Active Agent Meta */}
          <div className="min-w-0 flex items-center gap-2.5">
            <div className={`p-2 rounded-lg shrink-0 ${
              activeAgent.id === 'Tutor' ? 'bg-blue-500/10 text-blue-600 dark:bg-indigo-600/20 dark:text-indigo-400' :
              activeAgent.id === 'Exam' ? 'bg-orange-500/10 text-orange-600 dark:bg-orange-600/20 dark:text-orange-400' :
              'bg-green-500/10 text-green-600 dark:bg-emerald-600/20 dark:text-emerald-400'
            }`}>
              {activeAgent.id === 'Tutor' && <BookOpen className="h-4.5 w-4.5" />}
              {activeAgent.id === 'Exam' && <FileText className="h-4.5 w-4.5" />}
              {activeAgent.id === 'Solver' && <CheckCircle className="h-4.5 w-4.5" />}
            </div>
            
            <div className="truncate">
              <div className="flex items-center gap-1.5">
                <h2 className="font-bold text-sm text-zinc-900 dark:text-white truncate">
                  {activeAgent.name}
                </h2>
                <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-[10px] font-medium text-zinc-400 dark:text-zinc-500 truncate">
                Active &bull; {activeAgent.tagline}
              </p>
            </div>
          </div>
        </div>

        {/* Sync Status Badge */}
        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg border border-zinc-200/80 dark:border-white/5 bg-zinc-50/50 dark:bg-[#1A1A1A] text-xs font-semibold text-zinc-500 dark:text-slate-400">
          <span className="font-mono text-[10px] bg-zinc-200 dark:bg-white/5 px-1.5 py-0.5 rounded text-zinc-700 dark:text-slate-300">
            Person 1 Sync Ready
          </span>
        </div>
      </header>

      {/* Main Messages Content Panel */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-8 space-y-6">
        {messages.length === 0 ? (
          <WelcomeDashboard 
            activeAgent={activeAgent} 
            onSelectSuggestion={onSelectSuggestion} 
          />
        ) : (
          <div className="space-y-6 max-w-4xl mx-auto w-full" id="messages-list-container">
            {messages.map((msg) => {
              const isUser = msg.role === 'user';
              // Check if msg agent badge is needed (for assistant responses)
              const badgeConfig = !isUser ? getAgentBadgeConfig(msg.agent) : null;
              
              return (
                <div 
                  key={msg.id}
                  id={`chat-msg-${msg.id}`}
                  className={`flex flex-col ${isUser ? 'items-end' : 'items-start'} space-y-1`}
                >
                  {/* Agent Badge (Requirement 4) */}
                  {badgeConfig && (
                    <div className="flex items-center gap-1.5 mb-1 px-1 select-none">
                      <div className={`p-1 rounded border ${badgeConfig.bg} flex items-center justify-center`}>
                        {badgeConfig.icon}
                      </div>
                      <span className="text-[11px] font-bold tracking-tight text-zinc-500 dark:text-zinc-400">
                        {badgeConfig.label}
                      </span>
                      <span className="text-[9px] text-zinc-400 dark:text-zinc-500 font-medium">
                        &bull; {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}

                  {/* Message Bubble Container */}
                  <div
                    className={`max-w-[85%] md:max-w-[75%] px-4.5 py-3 rounded-2xl text-sm transition-all duration-150 ${
                      isUser
                        ? 'bg-indigo-600 text-white rounded-br-none shadow-sm shadow-indigo-600/10 font-medium dark:bg-indigo-700'
                        : 'bg-zinc-100 dark:bg-[#1A1A1A] text-zinc-800 dark:text-slate-200 rounded-bl-none border border-zinc-200/50 dark:border-white/5'
                    }`}
                  >
                    {isUser ? (
                      <p className="whitespace-pre-wrap leading-relaxed">{msg.content}</p>
                    ) : (
                      renderFormattedContent(msg.content)
                    )}
                  </div>
                  
                  {/* User message timestamp */}
                  {isUser && (
                    <span className="text-[9px] text-zinc-400 dark:text-zinc-500 px-1">
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  )}
                </div>
              );
            })}

            {/* Thinking / Loader State */}
            {isThinking && (
              <div className="flex flex-col items-start space-y-1 animate-pulse" id="thinking-bubble">
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <div className={`p-1 rounded border bg-indigo-500/10 text-indigo-700 border-indigo-500/15 flex items-center justify-center`}>
                    <GraduationCap className="h-3.5 w-3.5 animate-spin" />
                  </div>
                  <span className="text-[11px] font-bold text-zinc-500 dark:text-zinc-400">
                    Agent Thinking...
                  </span>
                </div>

                <div className="px-5 py-3 rounded-2xl rounded-bl-none bg-zinc-100 dark:bg-[#1A1A1A] border border-zinc-200/50 dark:border-white/5">
                  <div className="flex items-center gap-1.5 py-1" aria-label="Thinking Indicator">
                    <span className="h-2 w-2 rounded-full bg-zinc-500 dark:bg-zinc-450 animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="h-2 w-2 rounded-full bg-zinc-500 dark:bg-zinc-450 animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="h-2 w-2 rounded-full bg-zinc-500 dark:bg-zinc-450 animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Dynamic Floating Action suggested question buttons shown if messages are minimal */}
      {messages.length > 0 && messages.length < 4 && !isThinking && (
        <div className="px-4 md:px-8 py-2 max-w-4xl mx-auto w-full select-none" id="floating-suggestions-rail">
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 dark:text-zinc-500 shrink-0">
              Related suggestions:
            </span>
            {activeAgent.suggestedQuestions.map((q, idx) => (
              <button
                key={idx}
                onClick={() => onSelectSuggestion(q)}
                className="shrink-0 text-xs px-3 py-1.5 rounded-full border border-zinc-200 dark:border-white/5 bg-zinc-50 hover:bg-zinc-100 dark:bg-[#1A1A1A] dark:hover:bg-white/5 text-zinc-600 dark:text-zinc-300 cursor-pointer hover:border-indigo-500 dark:hover:border-indigo-500 transition-all duration-150"
              >
                {q.length > 40 ? `${q.substring(0, 40)}...` : q}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Bottom Sticky Chat Input Panel */}
      <footer className="p-4 md:p-6 border-t border-zinc-200/80 dark:border-white/5 bg-white dark:bg-[#141414] transition-colors duration-200 shrink-0">
        <form onSubmit={handleSubmit} className="max-w-4xl mx-auto relative flex items-end gap-2 bg-zinc-50 dark:bg-[#1A1A1A] p-2 rounded-2xl border border-zinc-200/80 dark:border-white/5 focus-within:border-indigo-500 focus-within:ring-1 focus-within:ring-indigo-500 transition-all duration-150">
          <textarea
            ref={textareaRef}
            rows={1}
            value={inputValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder={`Ask ${activeAgent.name}...`}
            disabled={isThinking}
            className="flex-1 max-h-44 min-h-[36px] bg-transparent outline-none border-none py-2 px-3 text-sm resize-none text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 dark:placeholder-slate-600 leading-relaxed font-sans"
            id="chat-textarea-input"
          />
          
          <button
            type="submit"
            id="chat-send-btn"
            disabled={!inputValue.trim() || isThinking}
            className="p-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white disabled:bg-zinc-250 disabled:text-zinc-450 dark:disabled:bg-zinc-900 dark:disabled:text-zinc-700 flex items-center justify-center transition-all duration-150 shrink-0 cursor-pointer"
            aria-label="Send message"
          >
            <Send className="h-4.5 w-4.5" />
          </button>
        </form>
        
        <div className="max-w-4xl mx-auto mt-3 flex justify-center text-[10px] text-slate-650 dark:text-slate-600 uppercase tracking-widest text-center">
          <span>AI agents can make mistakes. Verify critical information &bull; Active Specialty: {activeAgent.id}</span>
        </div>
      </footer>
    </div>
  );
}

import { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import ChatArea from './components/ChatArea';
import { Message, Agent, ChatSession } from './types';
import { AGENTS } from './constants';
import { fetchAgentResponse } from './utils/api';

export default function App() {
  // Multiple Chat Sessions State (with backward-compatible parsing)
  const [sessions, setSessions] = useState<ChatSession[]>(() => {
    const saved = localStorage.getItem('edu_chat_sessions');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return parsed.map((s: any) => ({
          ...s,
          messages: s.messages.map((m: any) => ({
            ...m,
            timestamp: new Date(m.timestamp)
          }))
        }));
      } catch (e) {
        console.error("Failed to parse saved sessions:", e);
      }
    }
    
    // Migrate legacy single-session chat messages if present
    const legacySaved = localStorage.getItem('edu_chat_messages');
    let legacyMessages: Message[] = [];
    if (legacySaved) {
      try {
        const parsed = JSON.parse(legacySaved);
        legacyMessages = parsed.map((m: any) => ({
          ...m,
          timestamp: new Date(m.timestamp)
        }));
      } catch (e) {
        console.error("Failed to parse legacy messages:", e);
      }
    }

    const defaultSession: ChatSession = {
      id: 'session-default',
      title: legacyMessages.length > 0 
        ? legacyMessages[0].content.trim().slice(0, 30) + (legacyMessages[0].content.trim().length > 30 ? '...' : '') 
        : 'Conceptual Learning Chat',
      messages: legacyMessages,
      agentId: 'Tutor',
      createdAt: Date.now()
    };
    return [defaultSession];
  });

  // Active Session Identifier
  const [currentSessionId, setCurrentSessionId] = useState<string>(() => {
    const saved = localStorage.getItem('edu_chat_current_session_id');
    return saved || 'session-default';
  });

  // Thinking State (API Pending indicator)
  const [isThinking, setIsThinking] = useState(false);
  
  // Mobile drawer visible state
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);

  // Dark Mode Support
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const savedTheme = localStorage.getItem('edu_theme_dark');
    if (savedTheme !== null) {
      return savedTheme === 'true';
    }
    // Check system preference
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Apply or remove Dark Mode tailwind class on document root
  useEffect(() => {
    const root = window.document.documentElement;
    if (isDarkMode) {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('edu_theme_dark', isDarkMode.toString());
  }, [isDarkMode]);

  // Sync sessions to localStorage
  useEffect(() => {
    localStorage.setItem('edu_chat_sessions', JSON.stringify(sessions));
  }, [sessions]);

  // Sync currentSessionId to localStorage
  useEffect(() => {
    localStorage.setItem('edu_chat_current_session_id', currentSessionId);
  }, [currentSessionId]);

  // Find active session
  const currentSession = sessions.find(s => s.id === currentSessionId) || sessions[0] || {
    id: 'session-default',
    title: 'New Chat',
    messages: [],
    agentId: 'Tutor'
  };

  const messages = currentSession.messages;
  const selectedAgentId = currentSession.agentId;

  // Find active agent object
  const activeAgent = AGENTS.find(a => a.id === selectedAgentId) || AGENTS[0];

  // Send message flow
  const handleSendMessage = async (text: string) => {
    if (!text.trim() || isThinking) return;

    const userMessage: Message = {
      id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      role: 'user',
      agent: null,
      content: text,
      timestamp: new Date()
    };

    // Update current session messages and title if it was default
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        const newMessages = [...s.messages, userMessage];
        let newTitle = s.title;
        if (s.title === 'New Chat' || s.title === 'Conceptual Learning Chat') {
          newTitle = text.trim().slice(0, 32) + (text.trim().length > 32 ? '...' : '');
        }
        return {
          ...s,
          messages: newMessages,
          title: newTitle
        };
      }
      return s;
    }));

    setIsThinking(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      const { agent, response } = await fetchAgentResponse(text, history);

      const assistantMessage: Message = {
        id: `msg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        role: 'assistant',
        agent: agent || selectedAgentId,
        content: response,
        timestamp: new Date()
      };

      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, assistantMessage]
          };
        }
        return s;
      }));
    } catch (error) {
      console.error("Failed to fetch agent response:", error);
      
      // Error fallback message
      const errorMessage: Message = {
        id: `msg-error-${Date.now()}`,
        role: 'assistant',
        agent: selectedAgentId,
        content: `[AGENT: ${selectedAgentId}] Apologies, I encountered an error communicating with my learning database. Please check your connection and try again!`,
        timestamp: new Date()
      };
      
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [...s.messages, errorMessage]
          };
        }
        return s;
      }));
    } finally {
      setIsThinking(false);
    }
  };

  // Helper to handle suggested question click
  const handleSelectSuggestion = (question: string) => {
    handleSendMessage(question);
  };

  // Create a new empty chat session
  const handleCreateNewChat = () => {
    const newSessionId = `session-${Date.now()}`;
    const newSession: ChatSession = {
      id: newSessionId,
      title: 'New Chat',
      messages: [],
      agentId: 'Tutor',
      createdAt: Date.now()
    };
    setSessions(prev => [newSession, ...prev]);
    setCurrentSessionId(newSessionId);
    setIsMobileSidebarOpen(false);
  };

  // Switch to a different chat session
  const handleSelectSession = (id: string) => {
    setCurrentSessionId(id);
    setIsMobileSidebarOpen(false);
  };

  // Delete a specific session
  const handleDeleteSession = (id: string) => {
    setSessions(prev => {
      const filtered = prev.filter(s => s.id !== id);
      if (id === currentSessionId) {
        if (filtered.length > 0) {
          setCurrentSessionId(filtered[0].id);
        } else {
          // If no sessions left, create a default fresh one
          const defaultId = `session-${Date.now()}`;
          const defaultSession: ChatSession = {
            id: defaultId,
            title: 'New Chat',
            messages: [],
            agentId: 'Tutor',
            createdAt: Date.now()
          };
          setCurrentSessionId(defaultId);
          return [defaultSession];
        }
      }
      return filtered;
    });
  };

  // Select active specialist within active session
  const handleSelectAgent = (id: 'Tutor' | 'Exam' | 'Solver') => {
    setSessions(prev => prev.map(s => {
      if (s.id === currentSessionId) {
        return {
          ...s,
          agentId: id
        };
      }
      return s;
    }));
  };

  // Reset active chat history messages
  const handleClearHistory = () => {
    if (window.confirm("Are you sure you want to clear all messages in this conversation?")) {
      setSessions(prev => prev.map(s => {
        if (s.id === currentSessionId) {
          return {
            ...s,
            messages: [],
            title: 'New Chat'
          };
        }
        return s;
      }));
    }
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-white dark:bg-[#0A0A0A] font-sans transition-colors duration-200">
      {/* Sidebar Component (Responsively persistent on Desktop / slide-out on Mobile) */}
      <Sidebar
        selectedAgentId={selectedAgentId}
        onSelectAgent={handleSelectAgent}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        sessions={sessions}
        currentSessionId={currentSessionId}
        onCreateNewChat={handleCreateNewChat}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        onClearHistory={handleClearHistory}
        hasMessages={messages.length > 0}
      />

      {/* Main Chat Area Component */}
      <ChatArea
        activeAgent={activeAgent}
        messages={messages}
        isThinking={isThinking}
        onSendMessage={handleSendMessage}
        onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
        onSelectSuggestion={handleSelectSuggestion}
      />
    </div>
  );
}

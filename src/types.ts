export interface Message {
  id: string;
  role: 'user' | 'assistant';
  agent: string | null; // extracted agent name, e.g., 'Tutor', 'Exam', 'Solver'
  content: string;      // clean content (extracted from raw API string or user text)
  rawContent?: string;  // stores the original raw API response including [AGENT: AgentName] tag
  timestamp: Date;
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  agentId: 'Tutor' | 'Exam' | 'Solver';
  createdAt: number;
}

export interface Agent {
  id: 'Tutor' | 'Exam' | 'Solver';
  name: string;
  tagline: string;
  description: string;
  color: string;        // Tailwind class name prefix, e.g., 'blue'
  iconName: 'BookOpen' | 'FileText' | 'CheckCircle';
  suggestedQuestions: string[];
  personalityPrompt: string;
}

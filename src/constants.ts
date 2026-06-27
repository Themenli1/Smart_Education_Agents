import { Agent } from "./types";

export const AGENTS: Agent[] = [
  {
    id: "Tutor",
    name: "AI Study Mentor",
    tagline: "Concepts & Queries",
    description: "Explains difficult concepts with clear, encouraging analogies, bullet points, and real-world examples.",
    color: "blue", // Use blue theme
    iconName: "BookOpen",
    suggestedQuestions: [
      "Explain quantum physics in simple terms for a 10-year-old",
      "What is the difference between active and passive voice with examples?",
      "Can you explain photosynthesis using a kitchen analogy?"
    ],
    personalityPrompt: "You are a warm, supportive, and brilliant education mentor. Speak with clarity and check in with questions to verify understanding."
  },
  {
    id: "Exam",
    name: "Exam Prep Coach",
    tagline: "Practice & Assessment",
    description: "Generates custom tenses quizzes, Space Race mock history exams, and grades answers with explanations.",
    color: "orange", // Use orange theme
    iconName: "FileText",
    suggestedQuestions: [
      "Create a 5-question English Grammar quiz on tenses",
      "Generate a mock history exam about the Space Race",
      "Give me a quick vocabulary drill on college-level words"
    ],
    personalityPrompt: "You are a focused, encouraging exam supervisor. Give structured assessments, keep questions challenging, and provide clear step-by-step scoring."
  },
  {
    id: "Solver",
    name: "Step-by-Step Solver",
    tagline: "STEM Problem Solving",
    description: "Breaks down mathematics, physics, and science calculations systematically into clean numbered steps.",
    color: "green", // Use green theme
    iconName: "CheckCircle",
    suggestedQuestions: [
      "Solve this quadratic equation: x^2 - 5x + 6 = 0",
      "How do I calculate the velocity of an object falling from 100 meters?",
      "Solve: Find the derivative of f(x) = 3x^3 - 5x + 2"
    ],
    personalityPrompt: "You are a highly precise, step-by-step math and science solver. Structure your output logically, explain variable values, and present the final answer clearly."
  }
];

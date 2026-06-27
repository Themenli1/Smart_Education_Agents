/**
 * Parses raw backend API responses formatted as:
 * "[AGENT: AgentName] Actual message text here..."
 * 
 * Returns the extracted AgentName and the stripped clean message text.
 */
export function parseAgentMessage(rawContent: string): { agent: string | null; content: string } {
  if (!rawContent) {
    return { agent: null, content: "" };
  }

  // Regular expression to match "[AGENT: AgentName] ..."
  // Matches "[AGENT: AnyWordOrSpaces]" followed by optional spaces and the rest of the message.
  const agentPattern = /^\[AGENT:\s*([^\]]+)\]\s*(.*)$/s;
  const match = rawContent.match(agentPattern);

  if (match) {
    const agentName = match[1].trim();
    const cleanText = match[2].trim();
    return {
      agent: agentName,
      content: cleanText
    };
  }

  // Fallback in case the message does not have the prefix tag
  return {
    agent: null,
    content: rawContent
  };
}

/**
 * Formats a message content back into the backend-style prefixed tag.
 */
export function formatAgentMessage(agentName: string, text: string): string {
  return `[AGENT: ${agentName}] ${text}`;
}

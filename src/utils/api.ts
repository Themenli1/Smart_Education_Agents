export async function fetchAgentResponse(
  userQuery: string,
  history: { role: string; content: string }[] = []
): Promise<{ agent: string; response: string }> {
  try {
    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: userQuery, history }),
    });
    return await res.json();
  } catch {
    return { agent: "tutor", response: "Lỗi kết nối server, vui lòng thử lại." };
  }
}
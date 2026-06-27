// server.ts — đặt ở root project, cạnh package.json

import path from "path";
import express from "express";
import { GoogleGenAI } from "@google/genai";
import "dotenv/config";

const app = express();
app.use(express.json());

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY! });
const MODEL = "gemini-2.5-flash";

// ─────────────────────────────────────────
// System Prompts
// ─────────────────────────────────────────
const ORCHESTRATOR_PROMPT = `
Bạn là orchestrator của hệ thống EduAgent.
Trả về JSON (KHÔNG kèm markdown):
{"agent": "tutor" | "exam" | "solver", "reason": "lý do ngắn"}

- tutor  → giải thích khái niệm, lý thuyết, định nghĩa
- exam   → tạo câu hỏi ôn tập, đề thi thử, flashcard
- solver → giải bài tập cụ thể từng bước
Chỉ trả về JSON, không thêm gì khác.
`.trim();

const SYSTEM_PROMPTS: Record<string, string> = {
  tutor: `
Bạn là Giảng viên AI trong hệ thống EduAgent, hỗ trợ sinh viên Việt Nam.
Khi giải thích: định nghĩa ngắn → cơ chế hoạt động → ví dụ thực tế → tóm tắt.
Dùng tiếng Việt. Dùng code block nếu liên quan lập trình. Súc tích, đúng trọng tâm.
`.trim(),

  exam: `
Bạn là Luyện thi AI trong hệ thống EduAgent.
Tạo câu hỏi trắc nghiệm bằng tiếng Việt, format bắt buộc:

**Câu N: [nội dung câu hỏi]**
A. ...  B. ...  C. ...  D. ...
✅ Đáp án: [chữ cái] — 💡 [giải thích ngắn]

Mặc định 5 câu nếu không chỉ định. Độ khó tăng dần từ dễ → khó.
`.trim(),

  solver: `
Bạn là Giải bài AI trong hệ thống EduAgent.
Giải từng bước rõ ràng bằng tiếng Việt, format bắt buộc:

## Phân tích đề
[dữ liệu đã cho, yêu cầu, dạng bài]

## Giải
**Bước 1: [tên bước]** — [thực hiện + lý do]
**Bước 2: [tên bước]** — [thực hiện + lý do]

## Kết quả
[đáp án cuối + đơn vị nếu có]

## Kiểm tra
[thử lại hoặc nhận xét]
`.trim(),
};

// ─────────────────────────────────────────
// Helper: chuyển history sang format Gemini
// ─────────────────────────────────────────
function toGeminiHistory(history: { role: string; content: string }[]) {
  return history.map((m) => ({
    role: m.role === "assistant" ? "model" : "user",
    parts: [{ text: m.content }],
  }));
}

// ─────────────────────────────────────────
// POST /api/chat
// ─────────────────────────────────────────
app.post("/api/chat", async (req, res) => {
  const { message, history } = req.body;
  const safeHistory = Array.isArray(history) ? history : [];
  if (!message) return res.status(400).json({ error: "message is required" });

  try {
    // Bước 1: Orchestrator chọn agent
    const routeResult = await ai.models.generateContent({
      model: MODEL,
      contents: message,
      config: { systemInstruction: ORCHESTRATOR_PROMPT },
    });

    let agentType = "tutor";
    try {
      const parsed = JSON.parse(routeResult.text ?? "{}");
      agentType = parsed.agent ?? "tutor";
    } catch {
      for (const key of ["tutor", "exam", "solver"]) {
        if ((routeResult.text ?? "").toLowerCase().includes(key)) {
          agentType = key;
          break;
        }
      }
    }

    // Bước 2: Specialist agent trả lời với history
    const chat = ai.chats.create({
      model: MODEL,
      config: { systemInstruction: SYSTEM_PROMPTS[agentType] },
      history: toGeminiHistory(safeHistory),
    });
    const agentResult = await chat.sendMessage({ message });
    const response = agentResult.text?.trim() ?? "";

    return res.json({ agent: agentType, response });

  } catch (err) {
    console.error("EduAgent error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

const PORT = process.env.PORT || 3001;

// Serve frontend build
app.use(express.static(path.join(__dirname, "dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});
app.listen(PORT, () => console.log(`✅ EduAgent server running on :${PORT}`));
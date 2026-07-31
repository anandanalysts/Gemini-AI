import React, { useState, useRef, useEffect } from "react";
import { PersonaRole, GeminiModelId, ChatMessage, ChatThread } from "../../types";
import {
  Send,
  Bot,
  User,
  Sparkles,
  Copy,
  Check,
  Trash2,
  Download,
  AlertCircle,
  ChevronRight,
  Code2,
  RefreshCw,
  Terminal,
  Zap,
  Cpu,
  Volume2,
  VolumeX,
  Square
} from "lucide-react";

interface ChatThreadViewProps {
  currentThread: ChatThread;
  activePersona: PersonaRole;
  selectedModel: GeminiModelId;
  systemPrompt: string;
  onSendMessage: (userText: string) => Promise<void>;
  onClearThread: () => void;
  onExportThread: () => void;
  isLoading: boolean;
}

export const ChatThreadView: React.FC<ChatThreadViewProps> = ({
  currentThread,
  activePersona,
  selectedModel,
  systemPrompt,
  onSendMessage,
  onClearThread,
  onExportThread,
  isLoading,
}) => {
  const [input, setInput] = useState("");
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingMsgId, setSpeakingMsgId] = useState<string | null>(null);
  const [isSpeaking, setIsSpeaking] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const isSpeechSupported = typeof window !== "undefined" && "speechSynthesis" in window;

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentThread.messages, isLoading]);

  // Clean up speech synthesis when thread changes or unmounts
  useEffect(() => {
    return () => {
      if (isSpeechSupported) {
        window.speechSynthesis.cancel();
      }
    };
  }, [currentThread.id, isSpeechSupported]);

  const stopSpeech = () => {
    if (isSpeechSupported) {
      window.speechSynthesis.cancel();
    }
    setSpeakingMsgId(null);
    setIsSpeaking(false);
  };

  const speakText = (text: string, msgId: string) => {
    if (!isSpeechSupported) {
      alert("Text-to-speech is not supported in this browser environment.");
      return;
    }

    // Toggle off if currently speaking the exact same message
    if (isSpeaking && speakingMsgId === msgId) {
      stopSpeech();
      return;
    }

    window.speechSynthesis.cancel();

    // Clean text from markdown for better vocalization
    const cleanText = text
      .replace(/```[\s\S]*?```/g, "Code block omitted.") // simplify code blocks
      .replace(/`([^`]+)`/g, "$1") // inline code
      .replace(/[*#_~]/g, "") // markdown formatting
      .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1"); // links

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.rate = 1.0;
    utterance.pitch = 1.0;

    utterance.onend = () => {
      setSpeakingMsgId(null);
      setIsSpeaking(false);
    };

    utterance.onerror = () => {
      setSpeakingMsgId(null);
      setIsSpeaking(false);
    };

    setSpeakingMsgId(msgId);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  // Find and speak the last received assistant message
  const handleReadLastMessage = () => {
    const assistantMsgs = currentThread.messages.filter((m) => m.role === "assistant");
    if (assistantMsgs.length === 0) return;
    const lastMsg = assistantMsgs[assistantMsgs.length - 1];
    speakText(lastMsg.text, lastMsg.id);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;
    const text = input.trim();
    setInput("");
    await onSendMessage(text);
  };

  const handleCopyText = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const lastAssistantMsg = currentThread.messages
    .filter((m) => m.role === "assistant")
    .slice(-1)[0];

  return (
    <div id="ai-chat-thread-container" className="flex flex-col h-[calc(100vh-4rem)] bg-slate-950 text-slate-100">
      
      {/* Top Thread Controls Sub-Header */}
      <div className="px-4 py-3 bg-slate-900/80 border-b border-slate-800 flex items-center justify-between gap-3 text-xs shadow-sm">
        <div className="flex items-center gap-2 truncate">
          <span className="font-bold text-white truncate">{currentThread.title}</span>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 border border-slate-700/80">
            {selectedModel}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {/* Read Aloud Last Message Button */}
          {lastAssistantMsg && (
            <button
              onClick={handleReadLastMessage}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border ${
                isSpeaking && speakingMsgId === lastAssistantMsg.id
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/80 animate-pulse"
                  : "bg-indigo-950/80 text-indigo-300 hover:bg-indigo-900/80 border-indigo-800/80"
              }`}
              title="Read Aloud Last Assistant Message (Web Speech API)"
            >
              {isSpeaking && speakingMsgId === lastAssistantMsg.id ? (
                <>
                  <VolumeX className="h-3.5 w-3.5 text-amber-400" />
                  <span>Stop Reading</span>
                </>
              ) : (
                <>
                  <Volume2 className="h-3.5 w-3.5 text-indigo-400" />
                  <span>Read Aloud Last Message</span>
                </>
              )}
            </button>
          )}

          <button
            onClick={onClearThread}
            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-rose-950/30 rounded-lg transition-colors"
            title="Clear Thread Messages"
          >
            <Trash2 className="h-4 w-4" />
          </button>
          <button
            onClick={onExportThread}
            className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-indigo-950/30 rounded-lg transition-colors"
            title="Export Thread History"
          >
            <Download className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Messages Thread List */}
      <div id="chat-messages-scroll-area" className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 scrollbar-thin">
        {currentThread.messages.map((msg) => {
          const isUser = msg.role === "user";
          const isMsgSpeaking = isSpeaking && speakingMsgId === msg.id;

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3.5 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in duration-150`}
            >
              {/* Avatar Icon */}
              <div
                className={`h-9 w-9 rounded-xl flex items-center justify-center shrink-0 shadow-md ${
                  isUser
                    ? "bg-slate-800 text-slate-200 border border-slate-700"
                    : msg.isError
                    ? "bg-rose-900 text-rose-100 border border-rose-700"
                    : "bg-gradient-to-br from-indigo-600 to-purple-600 text-white"
                }`}
              >
                {isUser ? <User className="h-4 w-4" /> : <Bot className="h-4 w-4" />}
              </div>

              {/* Message Bubble Box */}
              <div
                className={`max-w-[88%] sm:max-w-[78%] rounded-2xl p-4 shadow-sm text-sm leading-relaxed ${
                  isUser
                    ? "bg-indigo-600 text-white rounded-tr-none font-medium"
                    : msg.isError
                    ? "bg-rose-950/60 border border-rose-800/80 text-rose-200 rounded-tl-none"
                    : "bg-slate-900 border border-slate-800/90 text-slate-200 rounded-tl-none"
                }`}
              >
                {!isUser && (
                  <div className="flex items-center justify-between gap-2 pb-2 mb-2 border-b border-slate-800/80 text-[11px] text-slate-400">
                    <div className="flex items-center gap-1.5 font-semibold text-indigo-400">
                      <Sparkles className="h-3 w-3 text-amber-400" />
                      <span>{msg.personaName || activePersona.name}</span>
                    </div>
                    {msg.modelUsed && (
                      <span className="px-1.5 py-0.5 rounded bg-slate-800 text-[10px] text-slate-400 border border-slate-700/50">
                        {msg.modelUsed}
                      </span>
                    )}
                  </div>
                )}

                {/* Message Body Text */}
                <div className="whitespace-pre-wrap font-sans leading-relaxed text-slate-100">
                  {msg.text}
                </div>

                {/* Message Footer */}
                <div className="mt-2.5 pt-2 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-800/50">
                  <span>{msg.timestamp}</span>
                  {!isUser && (
                    <div className="flex items-center gap-3">
                      {/* Read Aloud Text-to-Speech Button */}
                      <button
                        onClick={() => speakText(msg.text, msg.id)}
                        className={`flex items-center gap-1 font-medium transition-colors ${
                          isMsgSpeaking
                            ? "text-amber-400 font-semibold animate-pulse"
                            : "text-slate-400 hover:text-slate-200"
                        }`}
                        title="Read Aloud with Web Speech API"
                      >
                        {isMsgSpeaking ? (
                          <>
                            <VolumeX className="h-3 w-3 text-amber-400" />
                            <span>Stop Speaking</span>
                          </>
                        ) : (
                          <>
                            <Volume2 className="h-3 w-3" />
                            <span>Read Aloud</span>
                          </>
                        )}
                      </button>

                      {/* Copy Button */}
                      <button
                        onClick={() => handleCopyText(msg.id, msg.text)}
                        className="flex items-center gap-1 text-slate-400 hover:text-slate-200 transition-colors"
                      >
                        {copiedId === msg.id ? (
                          <>
                            <Check className="h-3 w-3 text-emerald-400" />
                            <span className="text-emerald-400 font-medium">Copied</span>
                          </>
                        ) : (
                          <>
                            <Copy className="h-3 w-3" />
                            <span>Copy Response</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </div>

              </div>
            </div>
          );
        })}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex items-start gap-3.5 flex-row animate-pulse">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white flex items-center justify-center">
              <Bot className="h-4 w-4" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl rounded-tl-none p-4 text-xs text-slate-400 flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-amber-400 animate-spin" />
              <span>Generating response with {selectedModel}...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Starter Prompts Bar */}
      <div className="px-4 py-2 bg-slate-900/60 border-t border-slate-800/80 overflow-x-auto scrollbar-none flex items-center gap-2">
        <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
          <ChevronRight className="h-3 w-3 text-indigo-400" /> Suggested Prompts:
        </span>
        {activePersona.starterPrompts.map((promptText, idx) => (
          <button
            key={idx}
            onClick={() => onSendMessage(promptText)}
            disabled={isLoading}
            className="text-xs px-2.5 py-1 rounded-full bg-slate-800/90 text-slate-300 hover:text-white hover:bg-indigo-600/30 hover:border-indigo-500/50 border border-slate-700/60 transition-all shrink-0 whitespace-nowrap disabled:opacity-40"
          >
            {promptText}
          </button>
        ))}
      </div>

      {/* Input Box Bar */}
      <div className="p-3 sm:p-4 bg-slate-900 border-t border-slate-800">
        <form
          onSubmit={handleSubmit}
          className="flex items-center gap-2 bg-slate-950 border border-slate-800 focus-within:border-indigo-500 rounded-xl px-3.5 py-2.5 transition-colors shadow-inner"
        >
          <input
            id="chat-input-field"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={`Message ${activePersona.name}... (${selectedModel})`}
            disabled={isLoading}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-500 outline-none"
          />

          <button
            id="chat-send-btn"
            type="submit"
            disabled={!input.trim() || isLoading}
            className="h-9 px-4 rounded-lg bg-indigo-600 text-white font-medium text-xs flex items-center gap-1.5 hover:bg-indigo-500 disabled:opacity-40 disabled:hover:bg-indigo-600 transition-all shrink-0 shadow-md shadow-indigo-600/20"
          >
            <span>Send</span>
            <Send className="h-3.5 w-3.5" />
          </button>
        </form>
      </div>

    </div>
  );
};


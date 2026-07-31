import React, { useState } from "react";
import { PersonaRole, GeminiModelId, ChatMessage, ChatThread } from "./types";
import { BUILTIN_PERSONAS, INITIAL_THREADS } from "./data/personas";
import { Header } from "./components/Header";
import { Sidebar } from "./components/Sidebar";
import { ChatThreadView } from "./components/Chat/ChatThread";
import { SystemInstructionModal } from "./components/SystemInstructionModal";

export default function App() {
  const [threads, setThreads] = useState<ChatThread[]>(INITIAL_THREADS);
  const [activeThreadId, setActiveThreadId] = useState<string>(INITIAL_THREADS[0].id);
  const [activePersona, setActivePersona] = useState<PersonaRole>(BUILTIN_PERSONAS[0]);
  const [selectedModel, setSelectedModel] = useState<GeminiModelId>(BUILTIN_PERSONAS[0].recommendedModel);
  const [customSystemPrompt, setCustomSystemPrompt] = useState<string>(BUILTIN_PERSONAS[0].systemPrompt);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState<boolean>(false);
  const [isSystemPromptModalOpen, setIsSystemPromptModalOpen] = useState<boolean>(false);

  const currentThread = threads.find((t) => t.id === activeThreadId) || threads[0];

  // Switch persona role
  const handleSelectPersona = (persona: PersonaRole) => {
    setActivePersona(persona);
    setSelectedModel(persona.recommendedModel);
    setCustomSystemPrompt(persona.systemPrompt);

    // If current thread is empty/welcome, update system prompt and persona
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            personaId: persona.id,
            selectedModel: persona.recommendedModel,
            systemPrompt: persona.systemPrompt,
          };
        }
        return t;
      })
    );
  };

  // Create new thread
  const handleNewThread = () => {
    const newId = `thread-${Date.now()}`;
    const newThreadObj: ChatThread = {
      id: newId,
      title: `New ${activePersona.name} Chat`,
      createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      personaId: activePersona.id,
      selectedModel: selectedModel,
      systemPrompt: customSystemPrompt,
      messages: [
        {
          id: `msg-${Date.now()}`,
          role: "assistant",
          text: `Hello! I am acting as **${activePersona.name}** using \`${selectedModel}\`.\n\nHow can I help you?`,
          timestamp: "Just now",
          modelUsed: selectedModel,
          personaName: activePersona.name,
        }
      ]
    };

    setThreads((prev) => [newThreadObj, ...prev]);
    setActiveThreadId(newId);
  };

  // Delete thread
  const handleDeleteThread = (threadId: string) => {
    if (threads.length <= 1) return;
    const remaining = threads.filter((t) => t.id !== threadId);
    setThreads(remaining);
    if (activeThreadId === threadId) {
      setActiveThreadId(remaining[0].id);
    }
  };

  // Clear current thread history
  const handleClearThread = () => {
    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          return {
            ...t,
            messages: [
              {
                id: `msg-${Date.now()}`,
                role: "assistant",
                text: `Conversation history cleared. Ready for your next query with **${activePersona.name}**!`,
                timestamp: "Just now",
                modelUsed: selectedModel,
                personaName: activePersona.name,
              }
            ]
          };
        }
        return t;
      })
    );
  };

  // Export thread text
  const handleExportThread = () => {
    const threadData = currentThread.messages
      .map((m) => `[${m.role.toUpperCase()}] (${m.timestamp}):\n${m.text}\n`)
      .join("\n---\n\n");

    const blob = new Blob([threadData], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${currentThread.title.replace(/\s+/g, "_")}_history.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Send message to Gemini via server API
  const handleSendMessage = async (userText: string) => {
    if (!userText.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: "user",
      text: userText,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    // Append user message immediately
    const updatedMessages = [...currentThread.messages, userMsg];

    setThreads((prev) =>
      prev.map((t) => {
        if (t.id === activeThreadId) {
          // Auto update title if this is early in conversation
          const updatedTitle = t.messages.length <= 1 ? userText.slice(0, 28) + "..." : t.title;
          return {
            ...t,
            title: updatedTitle,
            messages: updatedMessages,
          };
        }
        return t;
      })
    );

    setIsLoading(true);

    try {
      // Send conversation history to backend Gemini proxy
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: updatedMessages.map((m) => ({ role: m.role, text: m.text })),
          systemInstruction: customSystemPrompt,
          model: selectedModel,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to receive response from Gemini AI.");
      }

      const assistantReply = data.reply || "No response received.";

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        text: assistantReply,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        modelUsed: data.modelUsed || selectedModel,
        personaName: activePersona.name,
      };

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, botMsg],
            };
          }
          return t;
        })
      );
    } catch (err: any) {
      console.error("Chat error:", err);
      const errorMsg: ChatMessage = {
        id: `err-${Date.now()}`,
        role: "assistant",
        text: `⚠️ Error: ${err.message || "Could not reach Gemini AI service. Please verify your GEMINI_API_KEY environment variable."}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isError: true,
      };

      setThreads((prev) =>
        prev.map((t) => {
          if (t.id === activeThreadId) {
            return {
              ...t,
              messages: [...t.messages, errorMsg],
            };
          }
          return t;
        })
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div id="chatbot-app-root" className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Top Navigation Header */}
      <Header
        activePersona={activePersona}
        selectedModel={selectedModel}
        onSelectModel={(model) => setSelectedModel(model)}
        onOpenSystemPromptModal={() => setIsSystemPromptModalOpen(true)}
        onToggleSidebarMobile={() => setIsSidebarMobileOpen((prev) => !prev)}
        onNewChat={handleNewThread}
      />

      {/* Main Body Layout */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* Left Sidebar */}
        <Sidebar
          threads={threads}
          activeThreadId={activeThreadId}
          activePersona={activePersona}
          onSelectThread={(id) => setActiveThreadId(id)}
          onSelectPersona={handleSelectPersona}
          onNewThread={handleNewThread}
          onDeleteThread={handleDeleteThread}
          isOpenMobile={isSidebarMobileOpen}
          onCloseMobile={() => setIsSidebarMobileOpen(false)}
        />

        {/* Main Chat Thread Area */}
        <main className="flex-1 overflow-hidden bg-slate-950">
          <ChatThreadView
            currentThread={currentThread}
            activePersona={activePersona}
            selectedModel={selectedModel}
            systemPrompt={customSystemPrompt}
            onSendMessage={handleSendMessage}
            onClearThread={handleClearThread}
            onExportThread={handleExportThread}
            isLoading={isLoading}
          />
        </main>

      </div>

      {/* System Instructions Settings Modal */}
      <SystemInstructionModal
        isOpen={isSystemPromptModalOpen}
        onClose={() => setIsSystemPromptModalOpen(false)}
        activePersona={activePersona}
        currentPrompt={customSystemPrompt}
        onSavePrompt={(p) => setCustomSystemPrompt(p)}
      />

    </div>
  );
}

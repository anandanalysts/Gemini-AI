import React from "react";
import { PersonaRole, GeminiModelId } from "../types";
import {
  Sparkles,
  Bot,
  Sliders,
  Menu,
  Plus,
  Zap,
  Cpu,
  BrainCircuit,
  Settings2
} from "lucide-react";

interface HeaderProps {
  activePersona: PersonaRole;
  selectedModel: GeminiModelId;
  onSelectModel: (model: GeminiModelId) => void;
  onOpenSystemPromptModal: () => void;
  onToggleSidebarMobile: () => void;
  onNewChat: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePersona,
  selectedModel,
  onSelectModel,
  onOpenSystemPromptModal,
  onToggleSidebarMobile,
  onNewChat,
}) => {
  return (
    <header className="bg-slate-900 border-b border-slate-800 text-white sticky top-0 z-30">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
        
        {/* Left Brand & Mobile Menu Button */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleSidebarMobile}
            className="p-2 text-slate-400 hover:text-white rounded-lg md:hidden hover:bg-slate-800"
            title="Toggle Sidebar"
          >
            <Menu className="h-5 w-5" />
          </button>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-500 flex items-center justify-center shadow-lg shadow-indigo-500/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="font-bold text-base sm:text-lg tracking-tight flex items-center gap-2">
                Gemini <span className="text-indigo-400">Chatbot</span>
                <span className="hidden sm:inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-indigo-950 text-indigo-300 border border-indigo-800/60 uppercase tracking-wider">
                  AI Studio
                </span>
              </h1>
            </div>
          </div>
        </div>

        {/* Center Active Persona Badge */}
        <div className="hidden lg:flex items-center gap-2 bg-slate-800/80 border border-slate-700/80 rounded-xl px-3 py-1.5 text-xs">
          <Sparkles className="h-3.5 w-3.5 text-amber-400 animate-pulse" />
          <span className="text-slate-400">Persona:</span>
          <span className="font-bold text-slate-200">{activePersona.name}</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded bg-indigo-950 text-indigo-300 border border-indigo-800/50">
            {activePersona.badge}
          </span>
        </div>

        {/* Right Model Selector & Prompt Customizer */}
        <div className="flex items-center gap-2">
          
          {/* Model Dropdown Picker */}
          <div className="flex items-center gap-1.5 bg-slate-800/90 border border-slate-700 rounded-xl px-2.5 py-1.5 text-xs">
            <Cpu className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
            <select
              value={selectedModel}
              onChange={(e) => onSelectModel(e.target.value as GeminiModelId)}
              className="bg-transparent text-xs font-semibold text-indigo-300 outline-none cursor-pointer"
            >
              <option value="gemini-3.5-flash" className="bg-slate-900 text-slate-100">
                gemini-3.5-flash (General)
              </option>
              <option value="gemini-3.1-pro-preview" className="bg-slate-900 text-slate-100">
                gemini-3.1-pro-preview (Complex Tasks)
              </option>
              <option value="gemini-3.1-flash-lite" className="bg-slate-900 text-slate-100">
                gemini-3.1-flash-lite (Fast Mode)
              </option>
              <option value="gemini-3.6-flash" className="bg-slate-900 text-slate-100">
                gemini-3.6-flash (Advanced Flash)
              </option>
            </select>
          </div>

          {/* System Instructions Modal Trigger */}
          <button
            onClick={onOpenSystemPromptModal}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/80 text-xs font-semibold text-slate-200 transition-colors"
            title="Configure System Instructions"
          >
            <Settings2 className="h-3.5 w-3.5 text-indigo-400" />
            <span className="hidden sm:inline">System Prompt</span>
          </button>

          {/* New Chat Button */}
          <button
            onClick={onNewChat}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold shadow-md shadow-indigo-600/20 transition-all shrink-0"
          >
            <Plus className="h-4 w-4" />
            <span className="hidden sm:inline">New Chat</span>
          </button>

        </div>

      </div>
    </header>
  );
};

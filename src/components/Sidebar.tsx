import React from "react";
import { PersonaRole, ChatThread } from "../types";
import { BUILTIN_PERSONAS } from "../data/personas";
import {
  MessageSquare,
  Plus,
  Bot,
  Code2,
  Zap,
  Briefcase,
  Sliders,
  Trash2,
  Sparkles,
  ChevronRight,
  Check
} from "lucide-react";

interface SidebarProps {
  threads: ChatThread[];
  activeThreadId: string;
  activePersona: PersonaRole;
  onSelectThread: (threadId: string) => void;
  onSelectPersona: (persona: PersonaRole) => void;
  onNewThread: () => void;
  onDeleteThread: (threadId: string) => void;
  isOpenMobile: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  threads,
  activeThreadId,
  activePersona,
  onSelectThread,
  onSelectPersona,
  onNewThread,
  onDeleteThread,
  isOpenMobile,
  onCloseMobile,
}) => {
  const getRoleIcon = (iconName: string) => {
    switch (iconName) {
      case "Code2":
        return <Code2 className="h-4 w-4 text-purple-400" />;
      case "Zap":
        return <Zap className="h-4 w-4 text-amber-400" />;
      case "Briefcase":
        return <Briefcase className="h-4 w-4 text-emerald-400" />;
      case "Sliders":
        return <Sliders className="h-4 w-4 text-blue-400" />;
      default:
        return <Bot className="h-4 w-4 text-indigo-400" />;
    }
  };

  return (
    <>
      {/* Mobile backdrop */}
      {isOpenMobile && (
        <div
          onClick={onCloseMobile}
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
        />
      )}

      <aside
        className={`fixed md:static top-0 bottom-0 left-0 z-50 w-72 bg-slate-900 border-r border-slate-800 p-3.5 flex flex-col justify-between transition-transform duration-200 ease-in-out shrink-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div className="space-y-6 overflow-y-auto pr-1 scrollbar-thin">
          
          {/* New Chat Button */}
          <button
            onClick={() => {
              onNewThread();
              onCloseMobile();
            }}
            className="w-full py-2.5 px-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 transition-all"
          >
            <Plus className="h-4 w-4" />
            <span>New Chat Thread</span>
          </button>

          {/* AI Persona Roles List */}
          <div className="space-y-2">
            <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider flex items-center justify-between">
              <span>AI Personas & Roles</span>
              <Sparkles className="h-3 w-3 text-amber-400" />
            </div>

            <div className="space-y-1">
              {BUILTIN_PERSONAS.map((persona) => {
                const isSelected = activePersona.id === persona.id;
                return (
                  <button
                    key={persona.id}
                    onClick={() => {
                      onSelectPersona(persona);
                      onCloseMobile();
                    }}
                    className={`w-full text-left p-2.5 rounded-xl transition-all flex items-start gap-2.5 ${
                      isSelected
                        ? "bg-indigo-950/80 border border-indigo-500/80 text-white shadow-md"
                        : "bg-slate-800/40 hover:bg-slate-800 text-slate-300 border border-slate-800/60"
                    }`}
                  >
                    <div className="mt-0.5 shrink-0">{getRoleIcon(persona.iconName)}</div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <p className="text-xs font-semibold truncate">{persona.name}</p>
                        <span className={`text-[9px] px-1.5 py-0.2 rounded font-medium ${
                          isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                        }`}>
                          {persona.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">{persona.description}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Saved Chat History Threads */}
          <div className="space-y-2 pt-3 border-t border-slate-800">
            <div className="px-2 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Recent Conversations ({threads.length})
            </div>

            <div className="space-y-1">
              {threads.map((thread) => {
                const isActive = thread.id === activeThreadId;
                return (
                  <div
                    key={thread.id}
                    onClick={() => {
                      onSelectThread(thread.id);
                      onCloseMobile();
                    }}
                    className={`group p-2.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between gap-2 ${
                      isActive
                        ? "bg-indigo-600/20 border-indigo-500/80 text-indigo-200"
                        : "bg-slate-900 border-slate-800 text-slate-400 hover:bg-slate-800 hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <MessageSquare className={`h-3.5 w-3.5 shrink-0 ${isActive ? "text-indigo-400" : "text-slate-500"}`} />
                      <span className="text-xs font-medium truncate">{thread.title}</span>
                    </div>

                    {threads.length > 1 && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteThread(thread.id);
                        }}
                        className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                        title="Delete Chat Thread"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800/80 text-[11px] text-slate-500 space-y-1">
          <p className="font-medium text-slate-400">Powered by Google Gemini SDK</p>
          <p className="text-[10px] leading-tight">Server-side proxy API handles secret keys safely.</p>
        </div>

      </aside>
    </>
  );
};

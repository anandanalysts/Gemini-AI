import React, { useState } from "react";
import { PersonaRole } from "../types";
import { Sliders, X, Sparkles, Save, RotateCcw } from "lucide-react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  activePersona: PersonaRole;
  currentPrompt: string;
  onSavePrompt: (prompt: string) => void;
}

export const SystemInstructionModal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  activePersona,
  currentPrompt,
  onSavePrompt,
}) => {
  const [prompt, setPrompt] = useState(currentPrompt);

  if (!isOpen) return null;

  const handleResetDefault = () => {
    setPrompt(activePersona.systemPrompt);
  };

  const handleSave = () => {
    onSavePrompt(prompt);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 w-full max-w-lg shadow-2xl space-y-4 text-xs text-slate-200">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="h-4 w-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-white">
              System Instruction Settings
            </h3>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-white">
            <X className="h-4 w-4" />
          </button>
        </div>

        <p className="text-slate-400 text-[11px] leading-relaxed">
          System instructions define the AI model&apos;s persona, behavior rules, response constraints, and output formatting.
        </p>

        {/* Active Persona Badge */}
        <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
          <span className="text-slate-400">Current Persona:</span>
          <span className="font-bold text-indigo-400">{activePersona.name} ({activePersona.badge})</span>
        </div>

        {/* Textarea for system instructions */}
        <div className="space-y-1">
          <label className="block text-slate-300 font-semibold text-[11px]">System Prompt Text:</label>
          <textarea
            rows={6}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="w-full bg-slate-950 border border-slate-800 focus:border-indigo-500 rounded-xl p-3 text-slate-100 font-mono text-xs outline-none"
            placeholder="Type custom system rules..."
          />
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <button
            onClick={handleResetDefault}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors text-xs font-medium"
          >
            <RotateCcw className="h-3.5 w-3.5" />
            <span>Reset to Persona Default</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3 py-1.5 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 text-xs"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md shadow-indigo-600/20 text-xs transition-colors"
            >
              <Save className="h-3.5 w-3.5" />
              <span>Apply Prompt</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

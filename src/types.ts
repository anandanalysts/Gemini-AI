export type GeminiModelId =
  | "gemini-3.5-flash"
  | "gemini-3.1-pro-preview"
  | "gemini-3.1-flash-lite"
  | "gemini-3.6-flash";

export interface PersonaRole {
  id: string;
  name: string;
  title: string;
  category: "General" | "Coding" | "Creative" | "Business" | "Custom";
  iconName: string;
  badge: string;
  description: string;
  systemPrompt: string;
  recommendedModel: GeminiModelId;
  starterPrompts: string[];
}

export interface ChatMessage {
  id: string;
  role: "user" | "assistant";
  text: string;
  timestamp: string;
  modelUsed?: GeminiModelId;
  personaName?: string;
  isError?: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: string;
  personaId: string;
  selectedModel: GeminiModelId;
  systemPrompt: string;
  messages: ChatMessage[];
}

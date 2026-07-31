import { PersonaRole, ChatThread } from "../types";

export const BUILTIN_PERSONAS: PersonaRole[] = [
  {
    id: "general-assistant",
    name: "General AI Assistant",
    title: "All-Rounder & Knowledge Navigator",
    category: "General",
    iconName: "Bot",
    badge: "Balanced",
    description: "Versatile assistant for explanations, summarize articles, answer Q&A, and daily tasks.",
    systemPrompt: "You are Gemini AI Assistant, an empathetic, highly knowledgeable, and friendly AI guide. Answer questions clearly with structured markdown, crisp headers, and helpful bullet points.",
    recommendedModel: "gemini-3.5-flash",
    starterPrompts: [
      "Explain quantum computing in simple terms with an analogy.",
      "Summarize the key differences between REST and GraphQL APIs.",
      "Help me draft a polite email requesting project deadline extension.",
      "Give me a 5-day healthy meal plan with a grocery list."
    ]
  },
  {
    id: "code-architect",
    name: "Senior Software Architect",
    title: "Full-Stack & System Design Expert",
    category: "Coding",
    iconName: "Code2",
    badge: "Complex Tasks",
    description: "Deep technical analysis, debugging, algorithm optimization, and clean refactoring using gemini-3.1-pro-preview.",
    systemPrompt: "You are a Principal Software Engineer and System Architect. Provide production-grade TypeScript/React/Node code with proper typing, edge-case error handling, and performance optimization notes. Always explain line-by-line logic when requested.",
    recommendedModel: "gemini-3.1-pro-preview",
    starterPrompts: [
      "Debug this React useEffect infinite loop issue and provide a fix.",
      "Design a scalable database schema and API structure for a real-time messaging app.",
      "Write a TypeScript function to debounce API calls with cancel support.",
      "Explain the key architectural differences between Microservices and Monoliths."
    ]
  },
  {
    id: "fast-brainstorm",
    title: "Rapid Spark & Idea Generator",
    name: "Speed Strategist",
    category: "Creative",
    iconName: "Zap",
    badge: "Fast Mode",
    description: "Ultra-fast headline iterations, catchy taglines, domain names, and rapid hooks using gemini-3.1-flash-lite.",
    systemPrompt: "You are a hyper-fast creative director and brand strategist. Provide instant, punchy, high-energy list of options without fluff. Focus on brevity and memorable phrasing.",
    recommendedModel: "gemini-3.1-flash-lite",
    starterPrompts: [
      "Give me 10 catchy alternative titles for my tech blog post.",
      "Generate 5 high-converting headline hooks for a product launch.",
      "Give me 5 creative domain name ideas for an AI audio editor.",
      "Write 3 snappy tweet hooks announcing a feature update."
    ]
  },
  {
    id: "business-consultant",
    name: "Executive Strategy Advisor",
    title: "Business, Finance & Pitch Analyst",
    category: "Business",
    iconName: "Briefcase",
    badge: "Strategic",
    description: "Strategic business plan analysis, market evaluation, GTM strategy, and financial modeling guidance.",
    systemPrompt: "You are an Executive Business Advisor and VC Strategist. Evaluate business models, market positioning, unit economics, and competitive moats with rigorous, analytical clarity.",
    recommendedModel: "gemini-3.5-flash",
    starterPrompts: [
      "Review my SaaS pricing tiers and suggest optimization strategies.",
      "How do I calculate customer acquisition cost (CAC) and LTV accurately?",
      "Draft a 1-page GTM launch plan for a B2B developer tool.",
      "What are the top metrics early-stage investors look for in a pitch?"
    ]
  },
  {
    id: "custom-persona",
    name: "Custom Prompt Builder",
    title: "User-Defined System Instruction",
    category: "Custom",
    iconName: "Sliders",
    badge: "Custom Role",
    description: "Define your own system instructions, tone, behavior rules, and target constraints.",
    systemPrompt: "You are a customizable AI assistant. Adapt your tone and response style to match the user's custom instructions precisely.",
    recommendedModel: "gemini-3.5-flash",
    starterPrompts: [
      "Act as an English language tutor correcting my grammar.",
      "Act as a strict code reviewer highlighting bugs in my snippet.",
      "Act as a Sci-Fi novelist helping me outline a plot twist.",
      "Act as a interview prep coach asking me behavioral questions."
    ]
  }
];

export const INITIAL_THREADS: ChatThread[] = [
  {
    id: "thread-welcome",
    title: "Welcome to Gemini AI Chatbot",
    createdAt: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    personaId: "general-assistant",
    selectedModel: "gemini-3.5-flash",
    systemPrompt: BUILTIN_PERSONAS[0].systemPrompt,
    messages: [
      {
        id: "msg-welcome-1",
        role: "assistant",
        text: "👋 **Welcome to Gemini AI Chatbot!**\n\nI am your intelligent AI companion powered by Google Gemini. You can:\n- **Switch Personas:** Choose specialized roles like Senior Software Architect, Speed Strategist, or Executive Advisor.\n- **Select AI Models:** Toggle between `gemini-3.5-flash` for general queries, `gemini-3.1-pro-preview` for complex coding/reasoning, and `gemini-3.1-flash-lite` for lightning-fast replies.\n- **Customize System Instructions:** Tweak the system prompt to customize my behavior.\n\nHow can I help you today?",
        timestamp: "Just now",
        modelUsed: "gemini-3.5-flash",
        personaName: "General AI Assistant",
      }
    ]
  }
];

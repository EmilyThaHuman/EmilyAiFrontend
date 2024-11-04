export const REACT_AGENT_CONFIG = {
  useOllamaInference: false,
  useOllamaEmbeddings: false,
  searchProvider: 'serper', // 'serper', 'google' // 'serper' is the default
  inferenceModel: 'llama-3.1-70b-versatile', // Groq: 'mixtral-8x7b-32768', 'gemma-7b-it' // OpenAI: 'gpt-3.5-turbo', 'gpt-4' // Ollama 'mistral', 'llama3' etc
  inferenceAPIKey: process.env.GROQ_API_KEY, // Groq: process.env.GROQ_API_KEY // OpenAI: process.env.OPENAI_API_KEY // Ollama: 'ollama' is the default
  embeddingsModel: 'text-embedding-3-small', // Ollama: 'llama2', 'nomic-embed-text' // OpenAI 'text-embedding-3-small', 'text-embedding-3-large'
  textChunkSize: 800, // Recommended to decrease for Ollama
  textChunkOverlap: 200, // Recommended to decrease for Ollama
  numberOfSimilarityResults: 4, // Number of similarity results to return per page
  numberOfPagesToScan: 10, // Recommended to decrease for Ollama
  nonOllamaBaseURL: 'https://api.groq.com/openai/v1', //Groq: https://api.groq.com/openai/v1 // OpenAI: https://api.openai.com/v1
  useFunctionCalling: true, // Set to true to enable function calling and conditional streaming UI (currently in beta)
  useRateLimiting: false, // Uses Upstash rate limiting to limit the number of requests per user
  useSemanticCache: false, // Uses Upstash semantic cache to store and retrieve data for faster response times
  usePortkey: false, // Uses Portkey for AI Gateway in @mentions (currently in beta) see config-tools.tsx to configure + mentionTools.tsx for source code
};

export const AI_TOOL_DEFENITIONS = [
  // Groq Models
  {
    id: 'llama3-70b-8192',
    name: 'Groq Llama3-70b-8192',
    logo: 'https://asset.brandfetch.io/idxygbEPCQ/idzCyF-I44.png?updated=1668515712972',
    functionName: 'streamChatCompletion',
    enableRAG: true,
  },
  {
    id: 'llama3-8b-8192',
    name: 'Groq Llama3-8b-8192',
    logo: 'https://asset.brandfetch.io/idxygbEPCQ/idzCyF-I44.png?updated=1668515712972',
    functionName: 'streamChatCompletion',
    enableRAG: true,
  },
  {
    id: 'mixtral-8x7b-32768',
    name: 'Groq Mixtral-8x7b-32768',
    logo: 'https://asset.brandfetch.io/idxygbEPCQ/idzCyF-I44.png?updated=1668515712972',
    functionName: 'streamChatCompletion',
    enableRAG: true,
  },
  // AI Gateway + Portkey --- ANTHROPIC
  {
    id: 'anthropic.claude-3-sonnet-20240229-v1:0',
    name: 'Anthropic Claude 3 Sonnet',
    logo: 'https://asset.brandfetch.io/idmJWF3N06/idq0tv4tfX.svg?updated=1693981852273',
    functionName: 'portKeyAIGateway',
    enableRAG: true,
  },
  {
    id: 'anthropic.claude-3-haiku-20240307-v1:0',
    name: 'Anthropic Claude 3 Haiku',
    logo: 'https://asset.brandfetch.io/idmJWF3N06/idq0tv4tfX.svg?updated=1693981852273',
    functionName: 'portKeyAIGateway',
    enableRAG: true,
  },
  // AI Gateway + Portkey --- COHERE
  {
    id: 'cohere.command-text-v14',
    name: 'Cohere Command',
    logo: 'https://asset.brandfetch.io/idyni_Sw9h/idsvG5y-ZU.png?updated=1710782726843',
    functionName: 'portKeyAIGateway',
  },
  {
    id: 'cohere.command-light-text-v14',
    name: 'Cohere Command Light',
    logo: 'https://asset.brandfetch.io/idyni_Sw9h/idsvG5y-ZU.png?updated=1710782726843',
    functionName: 'portKeyAIGateway',
  },
  // AI Gateway + Portkey --- Mistral Large
  {
    id: 'mistral.mistral-large-2402-v1:0',
    name: 'Mistral Large',
    logo: 'https://asset.brandfetch.io/iduUavnR6m/id_83EF0Fl.jpeg?updated=1717360232737',
    functionName: 'portKeyAIGateway',
    enableRAG: true,
  },
  // AI Gateway + Together.AI --- QWEN
  {
    id: 'Qwen/Qwen2-72B-Instruct',
    name: 'Qwen2 - 72B',
    logo: 'https://avatars.githubusercontent.com/u/141221163?s=200&v=4',
    functionName: 'portKeyAIGatewayTogetherAI',
    enableRAG: true,
  },
  // FAL.AI - Stable Diffusion 3 Medium
  {
    id: 'fal-ai/stable-diffusion-v3-medium',
    name: 'fal.ai Stable Diffusion 3 ',
    logo: 'https://avatars.githubusercontent.com/u/74778219?s=200&v=4',
    functionName: 'falAiStableDiffusion3Medium',
  },
  // Bright Data - Targeted Web Scraping
  {
    id: 'bright-data-web-unlock',
    name: 'Bright Data - Web Unlock / Puppeteer',
    logo: './bright-data-logo.png',
    functionName: 'brightDataWebScraper',
    enableRAG: false,
  },
  {
    id: 'analyzeUserSentiment',
    name: 'Analyze User Sentiment',
    logo: 'https://example.com/path/to/sentiment-icon.png',
    functionName: 'analyzeUserSentiment',
    enableRAG: false,
  },
  {
    id: 'getDeviceContext',
    name: 'Get Device Context',
    logo: 'https://example.com/path/to/device-context-icon.png',
    functionName: 'getDeviceContext',
    enableRAG: false,
  },
  {
    id: 'searchKnowledgeBase',
    name: 'Search Knowledge Base',
    logo: 'https://example.com/path/to/knowledge-base-icon.png',
    functionName: 'searchKnowledgeBase',
    enableRAG: true,
  },
  {
    id: 'generateRecommendations',
    name: 'Generate Recommendations',
    logo: 'https://example.com/path/to/recommendations-icon.png',
    functionName: 'generateRecommendations',
    enableRAG: true,
  },
  {
    id: 'performDataAnalysis',
    name: 'Perform Data Analysis',
    logo: 'https://example.com/path/to/data-analysis-icon.png',
    functionName: 'performDataAnalysis',
    enableRAG: true,
  },
];

export const AI_TOOL_CONFIG = {
  useMentionQueries: true,
  mentionTools: AI_TOOL_DEFENITIONS,
};

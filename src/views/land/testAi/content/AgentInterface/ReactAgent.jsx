import { Alert } from '@mui/material';
import { useChat } from 'ai/react/dist';
import { AlertCircle } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { coy } from 'react-syntax-highlighter/dist/esm/styles/prism';

import { analyzeUserSentiment } from '@/api/Ai/chat-hosted/agent/mentionFunctions/analyzeUserSentiment';
import { getDeviceContext } from '@/api/Ai/chat-hosted/agent/mentionFunctions/getDeviceContext';
import { AlertDialogDescription } from '@/components/ui/alert-dialog';
import { REACT_AGENT_CONFIG } from '@/config/ai/agent';

const { default: OpenAI } = require('openai');

const client = new OpenAI({
  baseURL: REACT_AGENT_CONFIG.nonOllamaBaseURL,
  apiKey: REACT_AGENT_CONFIG.inferenceAPIKey,
});
const MODEL = REACT_AGENT_CONFIG.inferenceModel;

const useChatAgent = () => {
  const [response, setResponse] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { messages, append } = useChat({
    api: '/api/chat',
    initialMessages: [
      {
        role: 'system',
        content: `You are an advanced AI agent capable of understanding user context, analyzing data, and providing personalized assistance. Use your available tools to provide the most relevant and helpful responses.`,
      },
    ],
    onResponse: res => setResponse(res),
    onError: err => setError(err.message),
  });
  const [deviceInfo, setDeviceInfo] = useState(null);

  // Enhanced agent function with better error handling and tool management
  const runAgent = useCallback(
    async input => {
      setLoading(true);
      setError(null);

      try {
        const messageHistory = [...messages];
        messageHistory.push({ role: 'user', content: input });
        const tools = [
          {
            type: 'function',
            function: {
              name: 'getTickers',
              description:
                'Get a single market name and stock ticker if the user mentions a public company',
              parameters: {
                type: 'object',
                properties: {
                  ticker: {
                    type: 'string',
                    description:
                      'The stock ticker symbol and market name, example NYSE:K or NASDAQ:AAPL',
                  },
                },
                required: ['ticker'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'searchPlaces',
              description:
                'ONLY SEARCH for places using the given query and location',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query for places',
                  },
                  location: {
                    type: 'string',
                    description: 'The location to search for places',
                  },
                },
                required: ['query', 'location'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'goShopping',
              description: 'Search for shopping items using the given query',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description: 'The search query for shopping items',
                  },
                },
                required: ['query'],
              },
            },
          },
          {
            type: 'function',
            function: {
              name: 'searchSong',
              description:
                'Searches for a song on Spotify based on the provided search query and returns the track ID.',
              parameters: {
                type: 'object',
                properties: {
                  query: {
                    type: 'string',
                    description:
                      'The search query to find a song on Spotify, such as the song title or artist name.',
                  },
                },
                required: ['query'],
              },
            },
          },
        ];
        // Get device context at the start of interaction
        const deviceContext = await getDeviceContext();
        setDeviceInfo(deviceContext);

        // Analyze user sentiment first
        const sentiment = await analyzeUserSentiment(input);

        for (let i = 0; i < 5; i++) {
          const response = await client.chat.completions.create({
            model: 'gpt-4',
            messages: messageHistory,
            tools: tools,
            tool_choice: 'auto',
          });

          const { finish_reason, message } = response.choices[0];

          if (finish_reason === 'tool_calls' && message.tool_calls) {
            const availableFunctions = {
              // getTickers: getTickers,
              // searchPlaces: searchPlaces,
              // goShopping: goShopping,
              // searchSong: searchSong,
            };
            const toolCall = message.tool_calls[0];
            const functionName = toolCall.function.name;
            const functionToCall = availableFunctions[functionName];
            const functionArgs = JSON.parse(toolCall.function.arguments);

            // Add context to function calls
            functionArgs.deviceContext = deviceContext;
            functionArgs.sentiment = sentiment;

            const functionResponse = await functionToCall(functionArgs);

            messageHistory.push({
              role: 'function',
              name: functionName,
              content: JSON.stringify(functionResponse),
            });
          } else if (finish_reason === 'stop') {
            messageHistory.push(message);
            setResponse(message.content);
            break;
          }
        }
      } catch (err) {
        setError(err.message);
        console.error('Agent error:', err);
      } finally {
        setLoading(false);
      }
    },
    [messages]
  );

  return { response, error, loading, messages, runAgent };
};

const CodeBlock = ({ language, value }) => {
  const [showPreview, setShowPreview] = useState(false);

  const togglePreview = () => {
    setShowPreview(!showPreview);
  };

  return (
    <div className="code-block">
      <SyntaxHighlighter language={language || 'javascript'} style={coy}>
        {value}
      </SyntaxHighlighter>
      <div className="code-buttons">
        <button onClick={togglePreview} className="preview-btn">
          {showPreview ? 'Hide Preview' : 'Preview Code'}
        </button>
      </div>
      {showPreview && (
        <div className="code-preview-container">
          <iframe
            className="code-preview-content"
            title="Code Preview"
            srcDoc={value}
            style={{ width: '100%', height: '300px', border: '1px solid #ccc' }}
          ></iframe>
        </div>
      )}
    </div>
  );
};

const Markdown = ({ content }) => (
  <ReactMarkdown
    components={{
      code({ node, inline, className, children, ...props }) {
        const match = /language-(\w+)/.exec(className || '');
        return !inline && match ? (
          <CodeBlock
            language={match[1]}
            value={String(children).replace(/\n$/, '')}
          />
        ) : (
          <code className={className} {...props}>
            {children}
          </code>
        );
      },
    }}
  >
    {content}
  </ReactMarkdown>
);

const ErrorAlert = ({ error }) => (
  <Alert variant="destructive">
    <AlertCircle className="h-4 w-4" />
    <AlertDialogDescription>{error}</AlertDialogDescription>
  </Alert>
);

const ChatInput = ({ onSend, loading }) => {
  const [input, setInput] = useState('');

  return (
    <div className="flex gap-4">
      <input
        type="text"
        value={input}
        onChange={e => setInput(e.target.value)}
        placeholder="How can I help you today?"
        className="flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-500"
      />
      <button
        onClick={() => onSend(input)}
        disabled={loading || !input.trim()}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        Send
      </button>
    </div>
  );
};

const ReactAgent = () => {
  const { response, error, loading, runAgent } = useChatAgent();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {error && <ErrorAlert error={error} />}
      <ChatInput onSend={runAgent} loading={loading} />
      {response && (
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="font-semibold text-lg mb-4">Response:</h3>
          <Markdown content={response} />
        </div>
      )}
    </div>
  );
};

export default ReactAgent;

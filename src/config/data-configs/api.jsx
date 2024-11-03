export const OPENAI_ENDPOINT = 'https://api.openai.com';
export const TTS_ENDPOINT = `${OPENAI_ENDPOINT}/v1/audio/speech`;
export const CHAT_COMPLETIONS_ENDPOINT = `${OPENAI_ENDPOINT}/v1/chat/completions`;
export const MODELS_ENDPOINT = `${OPENAI_ENDPOINT}/v1/models`;

export const REEDAI_ENDPOINT = 'http://localhost:3001';
export const HOSTED_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted`;
export const GEN_TEXT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/text-generation`;
export const GEN_TEXT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/text-generation-stream`;
export const GEN_CHAT_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion`;
export const GEN_CHAT_STREAM_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/chat-completion-stream`;
export const RAG_ENDPOINT = `${REEDAI_ENDPOINT}/api/chat/hosted/rag`;

const error404Props = {
  statusText: '404',
  message: 'Oops! Page Not Found.',
  mainText: "The page you're looking for doesn't exist or has been moved.",
  letSubTextA: 'Failed Route: ',
  subTextB: ' ~ insert error details here ~ ',
};
const error500Props = {
  statusText: '500',
  message: 'Oops! Something went wrong.',
  mainText: 'An unexpected error has occurred. Our team has been notified.',
  subTextA: 'Routing Error: ',
  subTextB: ' ~ insert error details here ~ ',
};
export const errorProps = {
  errorTypes: {
    404: error404Props,
    500: error500Props,
  },
};
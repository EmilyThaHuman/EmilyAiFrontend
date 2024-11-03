import { createAI, createStreamableValue } from 'ai/rsc/dist';
import { lookupTool } from '../mentionTools';
import { getImages, getSearchResults, getVideos } from '../searchProvider';
import {
  get10BlueLinksContents,
  processAndVectorizeContent,
} from '../contentProcessing';
import { REACT_AGENT_CONFIG } from '@/config/data-configs/agent';
import { streamChatCompletion } from './streamChatCompletion';

async function myAction(userMessage, mentionTool, logo, file) {
  const streamable = createStreamableValue({});

  (async () => {
    await checkRateLimit(streamable);
    await initializeSemanticCache();

    const cachedData = await getFromSemanticCache(userMessage);
    if (cachedData) {
      streamable.update({ cachedData });
      return;
    }

    if (mentionTool) {
      await lookupTool(mentionTool, userMessage, streamable, file);
    }

    const [images, sources, videos, conditionalFunctionCallUI] =
      await Promise.all([
        getImages(userMessage),
        getSearchResults(userMessage),
        getVideos(userMessage),
        functionCalling(userMessage),
      ]);

    streamable.update({ searchResults: sources, images, videos });

    if (REACT_AGENT_CONFIG.useFunctionCalling) {
      streamable.update({ conditionalFunctionCallUI });
    }

    const html = await get10BlueLinksContents(sources);
    const vectorResults = await processAndVectorizeContent(html, userMessage);
    const accumulatedLLMResponse = await streamChatCompletion(
      userMessage,
      vectorResults,
      streamable
    );
    const followUp = await relevantQuestions(sources, userMessage);

    streamable.update({ followUp });

    setInSemanticCache(userMessage, {
      searchResults: sources,
      images,
      videos,
      conditionalFunctionCallUI: REACT_AGENT_CONFIG.useFunctionCalling
        ? conditionalFunctionCallUI
        : undefined,
      llmResponse: accumulatedLLMResponse,
      followUp,
      semanticCacheKey: userMessage,
    });

    streamable.done({ status: 'done' });
  })();

  return streamable.value;
}

const initialAIState = [];

const initialUIState = [];

export const AI = createAI({
  actions: {
    myAction,
    clearSemanticCache,
  },
  initialUIState,
  initialAIState,
});

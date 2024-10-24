import { BasePromptGenerator } from 'components/chat';
import {
  apiChatModelSystemPromptTemplate,
  apiAssistantPromptTemplate,
  functionsToolsPromptTemplate,
  enhancedQueryPromptTemplate,
} from './prompts';

export const APIModelSystemPromptGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={apiChatModelSystemPromptTemplate}
      generatorTitle="API Chat Model Prompt Generator"
      label="System"
      onTest={onTest}
    />
  );
};

export const APIAssistantInstructionsGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={apiAssistantPromptTemplate}
      generatorTitle="API Assistant Instructions Generator"
      label="Assistant"
      onTest={onTest}
    />
  );
};

export const FunctionsToolsGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={functionsToolsPromptTemplate}
      generatorTitle="Functions and Tools Generator"
      label="Function"
      onTest={onTest}
    />
  );
};

export const EnhancedQueryOptimizerGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={enhancedQueryPromptTemplate}
      generatorTitle="Enhanced Query Optimizer"
      label="Query Optimizer"
      onTest={onTest}
    />
  );
};

export const ReedAiGenerators = {
  model: APIModelSystemPromptGenerator,
  assistant: APIAssistantInstructionsGenerator,
  tool: FunctionsToolsGenerator,
  user: EnhancedQueryOptimizerGenerator,
  code: '',
};

export default ReedAiGenerators;

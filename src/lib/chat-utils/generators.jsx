import { BasePromptGenerator } from 'components/chat';
import ReedAiLib from './prompts';

const {
  meta: { system, assistant, tools, user },
  generative: {
    pineconeAssistant,
    componentGen,
    clineArtifacts,
    openArtifacts,
  },
} = ReedAiLib;
export const APIModelSystemPromptGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={system}
      generatorTitle="API Chat Model Prompt Generator"
      label="System"
      onTest={onTest}
    />
  );
};

export const APIAssistantInstructionsGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={assistant}
      generatorTitle="API Assistant Instructions Generator"
      label="Assistant"
      onTest={onTest}
    />
  );
};

export const FunctionsToolsGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={tools}
      generatorTitle="Functions and Tools Generator"
      label="Function"
      onTest={onTest}
    />
  );
};

export const EnhancedQueryOptimizerGenerator = ({ onTest }) => {
  return (
    <BasePromptGenerator
      promptTemplate={user}
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

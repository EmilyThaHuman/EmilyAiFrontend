import { useState } from 'react';

export const useDynamicState = (space, initialData) => {
  const [files, setFiles] = useState(space === 'files' ? initialData : []);
  const [chatSessions, setChatSessions] = useState(
    space === 'chatSessions' ? initialData : []
  );
  const [assistants, setAssistants] = useState(
    space === 'assistants' ? initialData : []
  );
  const [prompts, setPrompts] = useState(
    space === 'prompts' ? initialData : []
  );
  const [presets, setPresets] = useState(
    space === 'presets' ? initialData : []
  );
  const [tools, setTools] = useState(space === 'tools' ? initialData : []);
  const [models, setModels] = useState(space === 'models' ? initialData : []);

  const stateMap = {
    files: [files, setFiles],
    chatSessions: [chatSessions, setChatSessions],
    assistants: [assistants, setAssistants],
    prompts: [prompts, setPrompts],
    presets: [presets, setPresets],
    tools: [tools, setTools],
    models: [models, setModels],
  };

  return stateMap[space] || [null, () => {}];
};

export default useDynamicState;

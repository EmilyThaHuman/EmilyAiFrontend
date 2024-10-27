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

  // Object mapping space to their respective state and setter
  const stateMap = {
    files: [files, setFiles],
    chatSessions: [chatSessions, setChatSessions],
    assistants: [assistants, setAssistants],
    prompts: [prompts, setPrompts],
    presets: [presets, setPresets],
    tools: [tools, setTools],
    models: [models, setModels],
  };

  // Return the matching state and setter, or default to null if not found
  return stateMap[space] || [null, () => {}];
};

export default useDynamicState;

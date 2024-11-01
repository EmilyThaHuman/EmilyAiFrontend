import React, { useState } from 'react';
import './SystemPromptGenerator.css';

const SystemPromptGenerator = () => {
  const [prompt, setPrompt] = useState('');
  const [expanded, setExpanded] = useState(false);

  const handleGenerate = () => {
    console.log('Generated prompt:', prompt);
  };

  return (
    <div className={`system-prompt-generator ${expanded ? 'expanded' : ''}`}>
      <div
        className="header"
        onClick={() => setExpanded(!expanded)}
        onKeyPress={e => e.key === 'Enter' && setExpanded(!expanded)}
        role="button"
        tabIndex={0}
      >
        <span>System Instructions</span>
        <button onClick={handleGenerate}>Generate</button>
      </div>
      {expanded && (
        <textarea
          value={prompt}
          onChange={e => setPrompt(e.target.value)}
          placeholder="You are a helpful assistant..."
        />
      )}
    </div>
  );
};

export default SystemPromptGenerator;

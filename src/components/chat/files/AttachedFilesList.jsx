// AttachedFilesList.jsx
import React from 'react';
import { useChatStore } from 'contexts';

const AttachedFilesList = ({ onRemoveFile }) => {
  const {
    state: { newMessageFiles },
  } = useChatStore();

  return (
    <div className="attached-files-list">
      {newMessageFiles.map(file => (
        <div key={file.id} className="attached-file">
          <span>{file.name}</span>
          <button onClick={() => onRemoveFile(file.id)}>Remove</button>
        </div>
      ))}
    </div>
  );
};

export default AttachedFilesList;

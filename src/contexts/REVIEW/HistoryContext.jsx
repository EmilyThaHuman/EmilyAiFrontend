import { createContext, useState } from 'react';

import { toast } from '@/services';

const initialValue = {
  history: [],
  currentVersion: null,
  setCurrentVersion: version => {},
  addHistory: (
    generationType,
    updateInstruction,
    referenceImages,
    initText,
    code
  ) => {},
  updateHistoryScreenshot: (img, version) => {},
  updateHistoryCode: (img, version) => {},
  resetHistory: () => {},
};

export const HistoryContext = createContext(initialValue);

export default function SettingProvider({ children }) {
  const [history, setHistory] = useState([]);
  let [currentVersion, setCurrentVersionStatus] = useState(null);

  function addHistory(
    generationType,
    updateInstruction,
    referenceImages,
    initText,
    code,
    originMessage
  ) {
    if (generationType === 'create') {
      setHistory([
        {
          type: 'ai_create',
          parentIndex: null,
          code,
          inputs: {
            image_url: referenceImages[0],
            initText,
            originMessage,
          },
        },
      ]);
      setCurrentVersionStatus(0);
    } else {
      setHistory(prev => {
        // Validate parent version
        if (currentVersion === null) {
          toast.error(
            'No parent version set. Contact support or open a Github issue.'
          );
          return prev;
        }

        const newHistory = [
          ...prev,
          {
            type: 'ai_edit',
            parentIndex: currentVersion,
            code,
            inputs: {
              prompt: updateInstruction,
              originMessage,
            },
          },
        ];
        setCurrentVersionStatus(newHistory.length - 1);
        return newHistory;
      });
    }
  }

  const updateHistoryScreenshot = (img, version) => {
    setHistory(prevState => {
      const newHistory = [...prevState];
      const index = version || currentVersion || 0;
      if (
        index !== -1 &&
        newHistory &&
        newHistory[index] &&
        !newHistory[index].isLock
      ) {
        newHistory[index].screenshot = img;
        newHistory[index].isLock = true;
      }
      return newHistory;
    });
  };

  const updateHistoryCode = (code, version) => {
    setHistory(prevState => {
      const newHistory = [...prevState];
      const index = version || currentVersion || 0;
      if (index !== -1 && newHistory && newHistory[index]) {
        newHistory[index].code = code;
      }
      return newHistory;
    });
  };

  function setCurrentVersion(version) {
    currentVersion = version;
    setCurrentVersionStatus(version);
  }

  function resetHistory() {
    setHistory([]);
    setCurrentVersionStatus(0);
  }

  return (
    <HistoryContext.Provider
      value={{
        history,
        currentVersion,
        setCurrentVersion,
        addHistory,
        updateHistoryScreenshot,
        resetHistory,
        updateHistoryCode,
      }}
    >
      {children}
    </HistoryContext.Provider>
  );
}

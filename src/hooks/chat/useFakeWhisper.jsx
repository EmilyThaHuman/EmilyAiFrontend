import { useWhisper as useRealWhisper } from '@chengsokdara/use-whisper';
import { useState } from 'react';

export const useFakeWhisper = () => {
  const [recording, setRecording] = useState(false);

  return {
    recording,
    speaking: false,
    transcribing: false,
    transcript: { text: '', blob: undefined },
    pauseRecording: () => new Promise(resolve => resolve()),
    startRecording: () =>
      new Promise(resolve => {
        setRecording(true);
        resolve();
      }),
    stopRecording: () =>
      new Promise(resolve => {
        setRecording(false);
        resolve();
      }),
  };
};

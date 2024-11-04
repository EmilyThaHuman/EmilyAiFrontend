import { createContext, useContext, useState } from 'react';

const deviceType = {
  PC: 'pc',
  MOBILE: 'mobile',
};

const initialValue = {
  enableEdit: true,
  setEnableEdit: () => {},
  device: deviceType.PC,
  setDevice: () => {},
};

export const EditorContext = createContext(initialValue);

export function EditorProvider({ children }) {
  const [enableEdit, setEnableEdit] = useState(true);
  const [device, setDevice] = useState(deviceType.PC);

  return (
    <EditorContext.Provider
      value={{
        enableEdit,
        setEnableEdit,
        device,
        setDevice,
      }}
    >
      {children}
    </EditorContext.Provider>
  );
}

export const useEditorStore = () => useContext(EditorContext);

export default EditorProvider;

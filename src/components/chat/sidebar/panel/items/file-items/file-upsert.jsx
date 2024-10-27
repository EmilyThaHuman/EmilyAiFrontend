import { Divider } from '@mui/material';
import { useState } from 'react';

import { attachmentsApi } from 'api/Ai/chat-sessions';
import { StyledButton } from 'components/chat/styled';
import {
  RCSelect,
  SelectFieldSection,
  TextAreaAutosizeSection,
  TextFieldSection,
} from 'components/themed';
import { useChatStore } from 'contexts/ChatProvider';

export function FileUpsert() {
  const {
    state: { folders },
  } = useChatStore();
  const fileFolder = folders?.find(folder => folder.space === 'files');
  const [url, setUrl] = useState('');
  const [library, setLibrary] = useState('');
  const [message, setMessage] = useState('');
  const [description, setDescription] = useState('');
  const reactUILibraries = [
    'Material-UI (MUI)',
    'ShadCn',
    'Chakra UI',
    'Ant Design',
    'React Bootstrap',
    'Semantic UI React',
    'Tailwind CSS',
    'Styled Components',
    'Rebass',
    'Reactstrap',
    'Blueprint',
  ];
  const handleSubmit = async e => {
    e.preventDefault();
    try {
      const response = await attachmentsApi.upsertFileData({
        url,
        library,
        description,
        userId: sessionStorage.getItem('userId'),
        workspaceId: sessionStorage.getItem('workspaceId'),
        folderId: fileFolder._id,
      });
      console.log('RESPONSE:', response);
      setMessage(response);
    } catch (error) {
      console.error(error);
      setMessage('Error upserting documentation.');
    }
  };

  return (
    <>
      <div className="UpsertDocsForm">
        <h2>Upsert Documentation</h2>
        <form onSubmit={handleSubmit}>
          <TextFieldSection
            label="Library Component URL"
            placeholder="https://example.com"
            value={url}
            onChange={e => setUrl(e.target.value)}
            variant="darkMode"
            fullWidth
          />
          <Divider sx={{ my: 2 }} />
          <SelectFieldSection
            value={library}
            onChange={e => setLibrary(e.target.value)}
            label="Library"
            placeholder="Select a library"
            options={reactUILibraries}
            variant="textfield"
            sx={{ mb: 2 }}
          />
          <Divider sx={{ my: 2 }} />
          <TextAreaAutosizeSection
            label="File Content"
            minRows={3}
            maxRows={5}
            placeholder="File content..."
            variant="darkMode"
            value={description}
            onChange={e => setDescription(e.target.value)}
          />
          <Divider sx={{ my: 2 }} />
          <StyledButton variant="outlined" type="submit">
            Submit
          </StyledButton>
        </form>
      </div>
      {message && <p>{message}</p>}
    </>
  );
}

export default FileUpsert;

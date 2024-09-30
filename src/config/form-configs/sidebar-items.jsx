export const chatFormConfigs = {
  files: {
    sections: [
      {
        label: 'File',
        component: 'Button',
        props: {
          variant: 'contained',
          component: 'label',
          sx: { marginTop: 1 },
          children: (
            <>
              Upload File
              <input type="file" hidden accept="{acceptedFileTypes}" />
            </>
          ),
        },
      },
      {
        label: 'File Name',
        component: 'TextFieldSection',
        props: {
          label: 'File Name',
          placeholder: 'File name...',
          variant: 'darkMode',
          fullWidth: true,
        },
        stateKey: 'fileName',
      },
      {
        label: 'File Description',
        component: 'TextAreaAutosizeSection',
        props: {
          label: 'File Description',
          minRows: 3,
          maxRows: 5,
          placeholder: 'File description...',
          variant: 'darkMode',
        },
        stateKey: 'description',
        conditional: 'isEditMode',
      },
      {
        label: 'File Content',
        component: 'TextAreaAutosizeSection',
        props: {
          label: 'File Content',
          minRows: 3,
          maxRows: 5,
          placeholder: 'File content...',
          variant: 'darkMode',
        },
        stateKey: 'fileContent',
        conditional: 'isEditMode && selectedFile',
      },
      {
        label: 'File Details',
        component: 'Box',
        props: { mt: 2 },
        children: [
          {
            type: 'p',
            content: `<strong>Type:</strong> {selectedFile?.type || 'N/A'}`,
          },
          {
            type: 'p',
            content: `<strong>Size:</strong> {selectedFile?.size ? formatFileSize(selectedFile.size) : 'N/A'}`,
          },
          {
            type: 'p',
            content: `<strong>Last Modified:</strong> {selectedFile?.lastModified ? new Date(selectedFile.lastModified).toLocaleString() : 'N/A'}`,
          },
        ],
        conditional: 'isEditMode && selectedFile',
      },
    ],
  },

  prompts: {
    sections: [
      {
        label: 'Name',
        component: 'TextFieldSection',
        props: {
          label: 'Name',
          variant: 'darkMode',
          fullWidth: true,
        },
        stateKey: 'promptData.name',
      },
      {
        label: 'Content',
        component: 'TextAreaAutosizeSection',
        props: {
          label: 'Content',
          minRows: 10,
          placeholder: 'Enter your prompt here...',
          variant: 'darkMode',
        },
        stateKey: 'promptData.content',
      },
      {
        label: 'Role',
        component: 'TextFieldSection',
        props: {
          label: 'Role',
          variant: 'darkMode',
          fullWidth: true,
        },
        stateKey: 'promptData.role',
      },
      {
        label: 'Description',
        component: 'TextAreaAutosizeSection',
        props: {
          label: 'Description',
          minRows: 10,
          placeholder: 'Enter a description for your prompt...',
          variant: 'darkMode',
        },
        stateKey: 'promptData.description',
      },
    ],
  },

  tools: {
    sections: [
      {
        label: 'Name',
        component: 'Input',
        props: {
          placeholder: 'Tool name...',
          maxLength: 100,
        },
        stateKey: 'name',
      },
      {
        label: 'Description',
        component: 'Input',
        props: {
          placeholder: 'Tool description...',
          maxLength: 250,
        },
        stateKey: 'description',
      },
      {
        label: 'Custom Headers',
        component: 'TextareaAutosize',
        props: {
          placeholder: '{"X-api-key": "1234567890"}',
          minRows: 1,
        },
        stateKey: 'customHeaders',
      },
      {
        label: 'Schema',
        component: 'TextareaAutosize',
        props: {
          placeholder: `
          {
            "openapi": "3.1.0",
            "info": {"title": "Get weather data", "version": "v1.0.0"},
            "paths": {"/location": { "get": { "description": "Get temperature" }}}
          }`,
          minRows: 15,
        },
        stateKey: 'schema',
        validation: 'validateOpenAPI',
      },
    ],
  },
  // More sections like assistants, chatSessions, models, and presets can be added similarly...
};

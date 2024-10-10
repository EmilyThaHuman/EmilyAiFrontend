const CHAT_CONFIG = {
  Chat: {
    SubTitle: count => `Total of ${count} conversations`,
    Actions: {
      ChatList: 'View message list',
      Export: 'Export chat history',
      Copy: 'Copy',
      Stop: 'Stop',
      Retry: 'Retry',
      Pin: 'Pin',
      PinToastContent: '1 conversation has been pinned to preset prompts',
      PinToastAction: 'View',
      Delete: 'Delete',
      Edit: 'Edit',
      FullScreen: 'Full screen',
      RefreshTitle: 'Refresh title',
      RefreshToast: 'Refresh title request has been sent',
    },
  },
  Export: {
    Title: 'Share Chat History',
    Copy: 'Copy All',
    Download: 'Download File',
    Share: 'Share to ShareGPT',
    Format: {
      Title: 'Export Format',
      SubTitle: 'Can export as Markdown text or PNG image',
    },
  },
  Settings: {
    Title: 'Settings',
    SubTitle: 'All Settings Options',
    ShowPassword: 'Show Password',
    Lang: {
      Name: 'Language',
      All: 'All Languages',
    },
    FontSize: {
      Title: 'Font Size',
      SubTitle: 'Font size of chat content',
    },
  },
};

export * from './AppProvider';
export * from './ChatProvider';
// export * from './ColorModeProvider';
export * from './Providers';
export * from './SidebarProvider';
export * from './UserProvider';
export * from './ToastProvider';
export * from './ErrorProvider';
export * from './LoadingProvider';
export * from './CustomThemeProvider';

import { useAppStore } from './AppProvider';
import { useChatStore } from './ChatProvider';
import { useColorMode } from './CustomThemeProvider';
import { useErrorStore } from './ErrorProvider';
import { useLoadingStore } from './LoadingProvider';
import { useToastStore } from './ToastProvider';
import { useUserStore } from './UserProvider';

export default {
  useChatStore,
  useUserStore,
  useAppStore,
  useToastStore,
  useColorMode,
  useErrorStore,
  useLoadingStore,
};

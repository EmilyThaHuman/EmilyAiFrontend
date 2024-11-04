import { SidebarProvider } from 'components/ui/sidebar';
import ContextErrorBoundary from 'utils/app/ContextErrorBoundary';

import * as providers from './index';

const ProviderWrapper = ({ children }) => {
  const providerList = [
    providers.ErrorProvider,
    providers.ToastProvider,
    providers.AppProvider,
    providers.UserProvider,
    providers.ChatProvider,
    providers.LoadingProvider,
    providers.EditorProvider,
    SidebarProvider,
  ];
  return providerList.reduce(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
};

export const Providers = ({ children }) => {
  return (
    <ContextErrorBoundary>
      <ProviderWrapper>{children}</ProviderWrapper>
    </ContextErrorBoundary>
  );
};

export default Providers;

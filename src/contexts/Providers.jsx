import ContextErrorBoundary from 'utils/app/ContextErrorBoundary';

import * as providers from './index';

const ProviderWrapper = ({ children }) => {
  const providerList = [
    providers.ColorModeProvider,
    providers.ToastProvider,
    providers.AppProvider,
    providers.UserProvider,
    providers.ChatProvider,
  ];
  return providerList.reduce(
    (acc, Provider) => <Provider>{acc}</Provider>,
    children
  );
};
export const Providers = ({ children }) => {
  return (
    <ContextErrorBoundary>
      <CopilotKit runtimeUrl="/api/copilotkit">
        <ProviderWrapper>{children}</ProviderWrapper>
      </CopilotKit>
    </ContextErrorBoundary>
  );
};

export default Providers;

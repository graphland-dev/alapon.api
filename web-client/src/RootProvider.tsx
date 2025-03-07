import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { QueryClientProvider } from '@tanstack/react-query';
import { Provider as JotaiProvider } from 'jotai';
import { jotaiStore } from './common/configs/jotai.store-config';
import { mantineThemeConfig } from './common/configs/mantine.config';
import { tanstackQueryClient } from './common/configs/tanstack-query-client';

function RootProvider({ children }: { children: React.ReactNode }) {
  console.log('Rendering RootProvider');

  return (
    <>
      <QueryClientProvider client={tanstackQueryClient}>
        <MantineProvider
          withCssVariables
          withGlobalClasses
          theme={mantineThemeConfig}
        >
          <ModalsProvider>
            <Notifications position="top-center" />
            <JotaiProvider store={jotaiStore}>
              {/* <RootAppWrapper> */}
              {children}
              {/* </RootAppWrapper> */}
            </JotaiProvider>
          </ModalsProvider>
        </MantineProvider>
      </QueryClientProvider>
    </>
  );
}

export default RootProvider;

import { MantineProvider } from '@mantine/core';
import { mantineThemeConfig } from '../configs/mantine.config';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Provider as JotaiProvider } from 'jotai';
import { jotaiStore } from '../configs/jotai.store-config';
import { PropsWithChildren } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { tanstackQueryClient } from '../configs/tanstack-query-client';

const AppCommonProvider: React.FC<PropsWithChildren> = ({ children }) => {
  return (
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
  );
};

export default AppCommonProvider;

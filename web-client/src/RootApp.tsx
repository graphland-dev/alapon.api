import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Provider as JotaiProvider } from 'jotai';
import { DevTools as JotaiDevtools } from 'jotai-devtools';
import { RouterProvider } from 'react-router-dom';
import { apolloClient } from './common/clients/apollo.client';
import { jotaiStore } from './common/configs/jotai.store-config';
import { mantineThemeConfig } from './common/configs/mantine.config';
import { AppRoute } from './root.router';
import RootAppWrapper from './common/components/RootAppWrapper';

function RootApp() {
  console.log('Rendering RootApp');

  return (
    <>
      <ApolloProvider client={apolloClient}>
        <MantineProvider
          withCssVariables
          withGlobalClasses
          theme={mantineThemeConfig}
        >
          <ModalsProvider>
            <Notifications position="top-center" />
            <JotaiDevtools store={jotaiStore} />
            <JotaiProvider store={jotaiStore}>
              <RootAppWrapper>
                <RouterProvider router={AppRoute} />
              </RootAppWrapper>
            </JotaiProvider>
          </ModalsProvider>
        </MantineProvider>
      </ApolloProvider>
    </>
  );
}

export default RootApp;

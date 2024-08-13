import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { Provider as JotaiProvider } from 'jotai';
import { RouterProvider } from 'react-router-dom';
import { apolloClient } from './common/clients/apollo.client';
import RootAppWrapper from './common/components/RootAppWrapper';
import { jotaiStore } from './common/configs/jotai.store-config';
import { mantineThemeConfig } from './common/configs/mantine.config';
import { AppRoute } from './root.router';

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
            {/* {import.meta.env.NODE_ENV !== 'prod' && (
              <JotaiDevtools store={jotaiStore} />
            )} */}
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

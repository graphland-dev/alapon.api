import { RouterProvider } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { AppRoute } from './root.router';
import { mantineThemeConfig } from './common/configs/mantine.config';
import { ApolloProvider } from '@apollo/client';
import { apolloClient } from './common/clients/apollo.client';

function RootApp() {
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
            <RouterProvider router={AppRoute} />
          </ModalsProvider>
        </MantineProvider>
      </ApolloProvider>
    </>
  );
}

export default RootApp;

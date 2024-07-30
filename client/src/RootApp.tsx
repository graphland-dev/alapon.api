import { ApolloProvider } from '@apollo/client';
import { MantineProvider } from '@mantine/core';
import { ModalsProvider } from '@mantine/modals';
import { Notifications } from '@mantine/notifications';
import { useEffect } from 'react';
import { RouterProvider } from 'react-router-dom';
import { apolloClient } from './common/clients/apollo.client';
import socket from './common/clients/socket.io';
import { mantineThemeConfig } from './common/configs/mantine.config';
import { AppRoute } from './root.router';
import { socketConnectedAtom } from './common/states/socketAtom';
import { useAtom } from 'jotai';

function RootApp() {
  console.log('Rendering RootApp');
  const [, setSocketConnected] = useAtom(socketConnectedAtom);

  useEffect(() => {
    socket.connect();

    socket.on('connect', () => {
      setSocketConnected(true);
    });

    socket.on('disconnect', () => {
      setSocketConnected(false);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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

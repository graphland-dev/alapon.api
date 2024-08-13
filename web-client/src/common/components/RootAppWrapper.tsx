import { useAtom, useAtomValue } from 'jotai';
import { loadingUserAtom, userAtom } from '../states/user.atom';
import React, { PropsWithChildren, useEffect } from 'react';
import socket from '../clients/socket.io';
import { ApolloError, gql, useQuery } from '@apollo/client';
import { User } from '../api-models/graphql';
import { LoadingOverlay } from '@mantine/core';
import { $triggerRefetchMe } from '../rxjs-controllers';

const GET_USER_QUERIES = gql`
  query GET_USER_QUERIES {
    identity__me {
      _id
      handle
      referenceHandle
      accountStatus
      lastLoginAt
      createdAt
      updatedAt
    }
  }
`;

const RootAppWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  console.log('RootAppWrapper 1.0.0');
  const authUser = useAtomValue(userAtom);
  const [, setGlobalUser] = useAtom(userAtom);
  const [, setLoadingUser] = useAtom(loadingUserAtom);

  const {
    loading,
    data,
    refetch: refetchMe,
  } = useQuery<{
    identity__me: User;
  }>(GET_USER_QUERIES, {
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted(data) {
      // console.log('AuthGuard:GET_USER_QUERIES', { data });
      setGlobalUser(data?.identity__me);
      setLoadingUser(false);
    },
    onError: (error: ApolloError) => {
      setLoadingUser(false);
      console.error('RootAppWrapper', 'unAuthorized', JSON.stringify(error));
    },
  });

  useEffect(() => {
    socket.connect();
    $triggerRefetchMe.subscribe(() => {
      refetchMe();
    });
  }, []);

  useEffect(() => {
    if (!authUser) return;

    socket.emit('join-socket', { userId: authUser?._id });
    console.log('join-socket', authUser?._id);

    return () => {
      socket.disconnect();
      socket.emit('leave-socket', { userId: authUser?._id });
    };
  }, [data?.identity__me]);

  return (
    <div area-label="root-app-wrapper" className="relative">
      <LoadingOverlay
        visible={loading}
        opacity={10000}
        overlayProps={{
          blur: 1000,
        }}
      />
      {children}
    </div>
  );
};

export default RootAppWrapper;

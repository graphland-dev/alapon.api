import { userAtom } from '@/common/states/user.atom';
import { ApolloError, gql, useQuery } from '@apollo/client';
import { LoadingOverlay } from '@mantine/core';
import { useAtom } from 'jotai';
import React, { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '../api-models/graphql';
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

export const AuthGuardedWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [, setGlobalUser] = useAtom(userAtom);

  const { loading, refetch } = useQuery<{
    identity__me: User;
  }>(GET_USER_QUERIES, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      console.log('AuthGuard:GET_USER_QUERIES', { data });
      setGlobalUser(data?.identity__me);
    },
    onError: (error: ApolloError) => {
      console.log('AuthGuard', { error });
      navigate('/auth/login');
    },
  });

  useEffect(() => {
    $triggerRefetchMe.subscribe(() => {
      refetch();
    });
  }, []);

  return (
    <div className="relative">
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

export const PublicGuardedWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const navigate = useNavigate();

  const [, setGlobalUser] = useAtom(userAtom);

  const { loading, refetch } = useQuery<{
    identity__me: User;
  }>(GET_USER_QUERIES, {
    fetchPolicy: 'network-only',
    onCompleted(data) {
      console.log('AuthGuard:GET_USER_QUERIES', { data });
      setGlobalUser(data?.identity__me);
      navigate('/chat');
    },
    onError: (error: ApolloError) => {
      console.log('AuthGuard', { error });
    },
  });

  useEffect(() => {
    $triggerRefetchMe.subscribe(() => {
      refetch();
    });
  }, []);

  return (
    <div className="relative">
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

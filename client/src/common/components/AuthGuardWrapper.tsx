import { loadingUserAtom, userAtom } from '@/common/states/user.atom';
import { useAtomValue } from 'jotai';
import React, { PropsWithChildren, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthGuardedWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const navigate = useNavigate();
  const authUser = useAtomValue(userAtom);
  const authUserLoading = useAtomValue(loadingUserAtom);

  useEffect(() => {
    if (!authUser && !authUserLoading) navigate('/auth/login');
  }, [authUser, authUserLoading]);

  return <>{children}</>;
};

export const PublicGuardedWrapper: React.FC<PropsWithChildren> = ({
  children,
}) => {
  const navigate = useNavigate();
  const authUser = useAtomValue(userAtom);
  const authUserLoading = useAtomValue(loadingUserAtom);

  useEffect(() => {
    if (authUser && !authUserLoading) navigate('/chat');
  }, [authUser, authUserLoading]);

  return <>{children}</>;
};

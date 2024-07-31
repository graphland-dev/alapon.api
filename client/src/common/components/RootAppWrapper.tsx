import { useAtomValue } from 'jotai';
import { userAtom } from '../states/user.atom';
import React, { PropsWithChildren, useEffect } from 'react';
import socket from '../clients/socket.io';

const RootAppWrapper: React.FC<PropsWithChildren> = ({ children }) => {
  const authUser = useAtomValue(userAtom);

  useEffect(() => {
    if (!authUser) return;
    // console.log('user', authUser);
    socket.connect();
    socket.emit('join-socket', { userId: authUser?._id });

    return () => {
      socket.disconnect();
      socket.emit('leave-socket', { userId: authUser?._id });
    };
  }, [authUser]);

  return <>{children}</>;
};

export default RootAppWrapper;

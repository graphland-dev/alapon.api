import { socketAtom } from '@/common/states/socketAtom';
import { userAtom } from '@/common/states/user.atom';
import { useAtomValue } from 'jotai';
import React from 'react';

interface Props {
  roomId: string;
}

const RoomMessageComposer: React.FC<Props> = ({ roomId }) => {
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);
  const [message, setMessage] = React.useState('');

  const handleSendMessage = () => {
    socket.emit(`send-room-message`, {
      roomId: roomId,
      message: message,
      userId: authUser?._id,
      userHandle: authUser?.handle,
    });
    setMessage('');
  };

  return (
    <div>
      <input
        type="text"
        className="w-full h-full px-2 py-1 rounded-md"
        placeholder="Type and hit enter"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            handleSendMessage();
          }
        }}
      />
    </div>
  );
};

export default RoomMessageComposer;

import { socketAtom } from '@/common/states/socket-io.atom';
import { userAtom } from '@/common/states/user.atom';
import { Text } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { Mic, Video } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { ISocketCallDto } from '../models/chat.model';

interface Props {
  roomId: string;
}

const JoinCallModal: React.FC<Props> = ({ roomId }) => {
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);
  const navitate = useNavigate();

  const joinCall = (e: React.MouseEvent<HTMLButtonElement>) => {
    const callType = e.currentTarget.dataset.callType as 'video' | 'audio';
    socket.emit('emit:chat:join-call', {
      roomId,
      userHandle: authUser?.handle,
      userId: authUser?._id,
    } satisfies ISocketCallDto);
    navitate(`/chat/${roomId}/${callType}-call`, { replace: true });
  };

  return (
    <div>
      <Text size="lg">Join call</Text>

      <div className="flex flex-col gap-4 mt-4">
        <button
          data-call-type="video"
          onClick={joinCall}
          className="flex items-center gap-2 p-4 border-2 rounded-md border-zinc-200 hover:border-zinc-500"
        >
          <Video />
          <Text>With Video</Text>
        </button>
        <button
          data-call-type="audio"
          onClick={joinCall}
          className="flex items-center gap-2 p-4 border-2 rounded-md border-zinc-200 hover:border-zinc-500"
        >
          <Mic />
          <Text>With Audio Only</Text>
        </button>
      </div>
    </div>
  );
};

export default JoinCallModal;

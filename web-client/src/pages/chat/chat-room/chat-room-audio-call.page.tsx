import { useNavigate, useParams } from 'react-router-dom';
import ChatRoomCall from './_components/ChatRoomCall';
import { useAtomValue } from 'jotai';
import { socketAtom } from '@/common/states/socket-io.atom';
import { userAtom } from '@/common/states/user.atom';
import { ISocketCallDto } from './models/chat.model';

const ChatRoomAudioCallPage = () => {
  const patams = useParams<{ roomId: string }>();
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);
  const navigate = useNavigate();

  return (
    <ChatRoomCall
      roomId={patams.roomId!}
      joinWithAudio={true}
      joinWithVideo={false}
      onLeave={() => {
        socket.emit('emit:chat:leave-call', {
          roomId: patams.roomId,
          userHandle: authUser?.handle,
          userId: authUser?._id,
        } satisfies ISocketCallDto);
        navigate(`/chat/${patams.roomId}`);
      }}
    />
  );
};

export default ChatRoomAudioCallPage;

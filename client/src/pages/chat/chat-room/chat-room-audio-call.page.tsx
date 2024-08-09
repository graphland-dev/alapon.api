import { socketAtom } from '@/common/states/socket-io.atom';
import { userAtom } from '@/common/states/user.atom';
import { useAtomValue } from 'jotai';
import { useNavigate, useParams } from 'react-router-dom';
import ChatRoomCall from './_components/ChatRoomCall';
import { ISocketCallInitiateDto } from './models/chat.model';

const ChatRoomAudioCallPage = () => {
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);
  const patams = useParams<{ roomId: string }>();
  const navigate = useNavigate();

  return (
    <ChatRoomCall
      roomId={patams.roomId!}
      joinWithAudio={true}
      joinWithVideo={false}
      onLeave={() => {
        navigate(`/chat/${patams.roomId}`);
      }}
      onJoin={() => {
        socket.emit('emit:chat:initiate-call', {
          roomId: patams.roomId,
          userHandle: authUser?.handle,
          userId: authUser?._id,
        } satisfies ISocketCallInitiateDto);
      }}
    />
  );
};

export default ChatRoomAudioCallPage;

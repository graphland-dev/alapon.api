import { useNavigate, useParams } from 'react-router-dom';
import ChatRoomCall from './_components/ChatRoomCall';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/common/states/user.atom';
import { socketAtom } from '@/common/states/socket-io.atom';
import { ISocketCallInitiateDto } from './models/chat.model';

const ChatRoomVideoCallPage = () => {
  const patams = useParams<{ roomId: string }>();
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);
  const navigate = useNavigate();

  return (
    <ChatRoomCall
      roomId={patams.roomId!}
      joinWithAudio={true}
      joinWithVideo={true}
      key={patams.roomId}
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

export default ChatRoomVideoCallPage;

import { useNavigate, useParams } from 'react-router-dom';
import ChatRoomCall from './_components/ChatRoomCall';
import { socketAtom } from '@/common/states/socket-io.atom';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/common/states/user.atom';
import { ISocketCallDto } from './models/chat.model';

const ChatRoomVideoCallPage = () => {
  const patams = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);

  return (
    <ChatRoomCall
      roomId={patams.roomId!}
      joinWithAudio={true}
      joinWithVideo={true}
      key={patams.roomId}
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

export default ChatRoomVideoCallPage;

import { ChatRoom, ChatRoomType } from '@/common/api-models/graphql';
import { $triggerRefetchChatRooms } from '@/common/rxjs-controllers';
import { userAtom } from '@/common/states/user.atom';
import { useMutation, useQuery } from '@apollo/client';
import { openConfirmModal } from '@mantine/modals';
import { useAtomValue } from 'jotai';
import { useNavigate, useParams } from 'react-router-dom';
import ChatRoomHeader from './_components/ChatRoomHeader';
import RoomMessagesTrack from './_components/RoomMessagesTrack';
import {
  CHAT_ROOM_DETAILS_QUERY,
  LEAVE_CHAT_ROOM_MUTATION,
} from './utils/query';
import RoomMessageComposer from './_components/ChatComposer/RoomMessageComposer';

const ChatRoomPage = () => {
  const patams = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const authUser = useAtomValue(userAtom);

  const { data: chatRoomData, loading } = useQuery<{
    chat__chatRoom: ChatRoom;
  }>(CHAT_ROOM_DETAILS_QUERY, {
    skip: patams.roomId === undefined,
    variables: { roomId: patams.roomId },
  });

  const [leaveChatRoom] = useMutation(LEAVE_CHAT_ROOM_MUTATION, {
    onCompleted() {
      $triggerRefetchChatRooms.next(true);
      navigate('/chat');
    },
    onError(error) {
      alert(error.message);
    },
  });

  const getHandleName = () => {
    if (chatRoomData?.chat__chatRoom.roomType === ChatRoomType.Group) {
      return chatRoomData?.chat__chatRoom.handle;
    }
    return chatRoomData?.chat__chatRoom.members!.find(
      (member) => member.handle !== authUser?.handle,
    )?.handle;
  };

  const handleLeaveChat = () => {
    openConfirmModal({
      title: 'Are you sure you want to leave this chat?',
      labels: { confirm: 'Leave', cancel: 'Cancel' },
      onConfirm: () => {
        leaveChatRoom({ variables: { roomId: patams.roomId } });
      },
    });
  };

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top Bar */}
      <ChatRoomHeader
        roomHandle={getHandleName() || ''}
        roomId={patams.roomId || ''}
        loading={loading}
      />

      {/* Chat Room Messages timeline */}
      <RoomMessagesTrack roomId={patams.roomId!} />

      {/* Input area */}
      <div className="flex-none p-2 pt-0 shadow-md">
        <RoomMessageComposer roomId={patams.roomId!} />
      </div>
    </div>
  );
};

export default ChatRoomPage;

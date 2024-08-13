import { ChatRoom, ChatRoomType } from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socket-io.atom';
import { userAtom } from '@/common/states/user.atom';
import { useQuery } from '@apollo/client';
import { Modal } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import RoomMessageComposer from './_components/ChatComposer/RoomMessageComposer';
import ChatRoomHeader from './_components/ChatRoomHeader';
import JoinCallModal from './_components/JoinCallModal';
import RoomMessagesTrack from './_components/RoomMessagesTrack';
import { ISocketCallDto } from './models/chat.model';
import { CHAT_ROOM_DETAILS_QUERY } from './utils/query';

const ChatRoomPage = () => {
  const patams = useParams<{ roomId: string }>();
  const socket = useAtomValue(socketAtom);

  const { data: chatRoomData, loading } = useQuery<{
    chat__chatRoom: ChatRoom;
  }>(CHAT_ROOM_DETAILS_QUERY, {
    skip: patams.roomId === undefined,
    variables: { roomId: patams.roomId },
  });

  const [joinCallModalOpened, joinCallModalOpenedHandler] =
    useDisclosure(false);

  const authUser = useAtomValue(userAtom);

  const [isCallOngoing, isCallOngoingHandler] = useDisclosure(false);

  // const [leaveChatRoom] = useMutation(LEAVE_CHAT_ROOM_MUTATION, {
  //   onCompleted() {
  //     $triggerRefetchChatRooms.next(true);
  //     navigate('/chat');
  //   },
  //   onError(error) {
  //     alert(error.message);
  //   },
  // });

  const getHandleName = () => {
    if (chatRoomData?.chat__chatRoom.roomType === ChatRoomType.Group) {
      return chatRoomData?.chat__chatRoom.handle;
    }
    return chatRoomData?.chat__chatRoom.members!.find(
      (member) => member.handle !== authUser?.handle,
    )?.handle;
  };

  // const handleLeaveChat = () => {
  //   openConfirmModal({
  //     title: 'Are you sure you want to leave this chat?',
  //     labels: { confirm: 'Leave', cancel: 'Cancel' },
  //     onConfirm: () => {
  //       leaveChatRoom({ variables: { roomId: patams.roomId } });
  //     },
  //   });
  // };

  useEffect(() => {
    socket.on(
      `listen:chat:${patams.roomId}:ongoing-call`,
      (data: ISocketCallDto) => {
        console.log('listen:chat:${patams.roomId}:ongoing-call', data);
        if (data.isOngoingCall) {
          isCallOngoingHandler.open();
          joinCallModalOpenedHandler.open();
        }

        if (!data.isOngoingCall) {
          isCallOngoingHandler.close();
        }
      },
    );

    if (chatRoomData?.chat__chatRoom.isOngoingCall) {
      isCallOngoingHandler.open();
    }
  }, [chatRoomData?.chat__chatRoom.isOngoingCall]);

  return (
    <>
      <div className="flex flex-col justify-between h-full">
        {/* Top Bar */}
        <ChatRoomHeader
          roomHandle={getHandleName() || ''}
          roomId={patams.roomId || ''}
          loading={loading}
          isCallOngoing={isCallOngoing}
          onClickJoinCall={joinCallModalOpenedHandler.open}
        />

        {/* Chat Room Messages timeline */}
        <RoomMessagesTrack roomId={patams.roomId!} />

        {/* Input area */}
        <div className="flex-none p-2 pt-0 shadow-md">
          <RoomMessageComposer roomId={patams.roomId!} />
        </div>
      </div>
      <Modal
        opened={joinCallModalOpened}
        onClose={joinCallModalOpenedHandler.close}
      >
        <JoinCallModal roomId={patams.roomId!} />
      </Modal>
    </>
  );
};

export default ChatRoomPage;

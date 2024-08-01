import { ChatRoom, ChatRoomType } from '@/common/api-models/graphql';
import { userAtom } from '@/common/states/user.atom';
import { useMutation, useQuery } from '@apollo/client';
import { Menu, Skeleton } from '@mantine/core';
import { IconChevronLeft, IconDotsVertical } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import RoomMessageComposer from './_components/RoomMessageComposer';
import RoomMessages from './_components/RoomMessages';
import {
  CHAT_ROOM_DETAILS_QUERY,
  LEAVE_CHAT_ROOM_MUTATION,
} from './utils/query';
import { openConfirmModal } from '@mantine/modals';
import { $triggerRefetchChatRooms } from '@/common/rxjs-controllers';

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
      <div className="px-2 py-2 bg-white h-[65px] flex-none shadow-sm">
        <div className="flex items-center justify-between gap-1">
          {/* Left Side */}
          <div className="flex items-center gap-1">
            <Link to={`/chat`} className="md:hidden">
              <IconChevronLeft />
            </Link>

            <div className="flex flex-col gap-1">
              {loading ? (
                <>
                  <Skeleton height={20} width={200} />
                  <Skeleton height={10} width={100} />
                </>
              ) : (
                <>
                  <p className="text-md">@{getHandleName()}</p>
                  {chatRoomData?.chat__chatRoom.roomType ===
                  ChatRoomType.Group ? (
                    <p className="text-xs">
                      {chatRoomData?.chat__chatRoom?.members?.length} members
                    </p>
                  ) : (
                    <p className="text-xs">
                      Last message sent at{' '}
                      {new Date(
                        chatRoomData?.chat__chatRoom.updatedAt,
                      ).toDateString()}
                    </p>
                  )}
                </>
              )}
            </div>
          </div>

          {/* Room Action Menu */}
          <Menu>
            <Menu.Target>
              <button className="btn btn-ghost btn-circle">
                <IconDotsVertical size={18} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={handleLeaveChat}>Leave chat</Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
      </div>

      {/* Chat Room Messages timeline */}
      <RoomMessages roomId={patams.roomId!} />

      {/* Input area */}
      <div className="flex-none p-2 pt-0 shadow-md">
        <RoomMessageComposer roomId={patams.roomId!} />
      </div>
    </div>
  );
};

export default ChatRoomPage;

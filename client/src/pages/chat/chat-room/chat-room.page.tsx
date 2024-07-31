import { ChatRoom, ChatRoomType } from '@/common/api-models/graphql';
import { userAtom } from '@/common/states/user.atom';
import { useQuery } from '@apollo/client';
import { Skeleton } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { useRef } from 'react';
import { Link, useParams } from 'react-router-dom';
import RoomMessageComposer from './_components/RoomMessageComposer';
import RoomMessages from './_components/RoomMessages';
import { CHAT_ROOM_DETAILS_QUERY } from './utils/query';

const ChatRoomPage = () => {
  const patams = useParams<{ roomId: string }>();
  const authUser = useAtomValue(userAtom);
  const messageBottomRef = useRef<HTMLDivElement>(null);
  const { data: chatRoomData, loading } = useQuery<{
    chat__chatRoom: ChatRoom;
  }>(CHAT_ROOM_DETAILS_QUERY, {
    skip: patams.roomId === undefined,
    variables: { roomId: patams.roomId },
  });

  // const scrollToBottom = () => {
  //   document
  //     .getElementById('chat-room-messages-timeline-bottom')
  //     ?.scrollIntoView({ behavior: 'smooth' });
  // };

  const getHandleName = () => {
    if (chatRoomData?.chat__chatRoom.roomType === ChatRoomType.Group) {
      return chatRoomData?.chat__chatRoom.handle;
    }
    return chatRoomData?.chat__chatRoom.members!.find(
      (member) => member.handle !== authUser?.handle,
    )?.handle;
  };

  // useEffect(() => {
  //   // scrollToBottom();
  // }, [patams?.roomId]);

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top Bar */}
      <div className="px-2 py-2 bg-white h-[65px] flex-none shadow-sm">
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
      </div>

      {/* Chat Room Messages timeline */}
      <div
        className="relative flex flex-col flex-auto gap-2 px-2 overflow-y-auto"
        id="chat-room-messages-timeline"
      >
        <RoomMessages roomId={patams.roomId!} />
        <div
          data-name="timeline-bottom"
          ref={messageBottomRef}
          id="chat-room-messages-timeline-bottom"
        />
      </div>

      {/* Input area */}
      <div className="flex-none p-2 pt-0 shadow-md">
        <RoomMessageComposer roomId={patams.roomId!} />
      </div>
    </div>
  );
};

export default ChatRoomPage;

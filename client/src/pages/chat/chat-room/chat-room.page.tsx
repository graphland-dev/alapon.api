import { useQuery } from '@apollo/client';
import CharRoomMessage from './_components/CharRoomMessage';
import { CHAT_ROOM_DETAILS_QUERY } from './utils/query';
import { useParams } from 'react-router-dom';
import { ChatRoom, ChatRoomType } from '@/common/api-models/graphql';
import { Skeleton } from '@mantine/core';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/common/states/user.atom';
import RoomMessages from './_components/RoomMessages';

const ChatRoomPage = () => {
  const patams = useParams<{ roomId: string }>();
  const authUser = useAtomValue(userAtom);
  const { data: chatRoomData, loading } = useQuery<{
    chat__chatRoom: ChatRoom;
  }>(CHAT_ROOM_DETAILS_QUERY, {
    skip: patams.roomId === undefined,
    variables: { roomId: patams.roomId },
  });

  const getHandleName = () => {
    if (chatRoomData?.chat__chatRoom.roomType === ChatRoomType.Group) {
      return chatRoomData?.chat__chatRoom.handle;
    }
    return chatRoomData?.chat__chatRoom.members!.find(
      (member) => member.handle !== authUser?.handle,
    )?.handle;
  };

  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top Bar */}
      <div className="px-2 py-2 bg-white h-[65px] flex-none shadow-sm">
        <div className="flex flex-col gap-1">
          {loading ? (
            <>
              <Skeleton height={20} width={200} />
              <Skeleton height={10} width={100} />
            </>
          ) : (
            <>
              <p className="text-md">@{getHandleName()}</p>
              {chatRoomData?.chat__chatRoom.roomType === ChatRoomType.Group ? (
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

      {/* Chat Room Messages timeline */}
      <div className="flex flex-col flex-auto gap-4 p-10 overflow-y-auto">
        <RoomMessages roomId={patams.roomId!} />
      </div>

      {/* Input area */}
      <div className="h-[65px] flex-none p-3 bg-slate-200">
        <input
          type="text"
          className="w-full h-full px-2 py-1 rounded-md"
          placeholder="Type and hit enter"
        />
      </div>
    </div>
  );
};

export default ChatRoomPage;

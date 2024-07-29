import { ChatRoomsWithPagination } from '@/common/api-models/graphql';
import { gql, useQuery } from '@apollo/client';
import { Menu, Skeleton } from '@mantine/core';
import ChatRoomItem from './ChatRoomItem';
import { useAtomValue } from 'jotai';
import { userAtom } from '@/common/states/user.atom';
import { IconDotsVertical, IconPlus } from '@tabler/icons-react';

const MY_CHAT_ROOMS_QUERY = gql`
  query Chat__myChatRooms($where: CommonPaginationOnlyDto) {
    chat__myChatRooms(where: $where) {
      nodes {
        _id
        handle
        isNsfw
        roomType
      }
    }
  }
`;

const ChatSidebar = () => {
  const authUser = useAtomValue(userAtom);
  const { data, loading } = useQuery<{
    chat__myChatRooms: ChatRoomsWithPagination;
  }>(MY_CHAT_ROOMS_QUERY, { variables: { where: { limit: -1 } } });

  return (
    <div className="flex flex-col h-full">
      <div className="h-[65px] flex-none flex items-center gap-2 px-2 justify-between">
        <p>@{authUser?.handle}</p>

        <Menu>
          <Menu.Target>
            <button className="btn btn-ghost btn-circle">
              <IconPlus />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item>Join in person</Menu.Item>
            <Menu.Item>Create Group</Menu.Item>
            <Menu.Item>Join Group</Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </div>
      <div className="flex-auto overflow-y-auto">
        {loading && (
          <div className="flex flex-col gap-1 m-1">
            {Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} height={65} width="100%" />
            ))}
          </div>
        )}

        {data?.chat__myChatRooms.nodes?.map((room) => (
          <ChatRoomItem key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;

import { gql, useQuery } from '@apollo/client';
import ChatRoomItem from './ChatRoomItem';
import { ChatRoomsWithPagination } from '@/common/api-models/graphql';

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
  const { data, loading } = useQuery<{
    chat__myChatRooms: ChatRoomsWithPagination;
  }>(MY_CHAT_ROOMS_QUERY, { variables: { where: { limit: -1 } } });

  return (
    <div className="flex flex-col h-full">
      <div className="h-[65px] flex-none">@user</div>
      <div className="flex-auto overflow-y-auto">
        {data?.chat__myChatRooms.nodes?.map((room) => (
          <ChatRoomItem key={room._id} room={room} />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;

import { gql, useQuery } from '@apollo/client';
import CharRoomMessage from './CharRoomMessage';
import { ChatMessagesWithPagination } from '@/common/api-models/graphql';

const ROOM_MESSAGES_QUERY = gql`
  query Chat__roomMessages($roomId: String!, $where: CommonPaginationOnlyDto) {
    chat__roomMessages(roomId: $roomId, where: $where) {
      nodes {
        _id
        messageType
        text
        createdAt
        updatedAt
        createdBy {
          _id
          handle
        }
        chatRoom {
          _id
          handle
        }
      }
    }
  }
`;

interface Props {
  roomId: string;
}

const RoomMessages: React.FC<Props> = ({ roomId }) => {
  const { data, loading } = useQuery<{
    chat__roomMessages: ChatMessagesWithPagination;
  }>(ROOM_MESSAGES_QUERY, {
    variables: {
      roomId: roomId,
      where: {
        sortBy: 'createdAt',
        sort: 'ASC',
        limit: -1,
      },
    },
    skip: roomId === undefined,
  });

  return (
    <>
      {data?.chat__roomMessages.nodes!.map((message) => (
        <CharRoomMessage key={message._id} message={message} />
      ))}
    </>
  );
};

export default RoomMessages;

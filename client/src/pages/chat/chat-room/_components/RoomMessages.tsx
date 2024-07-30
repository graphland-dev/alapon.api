import {
  ChatMessage,
  ChatMessagesWithPagination,
} from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socketAtom';
import { gql, useLazyQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import CharRoomMessage from './CharRoomMessage';

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
  // console.log('Rendering RoomMessages');
  const socket = useAtomValue(socketAtom);
  const [messages, setMessages] = useState<ChatMessage[]>([]);

  const [fetchRoomMessages] = useLazyQuery<{
    chat__roomMessages: ChatMessagesWithPagination;
  }>(ROOM_MESSAGES_QUERY, {
    variables: {
      roomId: roomId,
      where: {
        sortBy: 'createdAt',
        sort: 'ASC',
        limit: 50,
      },
    },
    onCompleted: (data) => {
      setMessages((messages) => [
        ...messages,
        ...data.chat__roomMessages.nodes!,
      ]);
    },
  });

  useEffect(() => {
    console.log('room-messages', roomId);
    const handleMessage = (message: any) => {
      console.log('Received message from socket', message);
    };
    socket.emit(`join-room`, roomId);
    socket.on(`room-messages:${roomId}`, handleMessage);

    return () => {
      socket.off(`room-messages:${roomId}`, handleMessage);
      socket.emit(`leave-room`, roomId);
    };
  }, []);

  return (
    <>
      {messages!.map((message) => (
        <CharRoomMessage message={message} key={message?._id} />
      ))}
    </>
  );
};

export default RoomMessages;

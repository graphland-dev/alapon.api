import {
  ChatMessage,
  ChatMessagesWithPagination,
} from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socketAtom';
import { gql, useLazyQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import CharRoomMessage from './ChatRoomMessage';
import { userAtom } from '@/common/states/user.atom';

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
  onMyMessageArrived?: () => void;
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
        sort: 'DESC',
        limit: 100,
      },
    },
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      const apiReversedMessages = [...data.chat__roomMessages.nodes!].reverse();
      setMessages((messages) => [...messages, ...apiReversedMessages]);

      document.getElementById('timeline-bottom')?.scrollIntoView({
        behavior: 'smooth',
      });
    },
  });

  useEffect(() => {
    if (!roomId) return;
    socket.emit(`join-room`, roomId);
    const handleMessage = (message: ChatMessage) => {
      setMessages((messages) => [...messages, message]);
      setTimeout(() => {
        const scrollTopPosition =
          document.getElementById('messages-timeline')?.scrollTop;
        const scrollHeight =
          document.getElementById('messages-timeline')?.scrollHeight;
        console.log(scrollHeight! - scrollTopPosition!);
        console.log('scroll-top-position', scrollTopPosition);
        console.log('scroll-height', scrollHeight);
        const fiftyPercent = scrollHeight! * 0.5;
        if (scrollHeight! - scrollTopPosition! < fiftyPercent) {
          document.getElementById('messages-timeline')?.scrollTo({
            top: scrollHeight,
            behavior: 'smooth',
          });
        }
      }, 500);
    };
    socket.on(`room-messages:${roomId}`, handleMessage);

    fetchRoomMessages();
    return () => {
      socket.emit(`leave-room`, roomId);
      socket.off(`room-messages:${roomId}`);
      setMessages([]);
    };
  }, [roomId]);

  return (
    <>
      {messages!.map((message) => (
        <CharRoomMessage message={message} key={message?._id} />
      ))}
    </>
  );
};

export default RoomMessages;

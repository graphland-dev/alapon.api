import {
  ChatMessage,
  ChatMessagesWithPagination,
} from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socketAtom';
import { gql, useLazyQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { messageSendByCurrentUserSubject } from '../utils/chat-controller.rxjs';
import CharRoomMessage from './ChatRoomMessage';

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
  const [visibleScrollBottom, setVisibleScrollBottom] = useState(false);

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
    },
  });

  useEffect(() => {
    if (!roomId) return;
    socket.emit(`join-room`, roomId);
    const handleMessage = (message: ChatMessage) => {
      const audio = new Audio('/chat.mp3');
      audio.play();

      document.title = `New Message - ${message.createdBy?.handle}`;
      setTimeout(() => {
        document.title = `Blackout Chat`;
      }, 3000);

      setMessages((messages) => [...messages, message]);
      setTimeout(() => {
        const scrollTop =
          document.getElementById('chat-room-messages-timeline')?.scrollTop ||
          0;

        const scrollHeight =
          document.getElementById('chat-room-messages-timeline')
            ?.scrollHeight || 0;

        const offsetHeight =
          document.getElementById('chat-room-messages-timeline')
            ?.offsetHeight || 0;

        const scrollDistance = scrollHeight - scrollTop - offsetHeight;
        console.log('-----------');
        console.log('scrollHeight', scrollHeight);
        console.log('scrollTop', scrollTop);
        console.log('scrollDistance', scrollDistance);
        console.log(
          'offsetTop',
          document.getElementById('chat-room-messages-timeline')?.offsetTop,
        );
        console.log(
          'offsetHeight',
          document.getElementById('chat-room-messages-timeline')?.offsetHeight,
        );

        if (scrollDistance < 1000) {
          document
            .getElementById('chat-room-messages-timeline-bottom')
            ?.scrollIntoView({
              behavior: 'smooth',
            });
        } else {
          setVisibleScrollBottom(true);
        }
      });
    };

    socket.on(`room-messages:${roomId}`, handleMessage);

    fetchRoomMessages();
    return () => {
      socket.emit(`leave-room`, roomId);
      socket.off(`room-messages:${roomId}`);
      setMessages([]);
    };
  }, [roomId]);

  useEffect(() => {
    messageSendByCurrentUserSubject.subscribe((message) => {
      setMessages((messages) => [...messages, message]);
      setTimeout(() => {
        setVisibleScrollBottom(false);
        document
          .getElementById('chat-room-messages-timeline-bottom')
          ?.scrollIntoView({
            behavior: 'smooth',
          });
      });
    });
  }, []);

  return (
    <>
      {visibleScrollBottom && (
        <button
          onClick={() => {
            document
              .getElementById('chat-room-messages-timeline-bottom')
              ?.scrollIntoView({
                behavior: 'smooth',
              });
            setVisibleScrollBottom(false);
          }}
          className="fixed flex items-center bottom-[80px] -translate-x-[50%] right-[10px] z-50 bg-green-500 text-primary-foreground px-4 rounded-sm shadow-lg"
        >
          <p>New Message(s)</p>
        </button>
      )}

      {messages!.map((message) => (
        <CharRoomMessage message={message} key={message?._id} />
      ))}
    </>
  );
};

export default RoomMessages;

import {
  ChatMessage,
  ChatMessagesWithPagination,
} from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socket-io.atom';
import { gql, useQuery } from '@apollo/client';
import { useCounter } from '@mantine/hooks';
import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { messageSendByCurrentUserSubject } from '../utils/chat-controller.rxjs';
import CharRoomMessage from './ChatRoomMessage';
import LoadMoreButton from './LoadMoreButton';
import UnreadMessagesAlert from './UnreadMessagesAlert';

const ROOM_MESSAGES_QUERY = gql`
  query Chat__roomMessages($roomId: String!, $where: CommonPaginationOnlyDto) {
    chat__roomMessages(roomId: $roomId, where: $where) {
      meta {
        totalCount
        hasNextPage
      }
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

const RoomMessagesTrack: React.FC<Props> = ({ roomId }) => {
  const socket = useAtomValue(socketAtom);
  const [messagesPageIndex, messagesPageIndexHandler] = useCounter(1);
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visibleScrollBottom, setVisibleScrollBottom] = useState(false);

  const messagesTrackRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = (isSmooth = true) => {
    document
      .getElementById('chat-room-messages-timeline-bottom')
      ?.scrollIntoView({ behavior: isSmooth ? 'smooth' : 'auto' });
  };

  const roomMessagesQuery = useQuery<{
    chat__roomMessages: ChatMessagesWithPagination;
  }>(ROOM_MESSAGES_QUERY, {
    variables: {
      roomId: roomId,
      where: {
        sortBy: 'createdAt',
        sort: 'DESC',
        limit: 20,
        page: messagesPageIndex,
      },
    },
    fetchPolicy: 'network-only',
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      console.log(data.chat__roomMessages.nodes?.map((m) => m.text).join('\n'));
      const apiReversedMessages = [...data.chat__roomMessages.nodes!].reverse();
      setMessages((messages) => [...apiReversedMessages, ...messages]);
      setTimeout(() => {
        if (messagesPageIndex === 1) {
          scrollToBottom(false);
        }
      });
    },
  });

  useEffect(() => {
    if (!roomId) return;

    // Join room
    socket.emit(`emit:chat:join-room`, { roomId });

    const handleSocketNewMessages = (message: ChatMessage) => {
      console.log(`🔌 listen:chat:${roomId}:messages`, message);

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

        if (scrollDistance < 1000) {
          scrollToBottom();
        } else {
          setVisibleScrollBottom(true);
          setUnreadMessagesCount((count) => count + 1);
        }
      });
    };

    socket.on(`listen:chat:${roomId}:messages`, handleSocketNewMessages);
    console.log(`🔌 listen:chat:${roomId}:messages`);

    return () => {
      socket.emit(`emit:chat:leave-room`, { roomId });
      socket.off(`listen:chat:${roomId}:messages`);
      setMessages([]);
      setTimeout(() => {
        messagesPageIndexHandler.set(1);
      });
    };
  }, [roomId]);

  useEffect(() => {
    // Listen for self message emit
    messageSendByCurrentUserSubject.subscribe((message) => {
      setMessages((messages) => [...messages, message]);
      setTimeout(() => {
        setVisibleScrollBottom(false);
        scrollToBottom();
      });
    });
  }, []);

  return (
    <div
      className="relative flex flex-col flex-auto gap-2 px-2 overflow-y-auto"
      id="chat-room-messages-timeline"
      ref={messagesTrackRef}
    >
      <UnreadMessagesAlert
        unreadMessagesCount={unreadMessagesCount}
        visible={visibleScrollBottom}
        onClick={() => {
          setUnreadMessagesCount(0);
          setVisibleScrollBottom(false);
          scrollToBottom();
        }}
      />

      {roomMessagesQuery.data?.chat__roomMessages.meta?.hasNextPage ? (
        <LoadMoreButton
          loading={roomMessagesQuery.loading}
          onClick={() => {
            messagesPageIndexHandler.increment();
          }}
        />
      ) : (
        <div className="flex-1" />
      )}

      {messages!.map((message) => (
        <CharRoomMessage message={message} key={message?._id} />
      ))}

      <div
        data-name="timeline-bottom"
        id="chat-room-messages-timeline-bottom"
      />
    </div>
  );
};

export default RoomMessagesTrack;

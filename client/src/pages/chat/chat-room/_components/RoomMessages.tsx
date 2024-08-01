import {
  ChatMessage,
  ChatMessagesWithPagination,
} from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socket-io.atom';
import { gql, useLazyQuery } from '@apollo/client';
import { useAtomValue } from 'jotai';
import { useEffect, useState } from 'react';
import { messageSendByCurrentUserSubject } from '../utils/chat-controller.rxjs';
import CharRoomMessage from './ChatRoomMessage';
import { LoadingOverlay } from '@mantine/core';

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
  const [unreadMessagesCount, setUnreadMessagesCount] = useState(0);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [visibleScrollBottom, setVisibleScrollBottom] = useState(false);

  const scrollToBottom = (isSmooth = true) => {
    // const timelineDivHeight =
    //   document.getElementById('chat-room-messages-timeline')?.scrollHeight || 0;
    // document.getElementById('chat-room-messages-timeline-bottom')?.scroll({
    //   left: 0,
    //   top: -timelineDivHeight,
    //   behavior: 'smooth',
    // });
    document
      .getElementById('chat-room-messages-timeline-bottom')
      ?.scrollIntoView({ behavior: isSmooth ? 'smooth' : 'auto' });
  };

  const [fetchRoomMessages, fetchRoomMessagesState] = useLazyQuery<{
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
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const apiReversedMessages = [...data.chat__roomMessages.nodes!].reverse();
      // const apiReversedMessages = [...data.chat__roomMessages.nodes!];
      setMessages((messages) => [...messages, ...apiReversedMessages]);
      setTimeout(() => {
        scrollToBottom(false);
      });
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
      console.log('🔌 room-messages:', message);

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
        // console.log('-----------');
        // console.log('scrollHeight', scrollHeight);
        // console.log('scrollTop', scrollTop);
        // console.log('scrollDistance', scrollDistance);
        // console.log(
        //   'offsetTop',
        //   document.getElementById('chat-room-messages-timeline')?.offsetTop,
        // );
        // console.log(
        //   'offsetHeight',
        //   document.getElementById('chat-room-messages-timeline')?.offsetHeight,
        // );

        if (scrollDistance < 1000) {
          scrollToBottom();
        } else {
          setVisibleScrollBottom(true);
          setUnreadMessagesCount((count) => count + 1);
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
    >
      <LoadingOverlay visible={fetchRoomMessagesState.loading} />

      {visibleScrollBottom && (
        <button
          onClick={() => {
            setUnreadMessagesCount(0);
            setVisibleScrollBottom(false);
            scrollToBottom();
          }}
          className="fixed flex items-center bottom-[80px] -translate-x-[50%] right-[10px] z-50 bg-green-500 text-primary-foreground px-4 rounded-sm shadow-lg"
        >
          <p>New Message ({unreadMessagesCount})</p>
        </button>
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

export default RoomMessages;

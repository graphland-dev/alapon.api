import { RouteObject } from 'react-router-dom';
import ChatLayout from './layout/chat.layout';
import ChatRoomPage from './chat-room/chat-room.page';
import NoChatRoomScreen from './components/NoChatRoomScreen';
import ChatSidebar from './layout/_components/ChatSidebar';
import { useMediaQuery } from '@mantine/hooks';
import ChatRoomAudioCallPage from './chat-room/chat-room-audio-call.page';
import ChatRoomVideoCallPage from './chat-room/chat-room-video-call.page';

const ChatRootApp = () => {
  const isMD = useMediaQuery('(min-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <div className="h-full">
      {isMD && <NoChatRoomScreen />}
      {isMobile && <ChatSidebar />}
    </div>
  );
};

export const chatRouter: RouteObject[] = [
  {
    path: '',
    element: <ChatLayout />,
    children: [
      {
        path: '',
        element: <ChatRootApp />,
      },
      {
        path: ':roomId',
        children: [
          {
            path: '',
            element: <ChatRoomPage />,
          },
          {
            path: 'video-call',
            element: <ChatRoomVideoCallPage />,
          },
          {
            path: 'audio-call',
            element: <ChatRoomAudioCallPage />,
          },
        ],
      },
      {
        path: '*',
        element: <div>Not Found</div>,
      },
    ],
  },
];

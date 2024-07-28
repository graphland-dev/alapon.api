import { RouteObject } from 'react-router-dom';
import ChatLayout from './chat.layout';
import ChatRoomPage from './chat-room/chat-room.page';
import NoChatRoomScreen from './components/NoChatRoomScreen';

export const chatRouter: RouteObject[] = [
  {
    path: '',
    element: <ChatLayout />,
    children: [
      {
        path: '',
        element: <NoChatRoomScreen />,
      },
      {
        path: ':roomId',
        element: <ChatRoomPage />,
      },
      {
        path: '*',
        element: <div>Not Found</div>,
      },
    ],
  },
];

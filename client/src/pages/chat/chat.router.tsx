import { RouteObject } from 'react-router-dom';
import ChatLayout from './chat.layout';
import ChatRoomPage from './chat-room/chat-room.page';
import NoChatRoomScreen from './components/NoChatRoomScreen';
import ChatSidebar from './components/ChatSidebar';

export const chatRouter: RouteObject[] = [
  {
    path: '',
    element: <ChatLayout />,
    children: [
      {
        path: '',
        element: (
          <div className="h-full">
            <div className="hidden h-full md:block">
              <NoChatRoomScreen />
            </div>
            <div className="md:hidden">
              <ChatSidebar />
            </div>
          </div>
        ),
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

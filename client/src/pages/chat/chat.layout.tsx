import { Outlet } from 'react-router-dom';
import ChatSidebar from './components/ChatSidebar';

const ChatLayout = () => {
  return (
    <>
      <div area-label="chat-layout" className="flex h-[100dvh]">
        <div
          area-label="chat-room-list"
          className="w-[300px] flex-none bg-background hidden md:block"
        >
          <ChatSidebar />
        </div>
        <div area-label="chat-main" className="flex-auto h-[100dvh]">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ChatLayout;

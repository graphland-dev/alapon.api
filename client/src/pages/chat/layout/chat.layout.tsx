import { Outlet } from 'react-router-dom';
import ChatSidebar from './_components/ChatSidebar';

const ChatLayout = () => {
  return (
    <>
      <div area-label="chat-layout" className="flex h-[100dvh]">
        <div
          area-label="chat-room-list"
          className="w-[300px] flex-none bg-background hidden md:block h-[100dvh]"
        >
          <ChatSidebar />
        </div>
        <div area-label="chat-outlet" className="flex-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ChatLayout;

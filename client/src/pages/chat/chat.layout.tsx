import { Outlet } from 'react-router-dom';
import ChatSidebar from './components/ChatSidebar';

const ChatLayout = () => {
  return (
    <>
      {/* Desktop View */}
      <div className="flex h-screen">
        <div className="w-[300px] flex-none bg-background hidden md:block">
          <ChatSidebar />
        </div>
        <div className="flex-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default ChatLayout;

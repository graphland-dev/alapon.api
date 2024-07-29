import { Outlet } from 'react-router-dom';
import ChatSidebar from './components/ChatSidebar';

const ChatLayout = () => {
  return (
    <>
      {/* Desktop View */}
      <div className="hidden h-screen md:flex">
        <div className="w-[300px] flex-none bg-background">
          <ChatSidebar />
        </div>
        <div className="flex-auto">
          <Outlet />
        </div>
      </div>

      <div className="md:hidden">
        <Outlet />
      </div>
    </>
  );
};

export default ChatLayout;

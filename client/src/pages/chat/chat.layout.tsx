import { Outlet } from 'react-router-dom';
import ChatSidebar from './components/ChatSidebar';

const ChatLayout = () => {
  return (
    <div className="chat-app">
      <div className="chat-app__sidebar">
        <ChatSidebar />
      </div>
      <div className="chat-app__main">
        <Outlet />
      </div>
    </div>
  );
};

export default ChatLayout;

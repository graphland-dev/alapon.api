import ChatRoomItem from './ChatRoomItem';

const ChatSidebar = () => {
  return (
    <div className="flex flex-col h-full">
      <div className="h-[65px] flex-none">@user</div>
      <div className="flex-auto overflow-y-auto">
        {Array.from({ length: 100 }).map((_, i) => (
          <ChatRoomItem key={i} />
        ))}
      </div>
    </div>
  );
};

export default ChatSidebar;

import CharRoomMessage from './_components/CharRoomMessage';

const ChatRoomPage = () => {
  return (
    <div className="flex flex-col justify-between h-full">
      {/* Top Bar */}
      <div className="px-2 py-2 bg-white h-[65px] flex-none">
        <p className="text-md">@luc_zone</p>
        <p className="mt-1 text-xs">1432 members</p>
        {/* <p className="mt-1 text-xs italic">@merlin is typing...</p> */}
      </div>

      {/* Chat Room Messages timeline */}
      <div className="flex flex-col flex-auto gap-4 p-10 overflow-y-auto">
        {Array.from({ length: 50 }).map((_, i) => (
          <CharRoomMessage key={i} />
        ))}
      </div>

      {/* Input area */}
      <div className="h-[65px] flex-none p-3 bg-slate-200">
        <input
          type="text"
          className="w-full h-full px-2 py-1 rounded-md"
          placeholder="Type and hit enter"
        />
      </div>
    </div>
  );
};

export default ChatRoomPage;

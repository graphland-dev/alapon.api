import { ChatRoom, ChatRoomType } from '@/common/api-models/graphql';
import { userAtom } from '@/common/states/user.atom';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { Link, useParams } from 'react-router-dom';

interface Props {
  room: ChatRoom;
}
const ChatRoomItem: React.FC<Props> = ({ room }) => {
  const params = useParams<{ roomId: string }>();
  const authUser = useAtomValue(userAtom);

  const getHandleName = () => {
    if (room.roomType === ChatRoomType.Group) {
      return room.handle;
    }
    return room.members!.find((member) => member.handle !== authUser?.handle)
      ?.handle;
  };

  return (
    <Link
      className={clsx(
        'flex gap-2 p-3 border-b cursor-pointer hover:bg-zinc-100',
        { 'bg-zinc-100': params.roomId === room._id },
      )}
      to={`/chat/${room?._id}`}
      data-room-id={room?._id}
    >
      {/* <div>
        <img
          className="w-12 h-12 rounded-full "
          src="https://avatars.githubusercontent.com/u/7611746?v=4"
          alt={room?.handle || ''}
        />
      </div> */}
      <div className="flex flex-col items-start gap-1">
        <p>@{getHandleName()}</p>
        {room.roomType === ChatRoomType.Group && (
          <p className="px-1 text-xs rounded-sm bg-primary text-primary-foreground">
            {room.roomType}
          </p>
        )}
        {room.lastMessage && (
          <div className="flex flex-col">
            <p className="text-xs truncate text-zinc-500">
              {room.lastMessageSender && (
                <b>{room.lastMessageSender?.handle}:</b>
              )}
              {room.lastMessage?.text}
            </p>
            <p className="text-xs text-zinc-500">{room._id}</p>
          </div>
        )}
      </div>
    </Link>
  );
};

export default ChatRoomItem;

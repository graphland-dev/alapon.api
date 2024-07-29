import { ChatRoom } from '@/common/api-models/graphql';
import clsx from 'clsx';
import { Link, useParams } from 'react-router-dom';

interface Props {
  room: ChatRoom;
}
const ChatRoomItem: React.FC<Props> = ({ room }) => {
  const params = useParams<{ roomId: string }>();
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
        <p>@{room.handle}</p>
        <p className="px-1 text-xs rounded-sm bg-primary text-primary-foreground">
          {room.roomType}
        </p>
        {/* <p className="text-sm text-zinc-500">Vai kemon achen???</p> */}
      </div>
    </Link>
  );
};

export default ChatRoomItem;

import { MessageSquarePlus } from 'lucide-react';

interface Props {
  unreadMessagesCount: number;
  visible: boolean;
  onClick?: () => void;
}

const UnreadMessagesAlert: React.FC<Props> = ({
  unreadMessagesCount,
  visible,
  onClick,
}) => {
  if (!visible) return null;

  return (
    <button
      onClick={onClick}
      className="fixed py-1 px-4 flex items-center bottom-[80px] -translate-x-[50%] z-50 bg-green-500 text-primary-foreground rounded-sm shadow-lg left-[50%]"
    >
      {/* <p>New Message ({unreadMessagesCount})</p> */}
      <MessageSquarePlus size={22} />
      {unreadMessagesCount > 0 && (
        <p className="ml-2 text-lg">New Message ({unreadMessagesCount})</p>
      )}
    </button>
  );
};

export default UnreadMessagesAlert;

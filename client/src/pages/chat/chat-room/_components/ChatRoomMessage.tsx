import { ChatMessage, ChatMessageType } from '@/common/api-models/graphql';
import { userAtom } from '@/common/states/user.atom';
import clsx from 'clsx';
import { useAtomValue } from 'jotai';
import { formatChatText } from '../utils/message.util';

interface Props {
  message: ChatMessage;
}

const CharRoomMessage: React.FC<Props> = ({ message }) => {
  const authUser = useAtomValue(userAtom);

  switch (message?.messageType) {
    case ChatMessageType.SystemMessage:
      return (
        <p className="text-sm italic text-center text-slate-600">
          {message?.text}
        </p>
      );
    case ChatMessageType.UserMessage:
      return (
        <div
          data-message-id={message?._id}
          data-user-id={message?.createdBy?._id}
          data-room-id={message?.chatRoom?._id}
          className={clsx('flex', {
            'justify-end': message?.createdBy?._id === authUser?._id,
          })}
        >
          <div
            className={clsx('p-2 rounded-md max-w-[80%]', {
              'bg-white': message?.createdBy?._id !== authUser?._id,
              'bg-primary text-primary-foreground':
                message?.createdBy?._id == authUser?._id,
            })}
          >
            <p className="text-xs font-semibold">
              @{message?.createdBy?.handle}
            </p>
            <div
              className="whitespace-pre-wrap chat-message-text"
              dangerouslySetInnerHTML={{
                __html: formatChatText(message?.text || ''),
              }}
            ></div>
          </div>
        </div>
      );
  }
};

export default CharRoomMessage;

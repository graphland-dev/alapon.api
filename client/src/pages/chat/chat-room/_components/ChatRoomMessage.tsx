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
        <p
          data-message-id={message?._id}
          data-user-id={message?.createdBy?._id}
          data-room-id={message?.chatRoom?._id}
          data-message-type={message?.messageType}
          className="text-sm italic text-center text-slate-600"
        >
          {message?.text}
        </p>
      );
    case ChatMessageType.UserMessage:
      return (
        <div
          data-message-id={message?._id}
          data-user-id={message?.createdBy?._id}
          data-room-id={message?.chatRoom?._id}
          data-message-type={message?.messageType}
          className={clsx('chat-message-bubble', {
            'chat-message-bubble--oposition':
              message?.createdBy?._id !== authUser?._id,
            'chat-message-bubble--self':
              message?.createdBy?._id == authUser?._id,
          })}
        >
          {message?.createdBy?._id !== authUser?._id && (
            <p className="chat-message-bubble__user-handle">
              @{message?.createdBy?.handle}
            </p>
          )}

          <div
            className="chat-message-bubble__content"
            dangerouslySetInnerHTML={{
              __html: formatChatText(message?.text || ''),
            }}
          />
          <p className="chat-message-bubble__time">
            {new Date(message?.createdAt).toLocaleTimeString()}
          </p>
        </div>
      );
  }
};

export default CharRoomMessage;

import { ChatMessage, ChatMessageType } from '@/common/api-models/graphql';

interface Props {
  message: ChatMessage;
}

const CharRoomMessage: React.FC<Props> = ({ message }) => {
  switch (message?.messageType) {
    case ChatMessageType.SystemMessage:
      return (
        <p className="text-sm italic text-center text-slate-500">
          {message?.text}
        </p>
      );
    case ChatMessageType.UserMessage:
      return (
        <div className="p-2 rounded-md max-w-[200px] bg-white">
          <p className="text-xs font-semibold">@merlin</p>
          <p>{message?.text}</p>
        </div>
      );
  }
};

export default CharRoomMessage;

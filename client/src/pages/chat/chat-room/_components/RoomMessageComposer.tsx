import { ChatMessageType } from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socketAtom';
import { userAtom } from '@/common/states/user.atom';
import { UnstyledButton } from '@mantine/core';
import { IconSend2 } from '@tabler/icons-react';

import { useAtomValue } from 'jotai';
import React, { useCallback, useRef } from 'react';
import { messageSendByCurrentUserSubject } from '../utils/chat-controller.rxjs';

interface Props {
  roomId: string;
}

const RoomMessageComposer: React.FC<Props> = ({ roomId }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);
  const [message, setMessage] = React.useState('');

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      if (textarea.scrollHeight > 250) {
        textarea.style.height = '250px';
        textarea.style.overflowY = 'auto';
      } else {
        textarea.style.height = `${textarea.scrollHeight}px`;
      }
    }
  };

  const handleSendMessage = () => {
    if (!message) return;

    socket.emit(`send-room-message`, {
      roomId: roomId,
      messageText: message.trim(),
      userId: authUser?._id,
      userHandle: authUser?.handle,
    });
    setMessage('');
    messageSendByCurrentUserSubject.next({
      _id: window.crypto.randomUUID(),
      text: message.trim(),
      chatRoom: { _id: roomId as string },
      messageType: ChatMessageType.UserMessage,
      createdBy: {
        _id: authUser?._id as string,
        handle: authUser?.handle as string,
      },
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    adjustTextareaHeight();
  };

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLTextAreaElement>) => {
      setMessage(event.target.value);
      adjustTextareaHeight();
    },
    [],
  );

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
      adjustTextareaHeight();
      if (event.key === 'Enter') {
        if (event.shiftKey || event.ctrlKey || event.metaKey) {
          event.preventDefault();
          setMessage((prevMessage) => prevMessage + '\n');
          setTimeout(() => {
            adjustTextareaHeight();
          }, 0);
        } else {
          handleSendMessage();
          event.preventDefault();
        }
      }
    },
    [message],
  );

  return (
    <div className="relative">
      <textarea
        ref={textareaRef}
        style={{ overflow: 'hidden', resize: 'none' }} // Ensure no overflow
        className="w-full h-full p-3 focus:outline-none chat-input-shadow"
        placeholder="Type and hit enter"
        value={message}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
      />

      <UnstyledButton
        className="absolute right-2 top-1"
        onClick={handleSendMessage}
      >
        <IconSend2 className="text-slate-500" />
      </UnstyledButton>
    </div>
  );
};

export default RoomMessageComposer;

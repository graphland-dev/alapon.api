import { uid } from 'radash';
import { ChatMessageType } from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socket-io.atom';
import { userAtom } from '@/common/states/user.atom';
import { Popover, UnstyledButton } from '@mantine/core';
import emojiPickerData from '@emoji-mart/data';
import EmojiPicker from '@emoji-mart/react';

import { useAtomValue } from 'jotai';
import React, { useCallback, useRef } from 'react';
import { messageSendByCurrentUserSubject } from '../../utils/chat-controller.rxjs';
import { SmilePlus, SendHorizontal } from 'lucide-react';

interface Props {
  roomId: string;
}

const RoomMessageComposer: React.FC<Props> = ({ roomId }) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [emojiPickerOpened, setEmojiPickerOpened] = React.useState(false);

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
      _id: uid(35),
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
    <div area-label="room-message-composer" className="relative">
      <textarea
        area-label="room-message-composer-input"
        ref={textareaRef}
        style={{ overflow: 'hidden', resize: 'none' }} // Ensure no overflow
        className="w-full h-full p-3 focus:outline-none chat-input-shadow"
        placeholder="Type and hit enter"
        value={message}
        rows={1}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        data-gramm="false"
        data-gramm_editor="false"
        data-enable-grammarly="false"
      />

      <div className="absolute right-2 flex items-center top-[13px] gap-2">
        <Popover
          opened={emojiPickerOpened}
          onChange={setEmojiPickerOpened}
          styles={{
            dropdown: {
              '--mantine-color-white': 'transparent',
              '--mantine-color-gray-2': 'transparent',
            },
          }}
        >
          <Popover.Target>
            <UnstyledButton onClick={() => setEmojiPickerOpened(true)}>
              <SmilePlus className="text-zinc-600" />
            </UnstyledButton>
          </Popover.Target>

          <Popover.Dropdown>
            <EmojiPicker
              theme={'light'}
              data={emojiPickerData}
              emojiSize={30}
              onEmojiSelect={(emoji: any) => {
                setMessage((prevMessage) => prevMessage + emoji.native);
              }}
            />
          </Popover.Dropdown>
        </Popover>

        <UnstyledButton
          area-label="room-message-composer-button"
          onClick={handleSendMessage}
        >
          <SendHorizontal className="text-zinc-600" />
        </UnstyledButton>
      </div>
    </div>
  );
};

export default RoomMessageComposer;

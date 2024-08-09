import { ChatMessage, ChatRoomType } from '@/common/api-models/graphql';
import { Menu, Skeleton, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { EllipsisVertical, Phone, PhoneOutgoing, Video } from 'lucide-react';
import React from 'react';

import { Link } from 'react-router-dom';

interface Props {
  roomHandle: string;
  roomId: string;
  loading: boolean;
  chatRoomType?: ChatRoomType;
  lastMessage?: ChatMessage;
  memberCount?: number;
  isCallOngoing?: boolean;
  onClickJoinCall?: () => void;
}

const ChatRoomHeader: React.FC<Props> = ({
  roomHandle,
  loading,
  chatRoomType,
  memberCount,
  lastMessage,
  roomId,
  isCallOngoing,
  onClickJoinCall,
}) => {
  return (
    <div className="px-2 py-2 bg-white h-[65px] flex-none shadow-sm">
      <div className="flex items-center justify-between gap-1">
        {/* Left Side */}
        <div className="flex items-center gap-1">
          <Link to={`/chat`} className="md:hidden">
            <IconChevronLeft />
          </Link>

          <div className="flex flex-col gap-1">
            {loading ? (
              <>
                <Skeleton height={20} width={200} />
                <Skeleton height={10} width={100} />
              </>
            ) : (
              <>
                <p className="text-md">@{roomHandle}</p>
                {chatRoomType === ChatRoomType.Group ? (
                  <p className="text-xs">{memberCount ?? 0} members</p>
                ) : (
                  <p className="text-xs">
                    Last message sent at{' '}
                    {new Date(lastMessage?.updatedAt).toDateString()}
                  </p>
                )}
              </>
            )}
          </div>
        </div>

        {/* Room Action Menu */}
        {isCallOngoing ? (
          <div className="flex items-center gap-3">
            <Tooltip label="Join Call">
              <button
                onClick={onClickJoinCall}
                className="flex items-center gap-2 px-2 py-1 text-white bg-green-500 rounded-sm"
              >
                <PhoneOutgoing size={18} />
                <p>Join Call</p>
              </button>
            </Tooltip>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Tooltip label="Join Video Call">
              <Link to={`/chat/${roomId}/video-call`}>
                <Video className="text-zinc-600" size={25} />
              </Link>
            </Tooltip>
            <Tooltip label="Join Audio Call">
              <Link to={`/chat/${roomId}/audio-call`}>
                <Phone className="text-zinc-600" />
              </Link>
            </Tooltip>
            <Menu>
              <Menu.Target>
                <button className="btn btn-ghost btn-circle">
                  <EllipsisVertical size={25} />
                </button>
              </Menu.Target>
              <Menu.Dropdown>
                {/* <Menu.Item onClick={handleLeaveChat}>Leave chat</Menu.Item> */}
              </Menu.Dropdown>
            </Menu>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatRoomHeader;

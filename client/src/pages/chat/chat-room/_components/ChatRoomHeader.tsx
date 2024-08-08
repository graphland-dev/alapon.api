import { ChatMessage, ChatRoomType } from '@/common/api-models/graphql';
import { Menu, Skeleton } from '@mantine/core';
import { IconChevronLeft, IconDotsVertical } from '@tabler/icons-react';
import React from 'react';
import { Link } from 'react-router-dom';

interface Props {
  roomHandle: string;
  roomId: string;
  loading: boolean;
  chatRoomType?: ChatRoomType;
  lastMessage?: ChatMessage;
  memberCount?: number;
}

const ChatRoomHeader: React.FC<Props> = ({
  roomHandle,
  loading,
  chatRoomType,
  memberCount,
  lastMessage,
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
        <Menu>
          <Menu.Target>
            <button className="btn btn-ghost btn-circle">
              <IconDotsVertical size={18} />
            </button>
          </Menu.Target>
          <Menu.Dropdown>
            {/* <Menu.Item onClick={handleLeaveChat}>Leave chat</Menu.Item> */}
          </Menu.Dropdown>
        </Menu>
      </div>
    </div>
  );
};

export default ChatRoomHeader;

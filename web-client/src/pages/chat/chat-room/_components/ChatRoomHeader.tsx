import { ChatMessage, ChatRoomType } from '@/common/api-models/graphql';
import { socketAtom } from '@/common/states/socket-io.atom';
import { userAtom } from '@/common/states/user.atom';
import { Menu, Skeleton, Tooltip } from '@mantine/core';
import { IconChevronLeft } from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import { EllipsisVertical, Phone, PhoneOutgoing, Video } from 'lucide-react';
import React from 'react';

import { Link, useNavigate } from 'react-router-dom';
import { ISocketCallDto } from '../models/chat.model';
import { openConfirmModal } from '@mantine/modals';

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
  const socket = useAtomValue(socketAtom);
  const authUser = useAtomValue(userAtom);
  const navitate = useNavigate();

  const initiateCall = (e: React.MouseEvent<HTMLButtonElement>) => {
    const callType = e.currentTarget.dataset.callType as 'video' | 'audio';
    openConfirmModal({
      title: `Start ${callType} call`,
      labels: { confirm: `Start ${callType} call`, cancel: 'Cancel' },
      onConfirm: () => {
        socket.emit('emit:chat:initiate-call', {
          roomId,
          userHandle: authUser?.handle,
          userId: authUser?._id,
        } satisfies ISocketCallDto);
        navitate(`/chat/${roomId}/${callType}-call`, { replace: true });
      },
    });
  };

  // const joinCall = (e: React.MouseEvent<HTMLButtonElement>) => {
  //   const callType = e.currentTarget.dataset.callType as 'video' | 'audio';
  //   openConfirmModal({
  //     title: `Start ${callType} call`,
  //     labels: { confirm: `Start ${callType} call`, cancel: 'Cancel' },
  //     onConfirm: () => {
  //       socket.emit('emit:chat:join-call', {
  //         roomId,
  //         userHandle: authUser?.handle,
  //         userId: authUser?._id,
  //       } satisfies ISocketCallDto);
  //       navitate(`/chat/${roomId}/${callType}-call`, { replace: true });
  //     },
  //   });
  // };

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
              <button data-call-type="video" onClick={initiateCall}>
                <Video className="text-zinc-600" size={25} />
              </button>
            </Tooltip>
            <Tooltip label="Join Audio Call">
              <button data-call-type="audio" onClick={initiateCall}>
                <Phone className="text-zinc-600" />
              </button>
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

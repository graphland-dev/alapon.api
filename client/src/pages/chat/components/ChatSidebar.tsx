import { ChatRoomsWithPagination } from '@/common/api-models/graphql';
import { userAtom } from '@/common/states/user.atom';
import { gql, useQuery } from '@apollo/client';
import { Menu, Modal, Skeleton, UnstyledButton } from '@mantine/core';
import {
  IconChevronDown,
  IconDotsVertical,
  IconLogout,
  IconPlus,
} from '@tabler/icons-react';
import { useAtomValue } from 'jotai';
import ChatRoomItem from './ChatRoomItem';
import { openConfirmModal } from '@mantine/modals';
import { TokenService } from '@/common/utils/TokenService';
import { useDisclosure } from '@mantine/hooks';
import CreateGroupForm from './modal-forms/CreateGroupForm';
import JoinInPersonForm from './modal-forms/JoinInPersonForm';
import JoinInGroupForm from './modal-forms/JoinInGroupForm';

const MY_CHAT_ROOMS_QUERY = gql`
  query Chat__myChatRooms($where: CommonPaginationOnlyDto) {
    chat__myChatRooms(where: $where) {
      nodes {
        _id
        handle
        members {
          handle
        }
        lastMessage {
          text
        }
        lastMessageSender {
          handle
        }
        isNsfw
        roomType
      }
    }
  }
`;

const ChatSidebar = () => {
  const authUser = useAtomValue(userAtom);
  const [joinInPersonModalOpened, joinInPersonModalHandler] =
    useDisclosure(false);

  const [joinInGroupModalOpened, joinInGroupModalHandler] =
    useDisclosure(false);

  const [createGroupModalOpened, createGroupModalHandler] =
    useDisclosure(false);

  const { data, loading, refetch } = useQuery<{
    chat__myChatRooms: ChatRoomsWithPagination;
  }>(MY_CHAT_ROOMS_QUERY, { variables: { where: { limit: -1 } } });

  const handleLogout = () => {
    openConfirmModal({
      title: 'Are you sure you want to logout?',
      labels: { confirm: 'Logout', cancel: 'Cancel' },
      onConfirm: () => {
        TokenService.removeToken();
        window.location.reload();
      },
    });
  };

  return (
    <>
      <div className="flex flex-col h-full">
        <div className="h-[40px] flex-none flex items-center gap-2 px-2 justify-between font-mono bg-primary text-primary-foreground">
          <UnstyledButton className="flex items-center gap-1">
            <p>@{authUser?.handle}</p>
          </UnstyledButton>
          <Menu>
            <Menu.Target>
              <button className="btn btn-ghost btn-circle">
                <IconDotsVertical size={18} />
              </button>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item onClick={joinInPersonModalHandler.open}>
                Join in person
              </Menu.Item>
              <Menu.Item onClick={createGroupModalHandler.open}>
                Create Group
              </Menu.Item>
              <Menu.Item onClick={joinInGroupModalHandler.open}>
                Join Group
              </Menu.Item>
              <Menu.Item
                onClick={handleLogout}
                leftSection={<IconLogout size={14} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </div>
        <div className="flex-auto overflow-y-auto">
          {loading && (
            <div className="flex flex-col gap-1 m-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} height={65} width="100%" />
              ))}
            </div>
          )}

          {data?.chat__myChatRooms?.nodes?.map((room) => (
            <ChatRoomItem key={room._id} room={room} />
          ))}
        </div>
      </div>

      <Modal
        opened={joinInPersonModalOpened}
        onClose={joinInPersonModalHandler.close}
      >
        <JoinInPersonForm
          onComplete={() => {
            joinInPersonModalHandler.close();
            refetch();
          }}
        />
      </Modal>

      <Modal
        opened={createGroupModalOpened}
        onClose={createGroupModalHandler.close}
      >
        <CreateGroupForm
          onComplete={() => {
            createGroupModalHandler.close();
            refetch();
          }}
        />
      </Modal>

      <Modal
        opened={joinInGroupModalOpened}
        onClose={joinInGroupModalHandler.close}
      >
        <JoinInGroupForm
          onComplete={() => {
            joinInGroupModalHandler.close();
            refetch();
          }}
        />
      </Modal>
    </>
  );
};

export default ChatSidebar;

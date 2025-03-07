// const MY_CHAT_ROOMS_QUERY = gql`
//   query Chat__myChatRooms($where: CommonPaginationOnlyDto) {
//     chat__myChatRooms(where: $where) {
//       nodes {
//         _id
//         handle
//         members {
//           handle
//         }
//         lastMessage {
//           text
//         }
//         lastMessageSender {
//           handle
//         }
//         isNsfw
//         roomType
//       }
//     }
//   }
// `;

const ChatSidebar = () => {
  return (
    <>
      <div className="flex flex-col h-full">
        <div className="h-[65px] flex-none flex items-center gap-2 px-2 justify-between font-mono bg-primary text-primary-foreground">
          <div className="flex flex-col gap-1 pl-2">
            <p className="text-lg">Alapon</p>
            {/* <p className="text-xs">@{authUser?.handle}</p> */}
          </div>
          {/* <Menu>
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
              <Menu.Item onClick={resetPinModalHandler.open}>
                Reset Pin
              </Menu.Item>
              <Menu.Item
                onClick={handleLogout}
                leftSection={<IconLogout size={14} />}
              >
                Logout
              </Menu.Item>
            </Menu.Dropdown>
          </Menu> */}
        </div>
        <div className="flex-auto overflow-y-auto">
          {/* {loading && (
            <div className="flex flex-col gap-1 m-1">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} height={65} width="100%" />
              ))}
            </div>
          )} */}

          {/* {!loading && chatRooms?.length === 0 && (
            <div className="grid w-10/12 mx-auto mt-2">
              <div className="text-center">
                <p className="text-lg font-bold text-slate-500">
                  You have no chat yet. Create one now!
                </p>
                <div className="w-8/12 mx-auto">
                  <Lottie animationData={EmptyChatLottieFile} />
                </div>
                <p className="text-sm text-slate-500">
                  Connect with friends/Groups, or create your own group.
                </p>

                <Menu>
                  <Menu.Target>
                    <UnstyledButton className="flex items-center gap-1 mx-auto mt-2 link">
                      <p>Actions</p>
                      <IconChevronDown size={14} />
                    </UnstyledButton>
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
                    <Menu.Item onClick={resetPinModalHandler.open}>
                      Reset Pin
                    </Menu.Item>
                  </Menu.Dropdown>
                </Menu>
              </div>
            </div>
          )} */}

          {/* {chatRooms?.map((room) => (
            <ChatRoomItem key={room._id} room={room} />
          ))} */}
        </div>
      </div>

      {/* <Modal
        opened={joinInPersonModalOpened}
        onClose={joinInPersonModalHandler.close}
      >
        <JoinInPersonForm
          onComplete={() => {
            joinInPersonModalHandler.close();
            // refetch();
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
            // refetch();
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
            // refetch();
          }}
        />
      </Modal>

      <Modal opened={resetPinModalOpened} onClose={resetPinModalHandler.close}>
        <ResetPinForm
          onComplete={() => {
            setTimeout(() => {
              resetPinModalHandler.close();
            }, 3000);
          }}
        />
      </Modal> */}
    </>
  );
};

export default ChatSidebar;

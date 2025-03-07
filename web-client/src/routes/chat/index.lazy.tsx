import { useMediaQuery } from '@mantine/hooks';
import { createLazyFileRoute } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/chat/')({
  component: RouteComponent,
});

function RouteComponent() {
  const isMD = useMediaQuery('(min-width: 768px)');
  const isMobile = useMediaQuery('(max-width: 768px)');

  // return (
  //   <div className="h-full">
  //     {isMD && <NoChatRoomScreen />}
  //     {isMobile && <ChatSidebar />}
  //   </div>
  // );
  return <h1>Hello "/chat/"!</h1>;
}

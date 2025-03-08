//----------------- Layout: /chat/* ---------------
import ChatSidebar from '@/modules/chat/ChatSidebar';
import { createLazyFileRoute, Outlet } from '@tanstack/react-router';

export const Route = createLazyFileRoute('/chat')({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div area-label="chat-layout" className="flex h-[100dvh]">
      <div
        area-label="chat-room-list"
        className="w-[300px] flex-none bg-background hidden md:block h-[100dvh]"
      >
        <ChatSidebar />
      </div>
      <div area-label="chat-outlet" className="flex-auto">
        <Outlet />
      </div>
    </div>
  );
}

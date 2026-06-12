"use client";

import Sidebar from "@/widgets/sidebar/ui/sidebar";
import { SidebarDrawer } from "@/widgets/sidebar/ui/sidebarDrawer";
import { useSidebarDrawer } from "@/widgets/sidebar/model/useSidebarDrawer";
import { Header } from "@/widgets/header/ui/header";
import { AiChatButton } from "@/features/ai-chat/ui/AiChatButton";
import { AiChatModal } from "@/features/ai-chat/ui/AiChatModal";
import { useAiChatPanel } from "@/features/ai-chat/model/useAiChatPanel";
import { RealtimeSubscriptions } from "@/widgets/realtime-subscription/ui/RealtimeSubscriptions";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, open, close } = useSidebarDrawer();
  const chat = useAiChatPanel();

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <RealtimeSubscriptions />
      <div className="hidden sm:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={open} />
        <div className="relative flex flex-1 flex-col overflow-hidden">
          {children}
          <AiChatModal open={chat.isOpen} onClose={chat.close} />
        </div>
      </div>
      <SidebarDrawer isOpen={isOpen} onClose={close} />
      {!chat.isOpen && <AiChatButton onClick={chat.open} />}
    </div>
  );
}

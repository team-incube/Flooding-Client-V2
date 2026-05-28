"use client";

import Sidebar from "@/widgets/sidebar/ui/sidebar";
import { SidebarDrawer } from "@/widgets/sidebar/ui/sidebarDrawer";
import { useSidebarDrawer } from "@/widgets/sidebar/model/useSidebarDrawer";
import { Header } from "@/widgets/header/ui/header";
import { AiChatButton } from "@/features/ai-chat/ui/AiChatButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isOpen, open, close } = useSidebarDrawer();

  return (
    <div className="bg-background flex h-dvh overflow-hidden">
      <div className="hidden sm:flex">
        <Sidebar />
      </div>
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header onMenuClick={open} />
        {children}
      </div>
      <SidebarDrawer isOpen={isOpen} onClose={close} />
      <AiChatButton />
    </div>
  );
}

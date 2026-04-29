import Sidebar from "@/widgets/adaptive-sidebar/ui";
import { Header } from "@/widgets/header/ui/header";
import { AiChatButton } from "@/features/ai-chat/ui/AiChatButton";

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-1 flex-col overflow-hidden">
        <Header />
        {children}
      </div>
      <AiChatButton />
    </div>
  );
}

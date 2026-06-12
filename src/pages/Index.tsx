import { useState } from "react";
import Icon from "@/shared/ui/icon";
import { useAuth } from "@/shared/lib/AuthContext";
import BottomNav, { Tab } from "@/widgets/BottomNav/ui/BottomNav";
import ChatsScreen from "@/features/chat/ui/ChatsScreen";
import FamilyScreen from "@/features/family/ui/FamilyScreen";
import GalleryScreen from "@/features/gallery/ui/GalleryScreen";
import FilesScreen from "@/features/files/ui/FilesScreen";
import ProfileScreen from "@/features/profile/ui/ProfileScreen";
import LoginScreen from "@/features/auth/ui/LoginScreen";

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");
  const [pendingChatId, setPendingChatId] = useState<number | null>(null);
  const { user, loading } = useAuth();

  const handleOpenDirectChat = (chatId: number) => {
    setPendingChatId(chatId);
    setActiveTab("chats");
  };

  if (loading) {
    return (
      <div
        className="flex h-screen items-center justify-center max-w-md mx-auto"
        style={{ background: "linear-gradient(160deg, hsl(35,60%,96%), hsl(340,40%,94%))" }}
      >
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="text-5xl">👨‍👩‍👧‍👦</div>
          <Icon name="Loader2" size={28} style={{ color: "hsl(22,85%,62%)" }} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (!user) return <LoginScreen />;

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden relative">
      <div
        className="fixed top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(22,85%,75%), transparent 70%)", transform: "translate(30%,-30%)" }}
      />
      <div
        className="fixed bottom-20 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none"
        style={{ background: "radial-gradient(circle, hsl(340,55%,80%), transparent 70%)", transform: "translate(-30%,30%)" }}
      />

      <div className="flex-1 overflow-hidden">
        <div style={{ display: activeTab === "chats" ? "flex" : "none", flexDirection: "column", height: "100%" }}>
          <ChatsScreen pendingChatId={pendingChatId} onPendingChatHandled={() => setPendingChatId(null)} />
        </div>
        {activeTab === "family" && <FamilyScreen onOpenDirectChat={handleOpenDirectChat} />}
        {activeTab === "gallery" && <GalleryScreen />}
        {activeTab === "files" && <FilesScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </div>

      <BottomNav active={activeTab} onChange={setActiveTab} />
    </div>
  );
}

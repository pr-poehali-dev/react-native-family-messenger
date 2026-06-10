import { useState } from "react";
import Icon from "@/components/ui/icon";
import ChatsScreen from "@/components/ChatsScreen";
import FamilyScreen from "@/components/FamilyScreen";
import GalleryScreen from "@/components/GalleryScreen";
import FilesScreen from "@/components/FilesScreen";
import ProfileScreen from "@/components/ProfileScreen";

type Tab = "chats" | "family" | "gallery" | "files" | "profile";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "family", icon: "Users", label: "Семья" },
  { id: "gallery", icon: "Image", label: "Галерея" },
  { id: "files", icon: "FolderOpen", label: "Файлы" },
  { id: "profile", icon: "User", label: "Профиль" },
];

export default function Index() {
  const [activeTab, setActiveTab] = useState<Tab>("chats");

  return (
    <div className="flex flex-col h-screen max-w-md mx-auto bg-background overflow-hidden relative">
      <div
        className="fixed top-0 right-0 w-64 h-64 rounded-full opacity-20 pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(22,85%,75%), transparent 70%)",
          transform: "translate(30%,-30%)",
        }}
      />
      <div
        className="fixed bottom-20 left-0 w-48 h-48 rounded-full opacity-15 pointer-events-none"
        style={{
          background: "radial-gradient(circle, hsl(340,55%,80%), transparent 70%)",
          transform: "translate(-30%,30%)",
        }}
      />

      <div className="flex-1 overflow-hidden">
        {activeTab === "chats" && <ChatsScreen />}
        {activeTab === "family" && <FamilyScreen />}
        {activeTab === "gallery" && <GalleryScreen />}
        {activeTab === "files" && <FilesScreen />}
        {activeTab === "profile" && <ProfileScreen />}
      </div>

      <nav
        className="bg-white border-t border-border flex items-center justify-around px-2 py-2"
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
      >
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200"
              style={
                isActive
                  ? { background: "hsla(22,85%,65%,0.12)" }
                  : {}
              }
            >
              <div className={`transition-transform duration-200 ${isActive ? "scale-110" : "scale-100"}`}>
                <Icon
                  name={tab.icon}
                  size={22}
                  style={{ color: isActive ? "hsl(22,85%,58%)" : "hsl(25,15%,55%)" }}
                  strokeWidth={isActive ? 2.5 : 1.8}
                />
              </div>
              <span
                className="text-[10px] transition-colors duration-200"
                style={{
                  color: isActive ? "hsl(22,85%,55%)" : "hsl(25,15%,55%)",
                  fontWeight: isActive ? 700 : 500,
                }}
              >
                {tab.label}
              </span>
            </button>
          );
        })}
      </nav>
    </div>
  );
}

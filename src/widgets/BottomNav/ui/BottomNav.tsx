import Icon from "@/shared/ui/icon";

type Tab = "chats" | "family" | "gallery" | "files" | "profile";

const tabs: { id: Tab; icon: string; label: string }[] = [
  { id: "chats", icon: "MessageCircle", label: "Чаты" },
  { id: "family", icon: "Users", label: "Семья" },
  { id: "gallery", icon: "Image", label: "Галерея" },
  { id: "files", icon: "FolderOpen", label: "Файлы" },
  { id: "profile", icon: "User", label: "Профиль" },
];

type Props = {
  active: Tab;
  onChange: (tab: Tab) => void;
};

export default function BottomNav({ active, onChange }: Props) {
  return (
    <nav
      className="bg-white border-t border-border flex items-center justify-around px-2 py-2"
      style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.06)" }}
    >
      {tabs.map((tab) => {
        const isActive = active === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className="flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-2xl transition-all duration-200"
            style={isActive ? { background: "hsla(22,85%,65%,0.12)" } : {}}
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
  );
}

export type { Tab };

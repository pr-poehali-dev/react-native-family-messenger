import { useState, useEffect } from "react";
import Icon from "@/shared/ui/icon";
import Avatar from "@/shared/ui/Avatar";
import OnlineStatus from "@/shared/ui/OnlineStatus";
import { getChatUsers, createDirect } from "@/shared/api";
import { useAuth } from "@/shared/lib/AuthContext";

type Member = { id: number; displayName: string; avatar: string; city: string; onlineStatus?: string | null };

const bgColors = [
  "hsl(35,45%,90%)", "hsl(340,55%,90%)", "hsl(200,50%,88%)",
  "hsl(140,35%,87%)", "hsl(270,35%,88%)", "hsl(50,60%,88%)", "hsl(22,65%,88%)",
];

type Props = { onOpenDirectChat?: (chatId: number) => void };

export default function FamilyScreen({ onOpenDirectChat }: Props) {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [writingTo, setWritingTo] = useState<number | null>(null);

  useEffect(() => {
    getChatUsers()
      .then(setMembers)
      .finally(() => setLoading(false));
  }, []);

  const handleWrite = async (memberId: number) => {
    setWritingTo(memberId);
    try {
      const chatId = await createDirect(memberId);
      onOpenDirectChat?.(chatId);
    } catch { /* silent */ }
    finally { setWritingTo(null); }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Семья</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loading ? "Загрузка..." : `${members.length + 1} участников`}
            </p>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Icon name="Loader2" size={28} className="animate-spin" style={{ color: "hsl(22,85%,62%)" }} />
          </div>
        ) : (
          <>
            {user && (
              <div
                className="bg-white rounded-3xl p-4 flex items-center gap-4 animate-slide-up"
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)", border: "2px solid hsl(22,85%,90%)" }}
              >
                <Avatar
                  avatar={user.avatar}
                  size={56}
                  className="rounded-2xl"
                  style={{ background: "linear-gradient(135deg, hsl(22,85%,62%), hsl(340,60%,68%))" }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-foreground text-[15px]" style={{ fontWeight: 700 }}>{user.displayName}</p>
                    <span className="text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: "hsl(22,85%,92%)", color: "hsl(22,85%,45%)", fontWeight: 700 }}>Я</span>
                  </div>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    @{user.username}{user.city ? ` · ${user.city}` : ""}
                  </p>
                  {user.bio && <p className="text-xs text-muted-foreground truncate mt-0.5">{user.bio}</p>}
                </div>
              </div>
            )}

            {members.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 opacity-70">
                <span className="text-5xl">👨‍👩‍👧‍👦</span>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  Пока вы единственный участник.<br />Добавьте семью в разделе Профиль.
                </p>
              </div>
            ) : members.map((m, i) => (
              <div
                key={m.id}
                className={`bg-white rounded-3xl p-4 flex items-center gap-4 animate-slide-up stagger-${Math.min(i + 2, 6)}`}
                style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
              >
                <Avatar
                  avatar={m.avatar}
                  size={56}
                  className="rounded-2xl"
                  style={{ background: bgColors[i % bgColors.length] }}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-foreground text-[15px]" style={{ fontWeight: 700 }}>{m.displayName}</p>
                    {m.onlineStatus === "online" && <OnlineStatus status="online" />}
                  </div>
                  {m.onlineStatus && m.onlineStatus !== "online"
                    ? <OnlineStatus status={m.onlineStatus} />
                    : m.city && <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{m.city}</p>
                  }
                </div>
                <button
                  onClick={() => handleWrite(m.id)}
                  disabled={writingTo === m.id}
                  className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0"
                >
                  {writingTo === m.id
                    ? <Icon name="Loader2" size={18} className="animate-spin" style={{ color: "hsl(22,85%,58%)" }} />
                    : <Icon name="MessageCircle" size={18} style={{ color: "hsl(22,85%,58%)" }} />}
                </button>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}
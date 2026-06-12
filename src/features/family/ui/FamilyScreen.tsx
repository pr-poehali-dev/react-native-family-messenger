import { useState, useEffect, useCallback } from "react";
import Icon from "@/shared/ui/icon";
import Avatar from "@/shared/ui/Avatar";
import { getChatUsers, createDirect, addFamilyMember, removeFamilyMember, FamilyUser } from "@/shared/api";
import { useAuth } from "@/shared/lib/AuthContext";

const bgColors = [
  "hsl(35,45%,90%)", "hsl(340,55%,90%)", "hsl(200,50%,88%)",
  "hsl(140,35%,87%)", "hsl(270,35%,88%)", "hsl(50,60%,88%)", "hsl(22,65%,88%)",
];

type Props = { onOpenDirectChat?: (chatId: number) => void };

export default function FamilyScreen({ onOpenDirectChat }: Props) {
  const { user } = useAuth();
  const [members, setMembers] = useState<FamilyUser[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const [writingTo, setWritingTo] = useState<number | null>(null);
  const [toggling, setToggling] = useState<number | null>(null);

  const load = useCallback(() => {
    setLoading(true);
    getChatUsers()
      .then(({ users, isAdmin: admin }) => {
        setMembers(users);
        setIsAdmin(admin);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleWrite = async (memberId: number) => {
    setWritingTo(memberId);
    try {
      const chatId = await createDirect(memberId);
      onOpenDirectChat?.(chatId);
    } catch { /* silent */ }
    finally { setWritingTo(null); }
  };

  const handleToggleFamily = async (m: FamilyUser) => {
    setToggling(m.id);
    try {
      if (m.inFamily) {
        await removeFamilyMember(m.id);
      } else {
        await addFamilyMember(m.id);
      }
      setMembers(prev => prev.map(u => u.id === m.id ? { ...u, inFamily: !u.inFamily } : u));
    } catch { /* silent */ }
    finally { setToggling(null); }
  };

  const visibleMembers = isAdmin ? members : members.filter(m => m.inFamily);

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Семья</h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              {loading ? "Загрузка..." : `${visibleMembers.length + 1} участников`}
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
            {/* Карточка текущего пользователя */}
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
                    {user.role === "admin" && (
                      <span className="flex items-center gap-0.5 text-[10px] px-1.5 py-0.5 rounded-md" style={{ background: "hsl(210,90%,92%)", color: "hsl(210,90%,40%)", fontWeight: 700 }}>
                        <Icon name="ShieldCheck" size={10} />
                        Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>
                    @{user.username}{user.city ? ` · ${user.city}` : ""}
                  </p>
                </div>
              </div>
            )}

            {/* Список участников */}
            {visibleMembers.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4 opacity-70">
                <span className="text-5xl">👨‍👩‍👧‍👦</span>
                <p className="text-sm text-muted-foreground text-center leading-relaxed">
                  {isAdmin ? "Нет участников." : "Вы ещё никого не добавили в семью."}
                </p>
              </div>
            ) : visibleMembers.map((m, i) => (
              <div
                key={m.id}
                className={`bg-white rounded-3xl p-4 flex items-center gap-4 animate-slide-up stagger-${Math.min(i + 2, 6)}`}
                style={{
                  boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
                  opacity: isAdmin && !m.inFamily ? 0.6 : 1,
                }}
              >
                <Avatar
                  avatar={m.avatar}
                  size={56}
                  className="rounded-2xl"
                  style={{ background: bgColors[i % bgColors.length] }}
                  onlineStatus={m.onlineStatus}
                />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <p className="text-foreground text-[15px]" style={{ fontWeight: 700 }}>{m.displayName}</p>
                    {m.role === "admin" && (
                      <Icon name="ShieldCheck" size={14} style={{ color: "hsl(210,90%,50%)", flexShrink: 0 }} />
                    )}
                  </div>
                  {m.onlineStatus && m.onlineStatus !== "online"
                    ? <p className="text-xs" style={{ color: "hsl(25,15%,60%)", fontWeight: 500 }}>{m.onlineStatus}</p>
                    : m.onlineStatus === "online"
                      ? <p className="text-xs" style={{ color: "hsl(142,70%,40%)", fontWeight: 600 }}>в сети</p>
                      : m.city && <p className="text-xs text-muted-foreground" style={{ fontWeight: 600 }}>{m.city}</p>
                  }
                </div>

                <div className="flex items-center gap-1 flex-shrink-0">
                  {/* Кнопка написать — только если в семье */}
                  {m.inFamily && (
                    <button
                      onClick={() => handleWrite(m.id)}
                      disabled={writingTo === m.id}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                    >
                      {writingTo === m.id
                        ? <Icon name="Loader2" size={18} className="animate-spin" style={{ color: "hsl(22,85%,58%)" }} />
                        : <Icon name="MessageCircle" size={18} style={{ color: "hsl(22,85%,58%)" }} />}
                    </button>
                  )}

                  {/* Кнопка добавить/убрать из семьи — только для admin */}
                  {isAdmin && (
                    <button
                      onClick={() => handleToggleFamily(m)}
                      disabled={toggling === m.id}
                      className="p-2 rounded-full hover:bg-muted transition-colors"
                      title={m.inFamily ? "Убрать из семьи" : "Добавить в семью"}
                    >
                      {toggling === m.id
                        ? <Icon name="Loader2" size={18} className="animate-spin" style={{ color: "hsl(25,15%,55%)" }} />
                        : m.inFamily
                          ? <Icon name="UserMinus" size={18} style={{ color: "hsl(0,70%,60%)" }} />
                          : <Icon name="UserPlus" size={18} style={{ color: "hsl(142,70%,45%)" }} />
                      }
                    </button>
                  )}
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
}

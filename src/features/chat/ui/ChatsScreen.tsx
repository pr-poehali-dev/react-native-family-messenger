import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/shared/ui/icon";
import Avatar from "@/shared/ui/Avatar";
import { Chat, listChats, deleteChat } from "@/shared/api";
import ChatView from "@/features/chat/ui/ChatView";
import NewChatModal from "@/features/chat/ui/NewChatModal";

type Props = {
  pendingChatId?: number | null;
  onPendingChatHandled?: () => void;
};

const DELETE_W = 72;

function ChatRow({ chat, onOpen, onDelete }: {
  chat: Chat;
  onOpen: (chat: Chat) => void;
  onDelete: (chatId: number) => void;
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [offset, setOffset] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const rowRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const startX = useRef(0);
  const startY = useRef(0);
  const moving = useRef(false);
  const dirLocked = useRef<"h" | "v" | null>(null);
  const currentOffset = useRef(0);

  const snapTo = (val: number) => {
    currentOffset.current = val;
    setOffset(val);
    if (rowRef.current) {
      rowRef.current.style.transition = "transform 0.2s ease";
      rowRef.current.style.transform = `translateX(${val}px)`;
    }
  };

  // Свайп только на touch-устройствах
  useEffect(() => {
    const el = rowRef.current;
    if (!el) return;

    const onStart = (e: TouchEvent) => {
      startX.current = e.touches[0].clientX;
      startY.current = e.touches[0].clientY;
      moving.current = true;
      dirLocked.current = null;
    };

    const onMove = (e: TouchEvent) => {
      if (!moving.current) return;
      const dx = e.touches[0].clientX - startX.current;
      const dy = e.touches[0].clientY - startY.current;
      if (!dirLocked.current) {
        if (Math.abs(dx) < 4 && Math.abs(dy) < 4) return;
        dirLocked.current = Math.abs(dy) > Math.abs(dx) ? "v" : "h";
      }
      if (dirLocked.current === "v") return;
      e.preventDefault();
      const base = currentOffset.current < -DELETE_W / 2 ? -DELETE_W : 0;
      const newVal = Math.max(-DELETE_W - 8, Math.min(0, base + dx));
      el.style.transition = "none";
      el.style.transform = `translateX(${newVal}px)`;
      currentOffset.current = newVal;
    };

    const onEnd = () => {
      if (!moving.current) return;
      moving.current = false;
      if (dirLocked.current === "v") return;
      const snapped = currentOffset.current < -DELETE_W / 2 ? -DELETE_W : 0;
      el.style.transition = "transform 0.2s ease";
      el.style.transform = `translateX(${snapped}px)`;
      currentOffset.current = snapped;
      setOffset(snapped);
    };

    el.addEventListener("touchstart", onStart, { passive: true });
    el.addEventListener("touchmove", onMove, { passive: false });
    el.addEventListener("touchend", onEnd, { passive: true });
    return () => {
      el.removeEventListener("touchstart", onStart);
      el.removeEventListener("touchmove", onMove);
      el.removeEventListener("touchend", onEnd);
    };
  }, []);

  // Закрыть меню при клике вне
  useEffect(() => {
    if (!menuOpen) return;
    const handler = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [menuOpen]);

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen(false);
    setDeleting(true);
    try {
      await deleteChat(chat.id);
      onDelete(chat.id);
    } catch {
      setDeleting(false);
      snapTo(0);
    }
  };

  const handleRowClick = () => {
    if (currentOffset.current < 0) { snapTo(0); return; }
    onOpen(chat);
  };

  const handleMenuToggle = (e: React.MouseEvent) => {
    e.stopPropagation();
    setMenuOpen((v) => !v);
  };

  return (
    <div className="relative" style={{ zIndex: menuOpen ? 10 : "auto" }}>
      {/* Красная зона свайпа */}
      {offset < -DELETE_W / 4 && (
        <div
          className="absolute right-0 top-0 bottom-0 flex flex-col items-center justify-center"
          style={{ width: DELETE_W, background: "hsl(0,75%,58%)", zIndex: 0 }}
        >
          {deleting
            ? <Icon name="Loader2" size={18} className="animate-spin" style={{ color: "white" }} />
            : <button onClick={handleDelete} className="w-full h-full flex flex-col items-center justify-center gap-1">
                <Icon name="Trash2" size={18} style={{ color: "white" }} />
                <span className="text-[10px] text-white" style={{ fontWeight: 600 }}>Удалить</span>
              </button>
          }
        </div>
      )}

      <div
        ref={rowRef}
        style={{ transform: "translateX(0px)", willChange: "transform", position: "relative", zIndex: 1, background: "var(--background)" }}
      >
        <div className="relative flex items-center group hover:bg-muted/40 transition-colors">
          <button
            onClick={handleRowClick}
            className="flex-1 flex items-center gap-3 px-4 py-3 min-w-0"
          >
            <div className="flex-shrink-0">
              <Avatar
                avatar={chat.avatar}
                size={52}
                className="rounded-full"
                style={{ background: "hsl(35,45%,90%)" }}
              />
            </div>
            <div className="flex-1 min-w-0 text-left">
              <div className="flex items-center justify-between mb-0.5">
                <p className="text-foreground truncate text-[15px]" style={{ fontWeight: 700 }}>{chat.name}</p>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{chat.lastAt}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">
                  {chat.lastText
                    ? (chat.isGroup && chat.lastAuthor ? `${chat.lastAuthor}: ${chat.lastText}` : chat.lastText)
                    : <span className="italic opacity-60">Нет сообщений</span>}
                </p>
                {chat.unread > 0 && (
                  <span
                    className="ml-2 flex-shrink-0 min-w-[20px] h-5 rounded-full flex items-center justify-center text-[11px] text-white px-1"
                    style={{ background: "hsl(22,85%,62%)", fontWeight: 700 }}
                  >
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>

          {/* Три точки */}
          <div className="relative flex-shrink-0 pr-3" ref={menuRef}>
            <button
              onClick={handleMenuToggle}
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors opacity-0 group-hover:opacity-100 focus:opacity-100"
              style={{ color: "hsl(25,15%,55%)" }}
              tabIndex={-1}
            >
              {deleting
                ? <Icon name="Loader2" size={16} className="animate-spin" />
                : <Icon name="MoreVertical" size={16} />
              }
            </button>

            {/* Дропдаун — absolute относительно кнопки три точки */}
            {menuOpen && (
              <div
                className="absolute right-0 top-full mt-1 rounded-2xl py-1 min-w-[150px]"
                style={{
                  zIndex: 9999,
                  background: "white",
                  boxShadow: "0 4px 24px rgba(0,0,0,0.15)",
                  border: "1px solid hsl(35,30%,92%)",
                }}
              >
                <button
                  onClick={handleDelete}
                  className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors hover:bg-red-50 rounded-2xl"
                  style={{ color: "hsl(0,75%,55%)", fontWeight: 600 }}
                >
                  <Icon name="Trash2" size={15} />
                  Удалить чат
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ChatsScreen({ pendingChatId, onPendingChatHandled }: Props) {
  const [chats, setChats] = useState<Chat[]>([]);
  const [loading, setLoading] = useState(true);
  const [openChat, setOpenChat] = useState<Chat | null>(null);
  const [showNew, setShowNew] = useState(false);
  const [search, setSearch] = useState("");
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const loadChats = useCallback(async () => {
    try {
      const list = await listChats();
      setChats(list);
      return list;
    } catch { /* silent */ }
    finally { setLoading(false); }
    return [];
  }, []);

  useEffect(() => {
    loadChats();
    pollRef.current = setInterval(loadChats, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [loadChats]);

  useEffect(() => {
    if (!pendingChatId) return;
    const open = (list: Chat[]) => {
      const found = list.find((c) => c.id === pendingChatId);
      if (found) {
        handleOpenChat(found);
        onPendingChatHandled?.();
      }
    };
    const found = chats.find((c) => c.id === pendingChatId);
    if (found) {
      open(chats);
    } else {
      loadChats().then((list) => open(list ?? []));
    }
  }, [pendingChatId]);

  const handleOpenChat = (chat: Chat) => {
    setOpenChat(chat);
    setChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, unread: 0 } : c));
  };

  const handleDeleteChat = (chatId: number) => {
    setChats((prev) => prev.filter((c) => c.id !== chatId));
  };

  const handleCreated = (chatId: number) => {
    setShowNew(false);
    loadChats().then((list) => {
      const found = (list ?? []).find((c) => c.id === chatId);
      if (found) setTimeout(() => handleOpenChat(found), 50);
    });
  };

  if (openChat) {
    return <ChatView chat={openChat} onBack={() => { setOpenChat(null); loadChats(); }} />;
  }

  const filtered = chats.filter((c) => c.name.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white flex-shrink-0" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Семейка</h1>
          <button
            onClick={() => setShowNew(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, hsl(22,85%,62%), hsl(340,60%,68%))" }}
          >
            <Icon name="Plus" size={18} style={{ color: "white" }} />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2">
          <Icon name="Search" size={16} style={{ color: "hsl(25,15%,55%)" }} />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск..."
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Icon name="Loader2" size={28} className="animate-spin" style={{ color: "hsl(22,85%,62%)" }} />
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 px-8">
            <span className="text-5xl">💬</span>
            <p className="text-center text-muted-foreground text-sm leading-relaxed">
              {search ? "Чат не найден" : "Чатов пока нет.\nНажмите + чтобы начать переписку!"}
            </p>
          </div>
        ) : filtered.map((chat) => (
          <ChatRow
            key={chat.id}
            chat={chat}
            onOpen={handleOpenChat}
            onDelete={handleDeleteChat}
          />
        ))}
      </div>

      {showNew && <NewChatModal onClose={() => setShowNew(false)} onCreate={handleCreated} />}
    </div>
  );
}
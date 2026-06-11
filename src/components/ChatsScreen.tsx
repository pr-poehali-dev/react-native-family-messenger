import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import {
  Chat, Message,
  listChats, getMessages, sendMessage, sendPhoto,
  createDirect, createGroupChat, getChatUsers,
} from "@/lib/api";

// ── Экран чата ────────────────────────────────────────────────────────────────
function ChatView({ chat, onBack }: { chat: Chat; onBack: () => void }) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [lightboxUrl, setLightboxUrl] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<number>(0);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = (smooth = false) =>
    bottomRef.current?.scrollIntoView({ behavior: smooth ? "smooth" : "instant" });

  const addMessage = (msg: Message) => {
    setMessages((prev) => [...prev, msg]);
    lastIdRef.current = msg.id;
    setTimeout(() => scrollToBottom(true), 30);
  };

  const loadMessages = useCallback(async (initial = false) => {
    try {
      const since = initial ? undefined : (lastIdRef.current || undefined);
      const msgs = await getMessages(chat.id, since);
      if (initial) {
        setMessages(msgs);
        if (msgs.length > 0) lastIdRef.current = msgs[msgs.length - 1].id;
      } else {
        const newMsgs = msgs.filter((m) => m.id > lastIdRef.current);
        if (newMsgs.length > 0) {
          setMessages((prev) => [...prev, ...newMsgs]);
          lastIdRef.current = newMsgs[newMsgs.length - 1].id;
        }
      }
    } catch { /* silent */ }
    finally { if (initial) setLoading(false); }
  }, [chat.id]);

  useEffect(() => {
    loadMessages(true).then(() => setTimeout(() => scrollToBottom(false), 60));
    pollRef.current = setInterval(() => loadMessages(false), 3000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [loadMessages]);

  useEffect(() => {
    if (!loading) scrollToBottom(true);
  }, [messages.length, loading]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || sending) return;
    setInput("");
    setSending(true);
    try {
      const msg = await sendMessage(chat.id, text);
      addMessage(msg);
    } catch {
      setInput(text);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handlePhotoSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setSending(true);
    try {
      const reader = new FileReader();
      reader.onload = async (ev) => {
        const dataUrl = ev.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        const msg = await sendPhoto(chat.id, base64, file.type);
        addMessage(msg);
        setSending(false);
      };
      reader.readAsDataURL(file);
    } catch {
      setSending(false);
    }
  };

  const avatarIsUrl = (av: string) => av?.startsWith("http");

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 py-3 bg-white border-b border-border flex-shrink-0"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}>
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <Icon name="ArrowLeft" size={20} style={{ color: "hsl(22,85%,58%)" }} />
        </button>
        <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 overflow-hidden"
          style={{ background: "hsl(35,45%,90%)" }}>
          {avatarIsUrl(chat.avatar)
            ? <img src={chat.avatar} className="w-full h-full object-cover" alt="" />
            : chat.avatar}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-foreground truncate text-[15px]" style={{ fontWeight: 700 }}>{chat.name}</p>
          <p className="text-xs" style={{ color: "hsl(140,40%,50%)", fontWeight: 500 }}>
            {chat.isGroup ? "Групповой чат" : "Личные сообщения"}
          </p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide"
        style={{ background: "hsl(36,33%,97%)" }}>
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <Icon name="Loader2" size={28} className="animate-spin" style={{ color: "hsl(22,85%,62%)" }} />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-3 opacity-60">
            <span className="text-4xl">💬</span>
            <p className="text-sm text-muted-foreground">Начните переписку!</p>
          </div>
        ) : (
          <>
            <div className="flex justify-center mb-4">
              <span className="text-xs text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
                Сегодня
              </span>
            </div>
            <div className="space-y-1">
              {messages.map((msg, i) => {
                const prev = messages[i - 1];
                const showAvatar = !msg.isMe && (!prev || prev.userId !== msg.userId);
                const showName = chat.isGroup && showAvatar;
                const hasImage = !!msg.imageUrl;
                const isTextOnly = !hasImage;
                return (
                  <div key={msg.id}
                    className="flex items-end gap-2"
                    style={{ justifyContent: msg.isMe ? "flex-end" : "flex-start", marginBottom: 2 }}>
                    {!msg.isMe && (
                      <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 mb-0.5 overflow-hidden"
                        style={{ background: "hsl(35,45%,90%)", visibility: showAvatar ? "visible" : "hidden" }}>
                        {avatarIsUrl(msg.avatar)
                          ? <img src={msg.avatar} className="w-full h-full object-cover" alt="" />
                          : msg.avatar}
                      </div>
                    )}
                    <div className="max-w-[72%]">
                      {showName && (
                        <p className="text-[10px] mb-1 ml-1" style={{ color: "hsl(22,85%,55%)", fontWeight: 700 }}>
                          {msg.displayName}
                        </p>
                      )}
                      {hasImage ? (
                        <div className={`overflow-hidden ${msg.isMe ? "rounded-[18px_18px_4px_18px]" : "rounded-[18px_18px_18px_4px]"}`}
                          style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}>
                          <button onClick={() => setLightboxUrl(msg.imageUrl!)}>
                            <img
                              src={msg.imageUrl!}
                              alt="фото"
                              className="block max-w-[220px] w-full object-cover"
                              style={{ maxHeight: 260 }}
                            />
                          </button>
                          {msg.text && msg.text !== "📷 Фото" && (
                            <div className={msg.isMe ? "bubble-me" : "bubble-them"}
                              style={{ padding: "6px 12px", borderRadius: 0 }}>
                              <p className="text-sm leading-relaxed">{msg.text}</p>
                            </div>
                          )}
                          <div className={`px-3 py-1 flex items-center justify-end gap-1 ${msg.isMe ? "bubble-me" : "bubble-them"}`}
                            style={{ borderRadius: 0, padding: "2px 10px 6px" }}>
                            <span className="text-[10px]"
                              style={{ color: msg.isMe ? "rgba(255,255,255,0.7)" : "hsl(25,15%,60%)" }}>
                              {msg.time}
                            </span>
                            {msg.isMe && <Icon name="CheckCheck" size={12} style={{ color: "rgba(255,255,255,0.8)" }} />}
                          </div>
                        </div>
                      ) : (
                        <div className={msg.isMe ? "bubble-me" : "bubble-them"} style={{ padding: "8px 14px" }}>
                          {isTextOnly && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
                          <p className="text-[10px] mt-1 text-right flex items-center justify-end gap-1"
                            style={{ color: msg.isMe ? "rgba(255,255,255,0.7)" : "hsl(25,15%,60%)" }}>
                            {msg.time}
                            {msg.isMe && <Icon name="CheckCheck" size={12} style={{ color: "rgba(255,255,255,0.8)" }} />}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="bg-white border-t border-border px-3 py-3 flex items-end gap-2 flex-shrink-0">
        <button
          onClick={() => fileRef.current?.click()}
          disabled={sending}
          className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 transition-colors hover:bg-muted"
        >
          <Icon name="ImagePlus" size={20} style={{ color: sending ? "hsl(35,25%,75%)" : "hsl(22,85%,58%)" }} />
        </button>
        <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoSelect} />

        <div className="flex-1 bg-muted rounded-2xl px-4 py-2.5 flex items-end gap-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Сообщение..."
            rows={1}
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground resize-none leading-relaxed"
            style={{ maxHeight: 120 }}
          />
        </div>
        <button
          onClick={handleSend}
          disabled={!input.trim() || sending}
          className="w-11 h-11 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200 active:scale-95"
          style={{
            background: input.trim() && !sending
              ? "linear-gradient(135deg, hsl(22,85%,62%), hsl(340,60%,68%))"
              : "hsl(35,25%,85%)",
            boxShadow: input.trim() ? "0 4px 12px hsla(22,85%,62%,0.4)" : "none",
          }}
        >
          {sending
            ? <Icon name="Loader2" size={16} className="animate-spin" style={{ color: "white" }} />
            : <Icon name="Send" size={16} style={{ color: input.trim() ? "white" : "hsl(25,15%,60%)" }} />
          }
        </button>
      </div>

      {/* Lightbox */}
      {lightboxUrl && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 animate-fade-in"
          onClick={() => setLightboxUrl(null)}
        >
          <button
            className="absolute top-4 right-4 p-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}
            onClick={() => setLightboxUrl(null)}
          >
            <Icon name="X" size={22} style={{ color: "white" }} />
          </button>
          <img
            src={lightboxUrl}
            alt=""
            className="max-w-full max-h-full rounded-2xl object-contain animate-pop-in"
            style={{ maxHeight: "90vh", maxWidth: "90vw" }}
            onClick={(e) => e.stopPropagation()}
          />
        </div>
      )}
    </div>
  );
}

// ── Модалка нового чата ───────────────────────────────────────────────────────
function NewChatModal({ onClose, onCreate }: {
  onClose: () => void;
  onCreate: (chatId: number) => void;
}) {
  const [users, setUsers] = useState<{ id: number; displayName: string; avatar: string; city: string }[]>([]);
  const [selected, setSelected] = useState<number[]>([]);
  const [groupName, setGroupName] = useState("");
  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const isGroup = selected.length > 1;

  useEffect(() => {
    getChatUsers().then((u) => { setUsers(u); setLoading(false); });
  }, []);

  const toggle = (id: number) =>
    setSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);

  const handleCreate = async () => {
    if (selected.length === 0) return;
    setCreating(true);
    try {
      const chatId = isGroup
        ? await createGroupChat(groupName || "Групповой чат", "👨‍👩‍👧‍👦", selected)
        : await createDirect(selected[0]);
      onCreate(chatId);
    } catch { setCreating(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center"
      style={{ background: "rgba(0,0,0,0.4)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-md bg-white rounded-t-3xl animate-slide-up max-h-[80vh] flex flex-col"
        style={{ boxShadow: "0 -8px 40px rgba(0,0,0,0.15)" }}>
        <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border flex-shrink-0">
          <p className="text-base text-foreground" style={{ fontWeight: 700 }}>Новый чат</p>
          <button onClick={onClose} className="p-1.5 rounded-full hover:bg-muted">
            <Icon name="X" size={18} style={{ color: "hsl(25,15%,55%)" }} />
          </button>
        </div>

        {isGroup && (
          <div className="px-4 py-3 border-b border-border flex-shrink-0">
            <input
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              placeholder="Название группы..."
              className="w-full bg-muted rounded-2xl px-4 py-2.5 text-sm outline-none"
            />
          </div>
        )}

        <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3">
          {loading ? (
            <div className="flex justify-center py-8">
              <Icon name="Loader2" size={24} className="animate-spin" style={{ color: "hsl(22,85%,62%)" }} />
            </div>
          ) : users.length === 0 ? (
            <p className="text-center text-sm text-muted-foreground py-8">
              Нет других участников
            </p>
          ) : users.map((u) => {
            const isSelected = selected.includes(u.id);
            return (
              <button key={u.id} onClick={() => toggle(u.id)}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-2xl mb-1.5 transition-all"
                style={{ background: isSelected ? "hsl(22,85%,95%)" : "hsl(35,40%,96%)" }}>
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: "hsl(35,45%,90%)" }}>{u.avatar}</div>
                <div className="flex-1 text-left">
                  <p className="text-sm text-foreground" style={{ fontWeight: 600 }}>{u.displayName}</p>
                  {u.city && <p className="text-xs text-muted-foreground">{u.city}</p>}
                </div>
                <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0"
                  style={{
                    borderColor: isSelected ? "hsl(22,85%,62%)" : "hsl(35,25%,75%)",
                    background: isSelected ? "hsl(22,85%,62%)" : "transparent",
                  }}>
                  {isSelected && <Icon name="Check" size={11} style={{ color: "white" }} />}
                </div>
              </button>
            );
          })}
        </div>

        <div className="px-4 py-4 border-t border-border flex-shrink-0">
          <button
            onClick={handleCreate}
            disabled={selected.length === 0 || creating}
            className="w-full py-3.5 rounded-2xl text-white text-sm transition-all"
            style={{
              background: selected.length > 0
                ? "linear-gradient(135deg, hsl(22,85%,62%), hsl(340,60%,68%))"
                : "hsl(35,25%,85%)",
              fontWeight: 700,
            }}
          >
            {creating ? "Создаём..."
              : isGroup ? `Создать группу (${selected.length})`
              : selected.length === 1 ? "Написать сообщение"
              : "Выберите участника"}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Список чатов ──────────────────────────────────────────────────────────────
export default function ChatsScreen() {
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
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    loadChats();
    pollRef.current = setInterval(loadChats, 5000);
    return () => { if (pollRef.current) clearInterval(pollRef.current); };
  }, [loadChats]);

  const handleOpenChat = (chat: Chat) => {
    setOpenChat(chat);
    setChats((prev) => prev.map((c) => c.id === chat.id ? { ...c, unread: 0 } : c));
  };

  const handleCreated = (chatId: number) => {
    setShowNew(false);
    loadChats().then(() => {
      setChats((prev) => {
        const found = prev.find((c) => c.id === chatId);
        if (found) setTimeout(() => setOpenChat(found), 50);
        return prev;
      });
    });
  };

  if (openChat) {
    return <ChatView chat={openChat} onBack={() => { setOpenChat(null); loadChats(); }} />;
  }

  const filtered = chats.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white flex-shrink-0"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Семейка</h1>
          <button
            onClick={() => setShowNew(true)}
            className="w-9 h-9 rounded-full flex items-center justify-center transition-all active:scale-95"
            style={{ background: "linear-gradient(135deg, hsl(22,85%,62%), hsl(340,60%,68%))" }}>
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
        ) : filtered.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => handleOpenChat(chat)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/40 transition-colors animate-fade-in stagger-${Math.min(i + 1, 6)}`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-[52px] h-[52px] rounded-full flex items-center justify-center text-2xl"
                style={{ background: "hsl(35,45%,90%)" }}>
                {chat.avatar}
              </div>
            </div>
            <div className="flex-1 min-w-0">
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
                  <span className="ml-2 flex-shrink-0 min-w-[20px] h-5 rounded-full flex items-center justify-center text-[11px] text-white px-1"
                    style={{ background: "hsl(22,85%,62%)", fontWeight: 700 }}>
                    {chat.unread}
                  </span>
                )}
              </div>
            </div>
          </button>
        ))}
      </div>

      {showNew && <NewChatModal onClose={() => setShowNew(false)} onCreate={handleCreated} />}
    </div>
  );
}
import { useState, useEffect, useRef, useCallback } from "react";
import Icon from "@/components/ui/icon";
import { Chat, Message, getMessages, sendMessage, sendPhoto } from "@/lib/api";
import ChatMessageBubble from "@/components/chat/ChatMessageBubble";

type Props = {
  chat: Chat;
  onBack: () => void;
};

function avatarIsUrl(av: string) {
  return av?.startsWith("http");
}

export default function ChatView({ chat, onBack }: Props) {
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

  const handlePhotoSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    e.target.value = "";
    setSending(true);
    const reader = new FileReader();
    reader.onload = async (ev) => {
      try {
        const dataUrl = ev.target?.result as string;
        const base64 = dataUrl.split(",")[1];
        const msg = await sendPhoto(chat.id, base64, file.type);
        addMessage(msg);
      } catch {
        /* silent */
      } finally {
        setSending(false);
      }
    };
    reader.onerror = () => setSending(false);
    reader.readAsDataURL(file);
  };

  return (
    <div className="flex flex-col h-full animate-fade-in">
      {/* Header */}
      <div
        className="flex items-center gap-3 px-4 py-3 bg-white border-b border-border flex-shrink-0"
        style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
      >
        <button onClick={onBack} className="p-1.5 rounded-full hover:bg-muted transition-colors">
          <Icon name="ArrowLeft" size={20} style={{ color: "hsl(22,85%,58%)" }} />
        </button>
        <div
          className="w-10 h-10 rounded-full flex items-center justify-center text-xl flex-shrink-0 overflow-hidden"
          style={{ background: "hsl(35,45%,90%)" }}
        >
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
      <div
        className="flex-1 overflow-y-auto px-4 py-4 scrollbar-hide"
        style={{ background: "hsl(36,33%,97%)" }}
      >
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
                return (
                  <ChatMessageBubble
                    key={msg.id}
                    msg={msg}
                    showAvatar={showAvatar}
                    showName={showName}
                    onImageClick={setLightboxUrl}
                  />
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
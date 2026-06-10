import { useState } from "react";
import Icon from "@/components/ui/icon";

const chats = [
  {
    id: 1,
    name: "Вся семья",
    avatar: "👨‍👩‍👧‍👦",
    lastMsg: "Мама: Ужин готов! Все идём?",
    time: "18:42",
    unread: 3,
    online: true,
    isGroup: true,
  },
  {
    id: 2,
    name: "Мама",
    avatar: "👩",
    lastMsg: "Как прошёл день, солнышко?",
    time: "17:15",
    unread: 1,
    online: true,
    isGroup: false,
  },
  {
    id: 3,
    name: "Папа",
    avatar: "👨",
    lastMsg: "Заберу тебя в 19:00",
    time: "16:30",
    unread: 0,
    online: false,
    isGroup: false,
  },
  {
    id: 4,
    name: "Сестра Аня",
    avatar: "👧",
    lastMsg: "Смотри какие фото с дачи!",
    time: "14:05",
    unread: 0,
    online: true,
    isGroup: false,
  },
  {
    id: 5,
    name: "Бабушка и дедушка",
    avatar: "👵",
    lastMsg: "Приезжайте в воскресенье!",
    time: "Вчера",
    unread: 0,
    online: false,
    isGroup: true,
  },
  {
    id: 6,
    name: "Брат Кирилл",
    avatar: "👦",
    lastMsg: "Ок, договорились 👍",
    time: "Вчера",
    unread: 0,
    online: false,
    isGroup: false,
  },
];

const messages = [
  { id: 1, from: "Мама", text: "Привет, как дела?", time: "17:10", isMe: false, avatar: "👩" },
  { id: 2, from: "Я", text: "Всё отлично! Скоро буду дома 🏠", time: "17:12", isMe: true },
  { id: 3, from: "Мама", text: "Хорошо, я сделала твой любимый борщ 🍲", time: "17:13", isMe: false, avatar: "👩" },
  { id: 4, from: "Я", text: "Ура! Уже еду ❤️", time: "17:14", isMe: true },
  { id: 5, from: "Мама", text: "Как прошёл день, солнышко?", time: "17:15", isMe: false, avatar: "👩" },
];

export default function ChatsScreen() {
  const [openChat, setOpenChat] = useState<(typeof chats)[0] | null>(null);
  const [inputText, setInputText] = useState("");

  if (openChat) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        {/* Chat header */}
        <div
          className="flex items-center gap-3 px-4 py-3 bg-white border-b border-border"
          style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.05)" }}
        >
          <button
            onClick={() => setOpenChat(null)}
            className="p-1.5 rounded-full hover:bg-muted transition-colors"
          >
            <Icon name="ArrowLeft" size={20} style={{ color: "hsl(22,85%,58%)" }} />
          </button>
          <div className="w-10 h-10 rounded-full bg-[hsl(35,45%,90%)] flex items-center justify-center text-xl flex-shrink-0">
            {openChat.avatar}
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-700 text-foreground truncate" style={{ fontWeight: 700 }}>{openChat.name}</p>
            <p className="text-xs text-[hsl(140,40%,50%)]" style={{ fontWeight: 500 }}>
              {openChat.online ? "в сети" : "был(а) недавно"}
            </p>
          </div>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <Icon name="Phone" size={20} style={{ color: "hsl(22,85%,58%)" }} />
          </button>
          <button className="p-1.5 rounded-full hover:bg-muted transition-colors">
            <Icon name="Video" size={20} style={{ color: "hsl(22,85%,58%)" }} />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3 scrollbar-hide"
          style={{ background: "hsl(36,33%,97%)" }}>
          <div className="text-center mb-4">
            <span className="text-xs text-muted-foreground bg-white px-3 py-1 rounded-full shadow-sm">
              Сегодня
            </span>
          </div>
          {messages.map((msg, i) => (
            <div
              key={msg.id}
              className={`flex items-end gap-2 animate-slide-up stagger-${Math.min(i + 1, 6)}`}
              style={{ justifyContent: msg.isMe ? "flex-end" : "flex-start" }}
            >
              {!msg.isMe && (
                <div className="w-8 h-8 rounded-full bg-[hsl(35,45%,90%)] flex items-center justify-center text-base flex-shrink-0">
                  {msg.avatar}
                </div>
              )}
              <div
                className={`max-w-[72%] px-4 py-2.5 ${msg.isMe ? "bubble-me" : "bubble-them"}`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className="text-[10px] mt-1 text-right"
                  style={{ color: msg.isMe ? "rgba(255,255,255,0.7)" : "hsl(25,15%,60%)" }}
                >
                  {msg.time}
                  {msg.isMe && (
                    <Icon name="CheckCheck" size={12} className="inline ml-1" style={{ color: "rgba(255,255,255,0.8)" }} />
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="bg-white border-t border-border px-3 py-3 flex items-center gap-2">
          <button className="p-2 rounded-full hover:bg-muted transition-colors">
            <Icon name="Paperclip" size={20} style={{ color: "hsl(25,15%,55%)" }} />
          </button>
          <div className="flex-1 bg-muted rounded-2xl px-4 py-2.5 flex items-center">
            <input
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Сообщение..."
              className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
            />
            <button className="ml-2">
              <Icon name="Smile" size={18} style={{ color: "hsl(25,15%,55%)" }} />
            </button>
          </div>
          <button
            className="w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200 active:scale-95"
            style={{ background: "hsl(22,85%,62%)" }}
          >
            <Icon name="Send" size={16} style={{ color: "white" }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-4 pt-5 pb-3 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Чаты</h1>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "hsl(22,85%,62%)" }}
          >
            <Icon name="Plus" size={18} style={{ color: "white" }} />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2">
          <Icon name="Search" size={16} style={{ color: "hsl(25,15%,55%)" }} />
          <input
            placeholder="Поиск..."
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
      </div>

      {/* Chat list */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {chats.map((chat, i) => (
          <button
            key={chat.id}
            onClick={() => setOpenChat(chat)}
            className={`w-full flex items-center gap-3 px-4 py-3 hover:bg-muted/50 transition-colors animate-fade-in stagger-${Math.min(i + 1, 6)}`}
          >
            <div className="relative flex-shrink-0">
              <div className="w-13 h-13 w-[52px] h-[52px] rounded-full bg-[hsl(35,45%,90%)] flex items-center justify-center text-2xl">
                {chat.avatar}
              </div>
              {chat.online && (
                <div
                  className="absolute bottom-0.5 right-0.5 w-3 h-3 rounded-full border-2 border-white"
                  style={{ background: "hsl(140,50%,50%)" }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-0.5">
                <p className="font-700 text-foreground truncate text-[15px]" style={{ fontWeight: 700 }}>
                  {chat.name}
                </p>
                <span className="text-xs text-muted-foreground ml-2 flex-shrink-0">{chat.time}</span>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground truncate">{chat.lastMsg}</p>
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
        ))}
      </div>
    </div>
  );
}

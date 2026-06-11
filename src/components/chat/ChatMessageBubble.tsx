import Icon from "@/components/ui/icon";
import { Message } from "@/lib/api";

type Props = {
  msg: Message;
  showAvatar: boolean;
  showName: boolean;
  onImageClick: (url: string) => void;
};

function avatarIsUrl(av: string) {
  return av?.startsWith("http");
}

export default function ChatMessageBubble({ msg, showAvatar, showName, onImageClick }: Props) {
  const hasImage = !!msg.imageUrl;
  const isTextOnly = !hasImage;

  return (
    <div
      className="flex items-end gap-2"
      style={{ justifyContent: msg.isMe ? "flex-end" : "flex-start", marginBottom: 2 }}
    >
      {!msg.isMe && (
        <div
          className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 mb-0.5 overflow-hidden"
          style={{ background: "hsl(35,45%,90%)", visibility: showAvatar ? "visible" : "hidden" }}
        >
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
          <div
            className={`overflow-hidden ${msg.isMe ? "rounded-[18px_18px_4px_18px]" : "rounded-[18px_18px_18px_4px]"}`}
            style={{ boxShadow: "0 2px 8px rgba(0,0,0,0.12)" }}
          >
            <button onClick={() => onImageClick(msg.imageUrl!)}>
              <img
                src={msg.imageUrl!}
                alt="фото"
                className="block max-w-[220px] w-full object-cover"
                style={{ maxHeight: 260 }}
              />
            </button>
            {msg.text && msg.text !== "📷 Фото" && (
              <div
                className={msg.isMe ? "bubble-me" : "bubble-them"}
                style={{ padding: "6px 12px", borderRadius: 0 }}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
              </div>
            )}
            <div
              className={`px-3 py-1 flex items-center justify-end gap-1 ${msg.isMe ? "bubble-me" : "bubble-them"}`}
              style={{ borderRadius: 0, padding: "2px 10px 6px" }}
            >
              <span
                className="text-[10px]"
                style={{ color: msg.isMe ? "rgba(255,255,255,0.7)" : "hsl(25,15%,60%)" }}
              >
                {msg.time}
              </span>
              {msg.isMe && <Icon name="CheckCheck" size={12} style={{ color: "rgba(255,255,255,0.8)" }} />}
            </div>
          </div>
        ) : (
          <div className={msg.isMe ? "bubble-me" : "bubble-them"} style={{ padding: "8px 14px" }}>
            {isTextOnly && <p className="text-sm leading-relaxed whitespace-pre-wrap">{msg.text}</p>}
            <p
              className="text-[10px] mt-1 text-right flex items-center justify-end gap-1"
              style={{ color: msg.isMe ? "rgba(255,255,255,0.7)" : "hsl(25,15%,60%)" }}
            >
              {msg.time}
              {msg.isMe && <Icon name="CheckCheck" size={12} style={{ color: "rgba(255,255,255,0.8)" }} />}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

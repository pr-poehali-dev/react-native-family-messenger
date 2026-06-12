type Props = {
  avatar: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
  onlineStatus?: string | null;
};

export default function Avatar({ avatar, size = 48, className = "", style, onlineStatus }: Props) {
  const isUrl = avatar?.startsWith("http");
  const isOnline = onlineStatus === "online";
  const dotSize = Math.max(8, Math.round(size * 0.22));
  const borderSize = Math.max(2, Math.round(dotSize * 0.3));

  return (
    <div className="relative flex-shrink-0 inline-flex" style={{ width: size, height: size }}>
      <div
        className={`flex items-center justify-center overflow-hidden ${className}`}
        style={{ width: size, height: size, ...style }}
      >
        {isUrl ? (
          <img src={avatar} alt="" className="w-full h-full object-cover" />
        ) : (
          <span style={{ fontSize: size * 0.55, lineHeight: 1 }}>{avatar || "👤"}</span>
        )}
      </div>

      {onlineStatus && (
        <span
          style={{
            position: "absolute",
            bottom: 0,
            right: 0,
            width: dotSize,
            height: dotSize,
            borderRadius: "50%",
            background: isOnline ? "hsl(142,70%,45%)" : "hsl(25,15%,72%)",
            border: `${borderSize}px solid white`,
            boxSizing: "border-box",
          }}
        />
      )}
    </div>
  );
}

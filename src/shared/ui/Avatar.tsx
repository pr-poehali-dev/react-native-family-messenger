type Props = {
  avatar: string;
  size?: number;
  className?: string;
  style?: React.CSSProperties;
};

export default function Avatar({ avatar, size = 48, className = "", style }: Props) {
  const isUrl = avatar?.startsWith("http");
  return (
    <div
      className={`flex items-center justify-center overflow-hidden flex-shrink-0 ${className}`}
      style={{ width: size, height: size, ...style }}
    >
      {isUrl ? (
        <img src={avatar} alt="" className="w-full h-full object-cover" />
      ) : (
        <span style={{ fontSize: size * 0.55, lineHeight: 1 }}>{avatar || "👤"}</span>
      )}
    </div>
  );
}

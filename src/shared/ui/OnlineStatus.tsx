type Props = {
  status?: string | null;
  className?: string;
};

export default function OnlineStatus({ status, className = "" }: Props) {
  if (!status) return null;

  const isOnline = status === "online";

  return (
    <span className={`flex items-center gap-1 ${className}`}>
      <span
        className="inline-block rounded-full flex-shrink-0"
        style={{
          width: 7,
          height: 7,
          background: isOnline ? "hsl(142,70%,45%)" : "hsl(25,15%,65%)",
          boxShadow: isOnline ? "0 0 0 2px hsl(142,70%,85%)" : "none",
        }}
      />
      {!isOnline && (
        <span className="text-[11px]" style={{ color: "hsl(25,15%,60%)", fontWeight: 500 }}>
          {status}
        </span>
      )}
    </span>
  );
}

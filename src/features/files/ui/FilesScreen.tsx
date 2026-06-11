import Icon from "@/shared/ui/icon";

export default function FilesScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Файлы</h1>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "hsl(22,85%,62%)" }}
          >
            <Icon name="Upload" size={18} style={{ color: "white" }} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col items-center justify-center gap-5 px-8">
        <div className="w-24 h-24 rounded-3xl flex items-center justify-center text-4xl" style={{ background: "hsl(35,45%,90%)" }}>
          📁
        </div>
        <div className="text-center">
          <p className="text-foreground text-base mb-1" style={{ fontWeight: 700 }}>Файлов пока нет</p>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Здесь будут храниться общие документы, фото и архивы семьи
          </p>
        </div>
        <button
          className="flex items-center gap-2 px-6 py-3 rounded-2xl text-white text-sm transition-all active:scale-95"
          style={{
            background: "linear-gradient(135deg, hsl(22,85%,62%), hsl(340,60%,68%))",
            fontWeight: 600,
            boxShadow: "0 6px 16px hsla(22,85%,62%,0.35)",
          }}
        >
          <Icon name="Upload" size={16} style={{ color: "white" }} />
          Загрузить файл
        </button>
      </div>
    </div>
  );
}

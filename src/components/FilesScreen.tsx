import { useState } from "react";
import Icon from "@/components/ui/icon";

type FileItem = {
  id: number;
  name: string;
  size: string;
  type: "pdf" | "doc" | "img" | "zip" | "xls";
  author: string;
  date: string;
  emoji: string;
};

const files: FileItem[] = [
  { id: 1, name: "Паспорт мамы (скан).pdf", size: "2.3 МБ", type: "pdf", author: "Мама", date: "10 июн", emoji: "📄" },
  { id: 2, name: "Страховые полисы 2024.pdf", size: "1.1 МБ", type: "pdf", author: "Папа", date: "5 июн", emoji: "🛡️" },
  { id: 3, name: "Рецепт бабушкиного борща.doc", size: "48 КБ", type: "doc", author: "Бабушка Люда", date: "2 июн", emoji: "🍲" },
  { id: 4, name: "Семейный бюджет.xls", size: "340 КБ", type: "xls", author: "Папа", date: "1 июн", emoji: "💰" },
  { id: 5, name: "Документы на машину.zip", size: "8.7 МБ", type: "zip", author: "Папа", date: "28 мая", emoji: "🚗" },
  { id: 6, name: "Мед. карта Кирилла.pdf", size: "1.8 МБ", type: "pdf", author: "Мама", date: "20 мая", emoji: "🏥" },
  { id: 7, name: "Договор аренды дачи.doc", size: "220 КБ", type: "doc", author: "Дедушка Миша", date: "15 мая", emoji: "🏡" },
  { id: 8, name: "Аттестат Ани.img", size: "3.2 МБ", type: "img", author: "Мама", date: "10 мая", emoji: "🎓" },
];

const typeColors: Record<FileItem["type"], string> = {
  pdf: "hsl(0,70%,90%)",
  doc: "hsl(210,70%,90%)",
  img: "hsl(140,40%,87%)",
  zip: "hsl(45,70%,88%)",
  xls: "hsl(150,55%,87%)",
};

const typeTextColors: Record<FileItem["type"], string> = {
  pdf: "hsl(0,65%,50%)",
  doc: "hsl(210,65%,50%)",
  img: "hsl(140,50%,40%)",
  zip: "hsl(40,65%,45%)",
  xls: "hsl(150,55%,38%)",
};

const typeLabels: Record<FileItem["type"], string> = {
  pdf: "PDF",
  doc: "DOC",
  img: "IMG",
  zip: "ZIP",
  xls: "XLS",
};

const categories = ["Все", "Документы", "Фото", "Архивы"];

export default function FilesScreen() {
  const [activeCategory, setActiveCategory] = useState("Все");

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between mb-3">
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Файлы</h1>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "hsl(22,85%,62%)" }}
          >
            <Icon name="Upload" size={18} style={{ color: "white" }} />
          </button>
        </div>
        <div className="flex items-center gap-2 bg-muted rounded-2xl px-3 py-2 mb-3">
          <Icon name="Search" size={16} style={{ color: "hsl(25,15%,55%)" }} />
          <input
            placeholder="Поиск файлов..."
            className="flex-1 bg-transparent text-sm outline-none text-foreground placeholder:text-muted-foreground"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className="flex-shrink-0 px-4 py-1.5 rounded-2xl text-sm transition-all duration-200"
              style={
                activeCategory === cat
                  ? { background: "hsl(22,85%,62%)", color: "white", fontWeight: 700 }
                  : { background: "hsl(35,45%,90%)", color: "hsl(25,30%,40%)", fontWeight: 500 }
              }
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Storage indicator */}
      <div className="mx-4 mt-4 bg-white rounded-3xl p-4" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Icon name="HardDrive" size={16} style={{ color: "hsl(22,85%,58%)" }} />
            <span className="text-sm text-foreground" style={{ fontWeight: 600 }}>Хранилище</span>
          </div>
          <span className="text-xs text-muted-foreground">1.8 ГБ из 10 ГБ</span>
        </div>
        <div className="w-full bg-muted rounded-full h-2.5 overflow-hidden">
          <div
            className="h-full rounded-full"
            style={{
              width: "18%",
              background: "linear-gradient(to right, hsl(22,85%,62%), hsl(340,60%,72%))",
            }}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-3 space-y-2.5">
        {files.map((file, i) => (
          <div
            key={file.id}
            className={`bg-white rounded-3xl px-4 py-3.5 flex items-center gap-3 animate-slide-up stagger-${Math.min(i + 1, 6)}`}
            style={{ boxShadow: "0 2px 10px rgba(0,0,0,0.05)" }}
          >
            <div
              className="w-11 h-11 rounded-2xl flex items-center justify-center text-xl flex-shrink-0"
              style={{ background: typeColors[file.type] }}
            >
              {file.emoji}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-foreground truncate mb-0.5" style={{ fontWeight: 600 }}>
                {file.name}
              </p>
              <div className="flex items-center gap-2">
                <span
                  className="text-[10px] px-1.5 py-0.5 rounded-md"
                  style={{
                    background: typeColors[file.type],
                    color: typeTextColors[file.type],
                    fontWeight: 700,
                  }}
                >
                  {typeLabels[file.type]}
                </span>
                <span className="text-xs text-muted-foreground">{file.size}</span>
                <span className="text-xs text-muted-foreground">· {file.author}</span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-1.5 flex-shrink-0">
              <span className="text-xs text-muted-foreground">{file.date}</span>
              <button className="p-1">
                <Icon name="MoreVertical" size={16} style={{ color: "hsl(25,15%,60%)" }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import Icon from "@/components/ui/icon";

const members = [
  { id: 1, name: "Мама", role: "Мама", avatar: "👩", age: 48, city: "Москва", online: true, emoji: "🌸", bio: "Люблю готовить и проводить время с семьёй" },
  { id: 2, name: "Папа", role: "Папа", avatar: "👨", age: 50, city: "Москва", online: false, emoji: "⚽", bio: "Рыбалка, футбол и барбекю по выходным" },
  { id: 3, name: "Я — Саша", role: "Сын/Дочь", avatar: "🧒", age: 24, city: "Москва", online: true, emoji: "🎵", bio: "Музыкант, путешественник, фотограф" },
  { id: 4, name: "Аня", role: "Сестра", avatar: "👧", age: 21, city: "СПб", online: true, emoji: "🎨", bio: "Студентка художественного, рисую каждый день" },
  { id: 5, name: "Кирилл", role: "Брат", avatar: "👦", age: 17, city: "Москва", online: false, emoji: "🎮", bio: "Учусь в 11 классе, хожу на программирование" },
  { id: 6, name: "Бабушка Люда", role: "Бабушка", avatar: "👵", age: 72, city: "Тула", online: false, emoji: "🌷", bio: "Варю варенье и жду всех в гости" },
  { id: 7, name: "Дедушка Миша", role: "Дедушка", avatar: "👴", age: 74, city: "Тула", online: false, emoji: "🎣", bio: "Садовод и рыболов со стажем 40 лет" },
];

const bgColors = [
  "hsl(35,45%,90%)",
  "hsl(340,55%,90%)",
  "hsl(200,50%,88%)",
  "hsl(140,35%,87%)",
  "hsl(270,35%,88%)",
  "hsl(50,60%,88%)",
  "hsl(22,65%,88%)",
];

export default function FamilyScreen() {
  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Семья</h1>
            <p className="text-sm text-muted-foreground mt-0.5">{members.length} участников</p>
          </div>
          <button
            className="flex items-center gap-1.5 px-4 py-2 rounded-2xl text-white text-sm transition-all active:scale-95"
            style={{ background: "hsl(22,85%,62%)", fontWeight: 600 }}
          >
            <Icon name="UserPlus" size={15} style={{ color: "white" }} />
            Добавить
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide px-4 py-4 space-y-3">
        {members.map((m, i) => (
          <div
            key={m.id}
            className={`bg-white rounded-3xl p-4 flex items-center gap-4 animate-slide-up stagger-${Math.min(i + 1, 6)}`}
            style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}
          >
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl flex-shrink-0 relative"
              style={{ background: bgColors[i % bgColors.length] }}
            >
              {m.avatar}
              {m.online && (
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white"
                  style={{ background: "hsl(140,50%,50%)" }}
                />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-0.5">
                <p className="font-bold text-foreground text-[15px]" style={{ fontWeight: 700 }}>{m.name}</p>
                <span className="text-base">{m.emoji}</span>
              </div>
              <p className="text-xs text-muted-foreground mb-1" style={{ fontWeight: 600 }}>
                {m.role} · {m.age} лет · {m.city}
              </p>
              <p className="text-xs text-muted-foreground truncate">{m.bio}</p>
            </div>
            <button className="p-2 rounded-full hover:bg-muted transition-colors flex-shrink-0">
              <Icon name="MessageCircle" size={18} style={{ color: "hsl(22,85%,58%)" }} />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

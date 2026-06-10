import { useState } from "react";
import Icon from "@/components/ui/icon";

const FAMILY_IMG = "https://cdn.poehali.dev/projects/35da0ae4-4536-46f9-a3ce-e4a1649697d0/files/9de32f0c-b207-462c-b668-2e3a6e05bc1d.jpg";
const GALLERY_IMG = "https://cdn.poehali.dev/projects/35da0ae4-4536-46f9-a3ce-e4a1649697d0/files/5967c6bd-cdbd-4f53-8055-ed579ee85cf5.jpg";

const albums = [
  { id: 1, name: "Новый год 2024", count: 34, cover: FAMILY_IMG, emoji: "🎄" },
  { id: 2, name: "Дача летом", count: 67, cover: GALLERY_IMG, emoji: "🌻" },
  { id: 3, name: "День рождения мамы", count: 18, cover: FAMILY_IMG, emoji: "🎂" },
  { id: 4, name: "Поездка в Питер", count: 92, cover: GALLERY_IMG, emoji: "✈️" },
];

const recentPhotos = [
  { id: 1, src: FAMILY_IMG, author: "Мама", time: "сегодня" },
  { id: 2, src: GALLERY_IMG, author: "Аня", time: "вчера" },
  { id: 3, src: FAMILY_IMG, author: "Папа", time: "вчера" },
  { id: 4, src: GALLERY_IMG, author: "Я", time: "2 дня назад" },
  { id: 5, src: FAMILY_IMG, author: "Кирилл", time: "3 дня назад" },
  { id: 6, src: GALLERY_IMG, author: "Мама", time: "неделю назад" },
];

type View = "main" | "photo";

export default function GalleryScreen() {
  const [view, setView] = useState<View>("main");
  const [selectedPhoto, setSelectedPhoto] = useState<(typeof recentPhotos)[0] | null>(null);

  if (view === "photo" && selectedPhoto) {
    return (
      <div className="flex flex-col h-full bg-black animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-4">
          <button
            onClick={() => setView("main")}
            className="p-2 rounded-full"
            style={{ background: "rgba(255,255,255,0.15)" }}
          >
            <Icon name="ArrowLeft" size={20} style={{ color: "white" }} />
          </button>
          <div className="flex-1">
            <p className="text-white font-semibold text-sm">{selectedPhoto.author}</p>
            <p className="text-white/60 text-xs">{selectedPhoto.time}</p>
          </div>
          <button className="p-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Icon name="Share2" size={18} style={{ color: "white" }} />
          </button>
          <button className="p-2 rounded-full" style={{ background: "rgba(255,255,255,0.15)" }}>
            <Icon name="Download" size={18} style={{ color: "white" }} />
          </button>
        </div>
        <div className="flex-1 flex items-center justify-center px-4">
          <img
            src={selectedPhoto.src}
            alt=""
            className="w-full rounded-3xl object-cover animate-pop-in"
            style={{ maxHeight: "70vh" }}
          />
        </div>
        <div className="px-6 py-6 flex items-center gap-4">
          <button className="flex items-center gap-2 text-white/80 text-sm">
            <Icon name="Heart" size={20} style={{ color: "hsl(340,70%,70%)" }} />
            <span>Нравится</span>
          </button>
          <button className="flex items-center gap-2 text-white/80 text-sm">
            <Icon name="MessageCircle" size={20} style={{ color: "white" }} />
            <span>Комментарий</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 pt-5 pb-3 bg-white" style={{ boxShadow: "0 2px 12px rgba(0,0,0,0.04)" }}>
        <div className="flex items-center justify-between">
          <h1 className="text-2xl text-foreground" style={{ fontWeight: 800 }}>Галерея</h1>
          <button
            className="w-9 h-9 rounded-full flex items-center justify-center"
            style={{ background: "hsl(22,85%,62%)" }}
          >
            <Icon name="Plus" size={18} style={{ color: "white" }} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Albums */}
        <div className="px-4 pt-4 pb-2">
          <p className="text-sm font-bold text-foreground mb-3" style={{ fontWeight: 700 }}>Альбомы</p>
          <div className="grid grid-cols-2 gap-3">
            {albums.map((album, i) => (
              <button
                key={album.id}
                className={`relative rounded-3xl overflow-hidden animate-pop-in stagger-${Math.min(i + 1, 4)}`}
                style={{ aspectRatio: "1/1" }}
              >
                <img src={album.cover} alt={album.name} className="w-full h-full object-cover" />
                <div
                  className="absolute inset-0 flex flex-col justify-end p-3"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 60%)" }}
                >
                  <p className="text-white text-sm text-left" style={{ fontWeight: 700 }}>{album.emoji} {album.name}</p>
                  <p className="text-white/70 text-xs text-left">{album.count} фото</p>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Recent */}
        <div className="px-4 pt-2 pb-4">
          <p className="text-sm font-bold text-foreground mb-3" style={{ fontWeight: 700 }}>Недавние</p>
          <div className="grid grid-cols-3 gap-2">
            {recentPhotos.map((photo, i) => (
              <button
                key={photo.id}
                onClick={() => { setSelectedPhoto(photo); setView("photo"); }}
                className={`relative rounded-2xl overflow-hidden animate-pop-in stagger-${Math.min(i + 1, 6)}`}
                style={{ aspectRatio: "1/1" }}
              >
                <img src={photo.src} alt="" className="w-full h-full object-cover" />
                <div
                  className="absolute bottom-0 left-0 right-0 px-1.5 py-1"
                  style={{ background: "linear-gradient(to top, rgba(0,0,0,0.5), transparent)" }}
                >
                  <p className="text-white text-[9px]" style={{ fontWeight: 600 }}>{photo.author}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

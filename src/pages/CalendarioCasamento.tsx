import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Settings, Share2, MoreHorizontal, SlidersHorizontal, Heart, Pencil } from "lucide-react";
import {
  WeddingBackground,
  WeddingHeader,
  WeddingProgress,
  WeddingDayCard,
  WeddingSpecialCard,
  WeddingDiarySection,
  WeddingFooter,
  EditorHeader,
  EditorFooter,
  EmptyDayCard,
  WeddingShower,
  WeddingTopDecorations
} from "@/lib/themes/themeComponents";

export default function CalendarioCasamento() {
  const navigate = useNavigate();
  // State for Editor Mode toggle
  const [isEditor, setIsEditor] = useState(true);

  // Mock data matching reference
  const days = [
    { day: 1, status: 'unlocked', img: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=600&auto=format&fit=crop' },
    { day: 2, status: 'unlocked', img: 'https://images.unsplash.com/photo-1583939003579-730e3918a45a?q=80&w=600&auto=format&fit=crop' },
    { day: 3, status: 'unlocked', img: 'https://images.unsplash.com/photo-1511285560982-1351cdeb9821?q=80&w=600&auto=format&fit=crop' },
    { day: 4, status: 'unlocked', img: 'https://images.unsplash.com/photo-1520342868574-5fa3804e551c?q=80&w=600&auto=format&fit=crop' },
    { day: 5, status: 'special' }, // The special day card
    { day: 6, status: 'empty' },
    { day: 7, status: 'empty' },
    { day: 8, status: 'empty' },
    { day: 9, status: 'locked', time: 'Em breve' },
  ];

  const handleOpenDay = (day: any) => {
    console.log("Open day", day);
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-display text-wedding-ink bg-wedding-cream">
      <WeddingBackground />
      <WeddingShower />
      <WeddingTopDecorations />

      {/* Editor Header or User Header */}
      {isEditor ? (
        <EditorHeader onPreview={() => setIsEditor(false)} />
      ) : (
        <div className="relative z-10">
          <div className="flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 text-wedding-gold hover:bg-white transition-all active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <h2 className="text-[10px] font-bold text-wedding-gold tracking-[0.2em] uppercase">Private Event</h2>

            <button
              onClick={() => setIsEditor(true)} // Toggle back to editor for demo
              className="flex items-center justify-center w-10 h-10 rounded-full bg-white/50 text-wedding-gold hover:bg-white transition-all"
            >
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>

          <WeddingHeader isEditor={false} />
          <WeddingProgress progress={90} />
        </div>
      )}

      {/* Editor specific top content */}
      {isEditor && (
        <div className="relative z-10 -mt-2">
          <WeddingHeader isEditor={true} />
          <WeddingProgress progress={90} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 py-4 pb-36 relative z-0">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-sm font-bold text-wedding-gold uppercase tracking-[0.2em] flex items-center gap-2">
            Calendário
          </h2>
          {isEditor && (
            <button className="text-[10px] font-bold text-wedding-gold uppercase flex items-center gap-1 hover:text-wedding-gold-dark">
              <span className="w-2 h-2 rounded-full bg-wedding-gold inline-block mr-1"></span> Aberto
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {days.map((d) => (
            d.status === 'special' ? (
              <WeddingSpecialCard
                key={d.day}
                dayNumber={d.day}
                onClick={() => handleOpenDay(d)}
                isEditor={isEditor}
              />
            ) : d.status === 'unlocked' ? (
              <WeddingDayCard
                key={d.day}
                dayNumber={d.day}
                imageUrl={d.img!}
                status="unlocked"
                onClick={() => handleOpenDay(d)}
                isEditor={isEditor}
              />
            ) : (isEditor && d.status === 'empty') ? (
              <WeddingDayCard key={d.day} dayNumber={d.day} status="empty" />
            ) : (
              <WeddingDayCard
                key={d.day}
                dayNumber={d.day}
                status="locked"
                isEditor={isEditor}
              />
            )
          ))}
        </div>

        <WeddingDiarySection isEditor={isEditor} />
      </main>

      {isEditor ? <EditorFooter /> : <WeddingFooter />}
    </div>
  );
}

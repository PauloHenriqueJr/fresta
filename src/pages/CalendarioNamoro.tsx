import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Heart, Sparkles, SlidersHorizontal } from "lucide-react";
import {
  LoveBackground,
  HangingHearts,
  LoveHeader,
  LoveProgressBar,
  EnvelopeCard,
  LockedDayCard,
  UnlockedDayCard,
  LoveQuote,
  LoveFooter,
  LoveLetterModal,
  EditorHeader,
  EditorFooter,
  EmptyDayCard
} from "@/lib/themes/themeComponents";

export default function CalendarioNamoro() {
  const navigate = useNavigate();
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{ type: 'text' | 'image' | 'video', title?: string, message?: string, mediaUrl?: string } | null>(null);

  // Temporary state to simulate Editor Mode toggle (in real app this would come from props/route)
  const [isEditor, setIsEditor] = useState(true);

  // Mock data to match the visual design
  const days = [
    { day: 1, status: 'unlocked', img: 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop' },
    { day: 2, status: 'unlocked', img: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop' },
    { day: 3, status: 'unlocked', img: 'https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=600&auto=format&fit=crop' },
    { day: 4, status: 'unlocked', img: 'https://images.unsplash.com/photo-1543807535-eceef0bc6599?q=80&w=600&auto=format&fit=crop' },
    { day: 5, status: 'envelope' }, // The special day to open
    { day: 6, status: 'empty', time: '12h' }, // Changed to 'empty' for Editor demo
    { day: 7, status: 'empty', time: '1d' },
    { day: 8, status: 'empty', time: '2d' },
    { day: 9, status: 'locked', time: '3d' },
  ];

  const handleOpenDay = (day: any) => {
    // Logic to select content based on day (mocked)
    if (day.status === 'envelope' || day.status === 'unlocked') {
      setSelectedContent({
        type: 'text',
        title: 'Meu Amor Eterno,',
        message: 'Cada dia ao seu lado é um presente que eu guardo com todo carinho. Você é a melodia mais doce da minha vida e o motivo de todos os meus sorrisos.',
        mediaUrl: day.img || 'https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&auto=format&fit=crop'
      });
      setModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen flex flex-col relative overflow-x-hidden font-display">
      <LoveBackground />

      {/* Hanging Hearts Decoration */}
      <HangingHearts />

      {/* Editor Header or User Header */}
      {isEditor ? (
        <EditorHeader onPreview={() => setIsEditor(false)} />
      ) : (
        <div className="relative w-full bg-white/80 dark:bg-surface-dark/90 pb-6 rounded-b-[2.5rem] shadow-festive z-10 pt-10 backdrop-blur-sm">
          <div className="flex items-center justify-between px-6 pt-6 pb-2 relative z-10">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-200 transition-transform active:scale-95"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-rose-50 dark:bg-rose-900/40">
              <span className="text-xs font-bold text-rose-600 dark:text-rose-300 tracking-wide uppercase">Amor e Romance</span>
            </div>

            <button
              onClick={() => setIsEditor(true)} // Toggle back to editor for demo
              className="flex items-center justify-center w-10 h-10 rounded-full bg-rose-50 dark:bg-rose-900/30 text-rose-600 dark:text-rose-200"
            >
              {/* Visual indicator for switching modes */}
              <Heart className="w-5 h-5 fill-current" />
            </button>
          </div>

          <LoveHeader />
          <LoveProgressBar progress={70} />
        </div>
      )}

      {/* Editor-specific Top Content */}
      {isEditor && (
        <div className="relative w-full bg-white/80 dark:bg-surface-dark/90 pb-6 rounded-b-[2.5rem] shadow-festive z-10 -mt-4 pt-4 backdrop-blur-sm">
          <LoveHeader isEditor={true} />
          <LoveProgressBar progress={70} isEditor={true} />
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 px-4 py-8 pb-36 relative z-0">
        <div className="flex items-center justify-between mb-6 px-2">
          <h2 className="text-lg font-bold text-slate-800 dark:text-white flex items-center gap-2 font-festive">
            <Sparkles className="text-love-red w-5 h-5" />
            {isEditor ? "Memórias do Calendário" : "Memórias para Guardar"}
          </h2>
          {isEditor && (
            <button className="text-[10px] font-bold text-rose-400 uppercase flex items-center gap-1 hover:text-rose-600">
              <SlidersHorizontal className="w-3 h-3" /> Reordenar
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 xs:grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-5">
          {days.map((d) => (
            d.status === 'envelope' ? (
              <EnvelopeCard
                key={d.day}
                dayNumber={d.day}
                onClick={() => handleOpenDay(d)}
                isEditor={isEditor}
              />
            ) : d.status === 'unlocked' ? (
              <UnlockedDayCard
                key={d.day}
                dayNumber={d.day}
                imageUrl={d.img!}
                onClick={() => handleOpenDay(d)}
                isEditor={isEditor}
              />
            ) : (isEditor && (d.day === 6 || d.day === 7 || d.day === 8)) ? (
              /* Simulation of empty slots for Editor */
              <EmptyDayCard key={d.day} dayNumber={d.day} />
            ) : (
              <LockedDayCard
                key={d.day}
                dayNumber={d.day}
                timeText={d.time!}
                isEditor={isEditor}
              />
            )
          ))}
        </div>

        <LoveQuote isEditor={isEditor} />
      </main>

      {isEditor ? <EditorFooter /> : <LoveFooter />}

      {/* Love Letter Modal */}
      {selectedContent && (
        <LoveLetterModal
          isOpen={modalOpen}
          onClose={() => setModalOpen(false)}
          content={selectedContent}
        />
      )}
    </div>
  );
}

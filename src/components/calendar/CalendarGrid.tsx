import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import DayCard, { DayStatus } from "./DayCard";

interface CalendarDay {
  day: number;
  status: DayStatus;
  timeLeft?: string;
  hasSpecialContent?: boolean;
}

interface CalendarGridProps {
  title: string;
  month: string;
  days: CalendarDay[];
  onDayClick?: (day: number) => void;
  theme?: "default" | "carnaval" | "saojoao" | "natal" | "reveillon" | "pascoa" | "independencia" | "namoro" | "casamento";
}

const CalendarGrid = ({
  title,
  month,
  days,
  onDayClick,
  theme = "default",
}: CalendarGridProps) => {
  // Show first 12 days in preview, or all if less
  const visibleDays = days.slice(0, 12);
  const remainingDays = days.length - visibleDays.length;

  return (
    <motion.div
      className="card-festive"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
    >
      {/* Header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-primary">
            {month}
          </span>
          <h3 className="text-xl font-extrabold text-foreground mt-1">
            {title}
          </h3>
        </div>
        <button className="w-10 h-10 rounded-full bg-accent/20 flex items-center justify-center text-accent-foreground hover:bg-accent/30 transition-colors">
          <Calendar className="w-5 h-5 text-primary" />
        </button>
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-4 gap-3">
        {visibleDays.map((dayData) => (
          <DayCard
            key={dayData.day}
            day={dayData.day}
            status={dayData.status}
            timeLeft={dayData.timeLeft}
            hasSpecialContent={dayData.hasSpecialContent}
            onClick={() => onDayClick?.(dayData.day)}
            theme={theme}
          />
        ))}
      </div>

      {/* See all days link */}
      {remainingDays > 0 && (
        <motion.button
          className="w-full mt-4 py-3 text-sm font-semibold text-primary bg-secondary rounded-xl hover:bg-secondary/80 transition-colors"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          Ver todos os {days.length} dias
        </motion.button>
      )}
    </motion.div>
  );
};

export default CalendarGrid;

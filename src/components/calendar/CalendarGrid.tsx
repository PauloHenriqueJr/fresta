import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import DayCard, { DayStatus } from "./DayCard";

interface CalendarDay {
  day: number;
  status: DayStatus;
  timeLeft?: string;
  hasSpecialContent?: boolean;
  dateLabel?: string;
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
  const visibleDays = days;

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, delay: 0.1 }}
    >
      {/* Clean Grid Header if needed, or remove if parent handles it. Keeping it clean inside grid. */}
      {/* Calendar Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
        {visibleDays.map((dayData) => (
          <DayCard
            key={dayData.day}
            day={dayData.day}
            status={dayData.status}
            timeLeft={dayData.timeLeft}
            hasSpecialContent={dayData.hasSpecialContent}
            dateLabel={dayData.dateLabel}
            onClick={() => onDayClick?.(dayData.day)}
            theme={theme}
          />
        ))}
      </div>
    </motion.div>
  );
};

export default CalendarGrid;

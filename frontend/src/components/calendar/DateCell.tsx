import { isAfter, isBefore, isSameDay } from "date-fns";
import { motion } from "framer-motion";
import type { CalendarDay } from "../../utils/generateCalendar";
import { formatDayLabel } from "../../utils/formatDate";

type DateCellProps = {
  day: CalendarDay;
  onHoverDate: (value: Date | null) => void;
  onSelectDate: (value: Date) => void;
  tripStartDate: Date | null;
  tripEndDate: Date | null;
};

function DateCell({ day, onHoverDate, onSelectDate, tripStartDate, tripEndDate }: DateCellProps) {
  const baseStyles =
    "relative flex h-12 items-center justify-center rounded-lg text-sm font-semibold transition-colors";
  const muted = day.isCurrentMonth ? "text-slate-700" : "text-slate-400";
  const weekend = day.isWeekend && day.isCurrentMonth ? "text-rose-500" : "";
  const today = day.isToday ? "bg-sky-600 text-white shadow-md" : "bg-transparent";
  const holiday = day.isHoliday && day.isCurrentMonth && !day.isToday ? "ring-1 ring-amber-500/80" : "";

  const isStart = Boolean(tripStartDate && isSameDay(day.date, tripStartDate));
  const isEnd = Boolean(tripEndDate && isSameDay(day.date, tripEndDate));
  const isRangeDay = Boolean(
    tripStartDate &&
      tripEndDate &&
      isAfter(day.date, tripStartDate) &&
      isBefore(day.date, tripEndDate)
  );
  const selectedState = isStart || isEnd ? "bg-indigo-600 text-white shadow-md" : isRangeDay ? "bg-indigo-100 text-indigo-700" : "";

  return (
    <motion.button
      type="button"
      whileHover={{
        scale: 1.05,
        boxShadow: "0 8px 18px rgba(14, 165, 233, 0.25)",
        backgroundColor: day.isToday ? "#0284c7" : "rgba(14,165,233,0.18)",
      }}
      transition={{ type: "spring", stiffness: 260, damping: 18 }}
      onHoverStart={() => onHoverDate(day.date)}
      onHoverEnd={() => onHoverDate(null)}
      onClick={() => onSelectDate(day.date)}
      className={`${baseStyles} ${muted} ${weekend} ${today} ${holiday} ${selectedState}`}
      aria-label={`${day.date.toDateString()}${day.isHoliday ? `, ${day.holidayLabel}` : ""}`}
      title={day.holidayLabel || day.date.toDateString()}
    >
      {formatDayLabel(day.date)}
      {day.isHoliday && (
        <span className="absolute bottom-1 h-1.5 w-1.5 rounded-full bg-amber-400" aria-hidden="true" />
      )}
    </motion.button>
  );
}

export default DateCell;

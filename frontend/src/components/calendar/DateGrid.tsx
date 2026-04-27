import { WEEKDAY_LABELS, type CalendarDay } from "../../utils/generateCalendar";
import DateCell from "./DateCell";

type DateGridProps = {
  grid: CalendarDay[][];
  onHoverDate: (value: Date | null) => void;
  onSelectDate: (value: Date) => void;
  tripStartDate: Date | null;
  tripEndDate: Date | null;
};

function DateGrid({ grid, onHoverDate, onSelectDate, tripStartDate, tripEndDate }: DateGridProps) {
  return (
    <section aria-label="Calendar date grid" className="space-y-2">
      <div className="grid grid-cols-7 gap-1">
        {WEEKDAY_LABELS.map((label) => (
          <span key={label} className="text-center text-xs font-bold uppercase tracking-wide text-slate-500">
            {label}
          </span>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {grid.flat().map((day) => (
          <DateCell
            key={day.date.toISOString()}
            day={day}
            onHoverDate={onHoverDate}
            onSelectDate={onSelectDate}
            tripStartDate={tripStartDate}
            tripEndDate={tripEndDate}
          />
        ))}
      </div>
    </section>
  );
}

export default DateGrid;

import type { CalendarDay } from "../../utils/generateCalendar";
import DateGrid from "./DateGrid";

type CalendarBodyProps = {
  grid: CalendarDay[][];
  hoverDate: Date | null;
  onHoverDate: (value: Date | null) => void;
  onSelectDate: (value: Date) => void;
  tripStartDate: Date | null;
  tripEndDate: Date | null;
};

function CalendarBody({
  grid,
  hoverDate,
  onHoverDate,
  onSelectDate,
  tripStartDate,
  tripEndDate,
}: CalendarBodyProps) {
  return (
    <section className="p-4">
      <DateGrid
        grid={grid}
        onHoverDate={onHoverDate}
        onSelectDate={onSelectDate}
        tripStartDate={tripStartDate}
        tripEndDate={tripEndDate}
      />
    </section>
  );
}

export default CalendarBody;

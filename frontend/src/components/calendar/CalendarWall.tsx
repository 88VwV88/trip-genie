import { addMonths } from "date-fns";
import { AnimatePresence, motion } from "framer-motion";
import { useMemo, useState } from "react";
import { generateCalendarGrid, getHeroImageForMonth } from "../../utils/generateCalendar";
import CalendarBody from "./CalendarBody";
import CalendarFrame from "./CalendarFrame";
import HeroSection from "./HeroSection";
import MonthNavigation from "./MonthNavigation";

function CalendarWall() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [hoverDate, setHoverDate] = useState<Date | null>(null);
  const [direction, setDirection] = useState<1 | -1>(1);
  const [tripStartDate, setTripStartDate] = useState<Date | null>(null);
  const [tripEndDate, setTripEndDate] = useState<Date | null>(null);

  const grid = useMemo(() => generateCalendarGrid(currentMonth), [currentMonth]);
  const heroImage = useMemo(() => getHeroImageForMonth(currentMonth), [currentMonth]);

  const goToNextMonth = () => {
    setDirection(1);
    setCurrentMonth((prev) => addMonths(prev, 1));
  };

  const goToPreviousMonth = () => {
    setDirection(-1);
    setCurrentMonth((prev) => addMonths(prev, -1));
  };

  const onSelectDate = (selectedDate: Date) => {
    if (!tripStartDate || (tripStartDate && tripEndDate)) {
      setTripStartDate(selectedDate);
      setTripEndDate(null);
      return;
    }

    if (selectedDate < tripStartDate) {
      setTripStartDate(selectedDate);
      return;
    }

    setTripEndDate(selectedDate);
  };

  return (
    <div className="w-full py-4">
      <CalendarFrame>
        <MonthNavigation monthDate={currentMonth} onPrevious={goToPreviousMonth} onNext={goToNextMonth} />
        <div className="relative overflow-hidden">
          <AnimatePresence initial={false} custom={direction} mode="wait">
            <motion.div
              key={currentMonth.toISOString()}
              custom={direction}
              initial={{ x: direction > 0 ? 120 : -120, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: direction > 0 ? -120 : 120, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
            >
              <HeroSection monthDate={currentMonth} imageUrl={heroImage} />
              <CalendarBody
                grid={grid}
                hoverDate={hoverDate}
                onHoverDate={setHoverDate}
                onSelectDate={onSelectDate}
                tripStartDate={tripStartDate}
                tripEndDate={tripEndDate}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </CalendarFrame>
    </div>
  );
}

export default CalendarWall;

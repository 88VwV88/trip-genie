import {
  addDays,
  format,
  isSameDay,
  isSameMonth,
  startOfMonth,
  subDays,
} from "date-fns";

export type CalendarDay = {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  isWeekend: boolean;
  isHoliday: boolean;
  holidayLabel?: string;
};

const HOLIDAYS: Record<string, string> = {
  "01-01": "New Year's Day",
  "12-25": "Christmas Day",
};

export const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const getHoliday = (date: Date) => HOLIDAYS[format(date, "MM-dd")];

export const generateCalendarGrid = (monthDate: Date): CalendarDay[][] => {
  const monthStart = startOfMonth(monthDate);
  const mondayFirstOffset = (monthStart.getDay() + 6) % 7;
  const gridStart = subDays(monthStart, mondayFirstOffset);

  const days: CalendarDay[] = Array.from({ length: 42 }, (_, index) => {
    const date = addDays(gridStart, index);
    const holidayLabel = getHoliday(date);
    const day = date.getDay();

    return {
      date,
      isCurrentMonth: isSameMonth(date, monthDate),
      isToday: isSameDay(date, new Date()),
      isWeekend: day === 0 || day === 6,
      isHoliday: Boolean(holidayLabel),
      holidayLabel,
    };
  });

  return days.reduce<CalendarDay[][]>((accumulator, day, index) => {
    const weekIndex = Math.floor(index / 7);

    if (!accumulator[weekIndex]) {
      accumulator[weekIndex] = [];
    }

    accumulator[weekIndex].push(day);
    return accumulator;
  }, []);
};

export const getHeroImageForMonth = (monthDate: Date) => {
  const month = monthDate.getMonth();
  const imageByMonth = [
    "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1484318571209-661cf29a69c3?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1498429089284-41f8cf3ffd39?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1465146344425-f00d5f5c8f07?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1472396961693-142e6e269027?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1476041800959-2f6bb412c8ce?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1477414348463-c0eb7f1359b6?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1418065460487-3e41a6c84dc5?auto=format&fit=crop&w=1400&q=80",
    "https://images.unsplash.com/photo-1510798831971-661eb04b3739?auto=format&fit=crop&w=1400&q=80",
  ];

  return imageByMonth[month];
};

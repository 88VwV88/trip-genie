import { format } from "date-fns";

export const formatMonthYear = (date: Date) => format(date, "MMMM yyyy");

export const formatMonthOverlay = (date: Date) => format(date, "MMMM yyyy").toUpperCase();

export const formatDayLabel = (date: Date) => format(date, "d");

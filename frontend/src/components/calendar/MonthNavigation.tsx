import { formatMonthYear } from "../../utils/formatDate";

type MonthNavigationProps = {
  monthDate: Date;
  onPrevious: () => void;
  onNext: () => void;
};

function MonthNavigation({ monthDate, onPrevious, onNext }: MonthNavigationProps) {
  return (
    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-3">
      <button
        type="button"
        onClick={onPrevious}
        aria-label="Go to previous month"
        className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <span aria-hidden="true">&larr;</span>
      </button>

      <h2 className="text-sm font-extrabold uppercase tracking-[0.14em] text-slate-700">
        {formatMonthYear(monthDate)}
      </h2>

      <button
        type="button"
        onClick={onNext}
        aria-label="Go to next month"
        className="rounded-full border border-slate-300 bg-white p-2 text-slate-700 transition hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
      >
        <span aria-hidden="true">&rarr;</span>
      </button>
    </div>
  );
}

export default MonthNavigation;

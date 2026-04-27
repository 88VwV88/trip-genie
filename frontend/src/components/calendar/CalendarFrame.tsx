import type { PropsWithChildren } from "react";
import { motion } from "framer-motion";

const HangingHook = () => (
  <div className="absolute -top-12 left-1/2 z-20 h-9 w-9 -translate-x-1/2 rounded-full border-[5px] border-slate-300 bg-white shadow-inner" />
);

const SpiralBinding = () => (
  <motion.div
    initial={{ y: -16, scaleY: 0.9 }}
    animate={{ y: 0, scaleY: 1 }}
    transition={{ type: "spring", stiffness: 300, damping: 14, delay: 0.15 }}
    className="absolute -top-3 left-6 right-6 z-10 flex justify-between"
  >
    {Array.from({ length: 9 }).map((_, index) => (
      <div
        key={`ring-${index}`}
        className="h-6 w-4 rounded-b-full border-2 border-slate-300 bg-slate-100 shadow-sm"
      />
    ))}
  </motion.div>
);

const BackgroundShadow = () => (
  <div className="pointer-events-none absolute inset-4 -z-10 rounded-2xl bg-slate-300/70 blur-xl" />
);

const CalendarCard = ({ children }: PropsWithChildren) => (
  <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-2xl">{children}</div>
);

type CalendarFrameProps = PropsWithChildren;

function CalendarFrame({ children }: CalendarFrameProps) {
  return (
    <motion.section
      initial={{ y: -200, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ type: "spring", stiffness: 120, damping: 16 }}
      whileHover={{ rotateX: 1.2, rotateY: -1.2 }}
      style={{ transformStyle: "preserve-3d" }}
      className="relative mx-auto w-full max-w-[480px] perspective-[1400px]"
      aria-label="Wall calendar"
    >
      <BackgroundShadow />
      <HangingHook />
      <SpiralBinding />
      <CalendarCard>{children}</CalendarCard>
    </motion.section>
  );
}

export default CalendarFrame;

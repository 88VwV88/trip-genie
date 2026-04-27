import { motion } from "framer-motion";
import { formatMonthOverlay } from "../../utils/formatDate";

type HeroSectionProps = {
  monthDate: Date;
  imageUrl: string;
};

function HeroSection({ monthDate, imageUrl }: HeroSectionProps) {
  return (
    <header className="relative h-52 overflow-hidden bg-slate-200">
      <motion.img
        initial={{ clipPath: "polygon(0 0, 72% 0, 56% 100%, 0 100%)", scale: 1.08 }}
        animate={{ clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)", scale: 1 }}
        transition={{ duration: 0.9, ease: "easeOut" }}
        src={imageUrl}
        alt={`${formatMonthOverlay(monthDate)} cover`}
        loading="lazy"
        className="h-full w-full object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-t from-slate-100/85 via-slate-100/25 to-transparent" />
      <div className="absolute inset-0 [clip-path:polygon(42%_0,100%_0,100%_100%,56%_100%)] bg-white/35" />
      <time
        dateTime={monthDate.toISOString()}
        className="absolute bottom-4 left-5 rounded-md bg-white/70 px-2 py-1 text-lg font-black uppercase tracking-[0.2em] text-slate-800 drop-shadow"
      >
        {formatMonthOverlay(monthDate)}
      </time>
    </header>
  );
}

export default HeroSection;

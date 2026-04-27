import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";

const generationSteps = [
  {
    label: "Understanding your vibe",
    description: "Analyzing destination, style & preferences",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4M12 8h.01" />
      </svg>
    ),
  },
  {
    label: "Curating the best spots",
    description: "Picking iconic & hidden-gem locations",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Building your timeline",
    description: "Organizing day-by-day schedule",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
  },
  {
    label: "Optimizing routes & stays",
    description: "Finding best hotels, transport & links",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
  },
  {
    label: "Adding finishing touches",
    description: "Budget tips, local hacks & packing advice",
    icon: (
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
  },
];

const travelFacts = [
  "Japan has over 6,800 islands to explore",
  "Iceland's roads have no traffic lights outside Reykjavik",
  "Venice is built on 118 small islands",
  "New Zealand was the first country to see sunrise",
  "Switzerland has enough nuclear shelters for its entire population",
  "Bhutan measures success by Gross National Happiness",
];

function TripGenerationLoader({ destination }) {
  const [activeStep, setActiveStep] = useState(0);
  const [factIndex, setFactIndex] = useState(0);

  useEffect(() => {
    const stepTimer = setInterval(() => {
      setActiveStep((prev) => (prev < generationSteps.length - 1 ? prev + 1 : prev));
    }, 4500);
    return () => clearInterval(stepTimer);
  }, []);

  useEffect(() => {
    const factTimer = setInterval(() => {
      setFactIndex((prev) => (prev + 1) % travelFacts.length);
    }, 5000);
    return () => clearInterval(factTimer);
  }, []);

  const totalSteps = generationSteps.length;
  const progressPercent = ((activeStep + 1) / totalSteps) * 100;

  return (
    <div className="mx-auto max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-xl shadow-slate-200/50 md:p-10">
      {/* Header */}
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-lg shadow-indigo-200"
        >
          <motion.svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="white"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            animate={{ y: [-2, 2, -2], rotate: [-5, 5, -5] }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z" />
          </motion.svg>
        </motion.div>

        <h2 className="text-2xl font-bold text-slate-800">
          Crafting your{" "}
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            {destination || "dream trip"}
          </span>
        </h2>
        <p className="mt-1 text-sm text-slate-500">
          Our AI is working its magic. This usually takes 15-30 seconds.
        </p>
      </div>

      {/* Circular progress */}
      <div className="mx-auto mt-8 flex justify-center">
        <div className="relative h-28 w-28">
          <svg width="112" height="112" viewBox="0 0 112 112" className="-rotate-90">
            <circle cx="56" cy="56" r="48" fill="none" stroke="#f1f5f9" strokeWidth="6" />
            <motion.circle
              cx="56"
              cy="56"
              r="48"
              fill="none"
              stroke="url(#genGrad)"
              strokeWidth="6"
              strokeLinecap="round"
              strokeDasharray={2 * Math.PI * 48}
              animate={{
                strokeDashoffset: 2 * Math.PI * 48 - (progressPercent / 100) * 2 * Math.PI * 48,
              }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
            />
            <defs>
              <linearGradient id="genGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="50%" stopColor="#0ea5e9" />
                <stop offset="100%" stopColor="#06b6d4" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex flex-col items-center justify-center">
            <span className="text-2xl font-bold text-slate-800">
              {activeStep + 1}
              <span className="text-sm font-normal text-slate-400">/{totalSteps}</span>
            </span>
          </div>
        </div>
      </div>

      {/* Steps timeline */}
      <div className="mt-8 space-y-1">
        {generationSteps.map((step, i) => {
          const isCompleted = i < activeStep;
          const isActive = i === activeStep;

          return (
            <motion.div
              key={step.label}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className={`flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-500 ${
                isActive
                  ? "border border-indigo-100 bg-indigo-50/60"
                  : isCompleted
                  ? "opacity-60"
                  : "opacity-30"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition-all duration-500 ${
                  isCompleted
                    ? "bg-gradient-to-br from-indigo-500 to-sky-500 text-white shadow-md shadow-indigo-200"
                    : isActive
                    ? "border border-indigo-200 bg-indigo-50 text-indigo-600"
                    : "border border-slate-200 bg-slate-50 text-slate-400"
                }`}
              >
                {isCompleted ? (
                  <motion.svg initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 13l4 4L19 7" />
                  </motion.svg>
                ) : (
                  step.icon
                )}
              </div>

              <div className="min-w-0 flex-1">
                <p className={`text-sm font-semibold ${isActive ? "text-slate-800" : "text-slate-600"}`}>
                  {step.label}
                </p>
                <p className="text-xs text-slate-400">{step.description}</p>
              </div>

              {isActive && (
                <motion.div className="flex gap-1" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      className="h-1.5 w-1.5 rounded-full bg-indigo-500"
                      animate={{ opacity: [0.3, 1, 0.3] }}
                      transition={{ duration: 1, repeat: Infinity, delay: d * 0.2 }}
                    />
                  ))}
                </motion.div>
              )}
              {isCompleted && (
                <span className="text-xs font-medium text-emerald-500">Done</span>
              )}
            </motion.div>
          );
        })}
      </div>

      {/* Full-width progress bar */}
      <div className="mt-6 h-1.5 overflow-hidden rounded-full bg-slate-100">
        <motion.div
          className="h-full rounded-full"
          style={{
            background: "linear-gradient(90deg, #6366f1, #0ea5e9, #06b6d4, #0ea5e9, #6366f1)",
            backgroundSize: "200% 100%",
          }}
          animate={{
            width: `${progressPercent}%`,
            backgroundPosition: ["0% 0%", "100% 0%", "0% 0%"],
          }}
          transition={{
            width: { duration: 0.8, ease: "easeInOut" },
            backgroundPosition: { duration: 3, repeat: Infinity, ease: "linear" },
          }}
        />
      </div>

      {/* Travel fact ticker */}
      <div className="mt-6 overflow-hidden rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
        <p className="mb-1 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
          Did you know?
        </p>
        <AnimatePresence mode="wait">
          <motion.p
            key={factIndex}
            className="text-sm text-slate-600"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4 }}
          >
            {travelFacts[factIndex]}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default TripGenerationLoader;

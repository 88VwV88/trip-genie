import { motion } from "framer-motion";
import { useState, useEffect } from "react";

const loadingSteps = [
  { label: "Warming up the genie lamp" },
  { label: "Checking your credentials" },
  { label: "Preparing your dashboard" },
];

function LoadingScreen() {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const stepInterval = setInterval(() => {
      setCurrentStep((prev) =>
        prev < loadingSteps.length - 1 ? prev + 1 : prev
      );
    }, 1200);
    return () => clearInterval(stepInterval);
  }, []);

  useEffect(() => {
    const progressInterval = setInterval(() => {
      setProgress((prev) => (prev < 95 ? prev + 1.5 : prev));
    }, 40);
    return () => clearInterval(progressInterval);
  }, []);

  const circumference = 2 * Math.PI * 54;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-hidden bg-white/90 backdrop-blur-xl">
      {/* Soft gradient blobs */}
      <div className="pointer-events-none absolute -top-32 -left-32 h-96 w-96 rounded-full bg-indigo-100 opacity-60 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-sky-100 opacity-60 blur-3xl" />

      {/* Main content */}
      <motion.div
        className="relative flex flex-col items-center"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 120, damping: 14 }}
      >
        {/* Circular progress ring */}
        <div className="relative flex items-center justify-center">
          {/* Outer glow ring */}
          <motion.div
            className="absolute rounded-full"
            style={{
              width: 160,
              height: 160,
              background:
                "conic-gradient(from 0deg, rgba(99,102,241,0.08), rgba(14,165,233,0.08), rgba(99,102,241,0.08))",
              filter: "blur(20px)",
            }}
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
          />

          {/* SVG ring */}
          <svg width="140" height="140" viewBox="0 0 120 120" className="relative -rotate-90">
            <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="5" />
            <motion.circle
              cx="60"
              cy="60"
              r="54"
              fill="none"
              stroke="url(#progressGradient)"
              strokeWidth="5"
              strokeLinecap="round"
              strokeDasharray={circumference}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#6366f1" />
                <stop offset="100%" stopColor="#0ea5e9" />
              </linearGradient>
            </defs>
          </svg>

          {/* Inner logo / icon area */}
          <div className="absolute flex flex-col items-center justify-center">
            <motion.div
              animate={{ rotateY: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 1 }}
              style={{ perspective: 600 }}
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-sky-500 shadow-lg shadow-indigo-200">
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M13 2L4.09 12.63a1 1 0 00.77 1.62H11v5.75a.5.5 0 00.9.3L20.91 9.37a1 1 0 00-.77-1.62H13V2.25a.5.5 0 00-.9-.3L13 2z" />
                </svg>
              </div>
            </motion.div>
            <span className="mt-2 text-xs font-bold text-slate-400">
              {Math.round(progress)}%
            </span>
          </div>
        </div>

        {/* Brand name */}
        <motion.h1
          className="mt-8 text-2xl font-black tracking-tight"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <span className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-transparent">
            Trip Genie
          </span>
          <span className="ml-1.5 text-sm font-semibold text-slate-400">AI</span>
        </motion.h1>

        {/* Step indicators */}
        <div className="mt-8 flex flex-col gap-3">
          {loadingSteps.map((step, i) => (
            <motion.div
              key={step.label}
              className="flex items-center gap-3"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: i <= currentStep ? 1 : 0.3, x: 0 }}
              transition={{ delay: 0.5 + i * 0.2, duration: 0.4 }}
            >
              <div className="relative flex h-7 w-7 items-center justify-center">
                {i < currentStep ? (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  </motion.div>
                ) : i === currentStep ? (
                  <motion.div
                    className="h-7 w-7 rounded-full border-2 border-indigo-400"
                    animate={{ boxShadow: ["0 0 0 0 rgba(99,102,241,0.3)", "0 0 0 8px rgba(99,102,241,0)"] }}
                    transition={{ duration: 1.2, repeat: Infinity }}
                  >
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-2.5 w-2.5 rounded-full bg-indigo-500" />
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-7 w-7 rounded-full border-2 border-slate-200">
                    <div className="flex h-full w-full items-center justify-center">
                      <div className="h-2 w-2 rounded-full bg-slate-200" />
                    </div>
                  </div>
                )}
              </div>
              <span className={`text-sm font-medium ${i <= currentStep ? "text-slate-700" : "text-slate-400"}`}>
                {step.label}
              </span>
            </motion.div>
          ))}
        </div>

        {/* Animated progress bar */}
        <motion.div
          className="mt-8 h-1.5 w-48 overflow-hidden rounded-full bg-slate-100"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default LoadingScreen;

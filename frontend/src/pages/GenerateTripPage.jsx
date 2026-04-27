import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import api from "../lib/api";
import TripGenerationLoader from "../components/TripGenerationLoader";

/* ───────────── data ───────────── */

const steps = [
  { id: 0, title: "Destination", icon: "M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z M12 10m-3 0a3 3 0 106 0 3 3 0 10-6 0" },
  { id: 1, title: "Duration", icon: "M8 2v4 M16 2v4 M3 10h18 M5 4h14a2 2 0 012 2v14a2 2 0 01-2 2H5a2 2 0 01-2-2V6a2 2 0 012-2z" },
  { id: 2, title: "Style", icon: "M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" },
  { id: 3, title: "Interests", icon: "M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" },
  { id: 4, title: "Launch", icon: "M22 2L11 13 M22 2l-7 20-4-9-9-4 20-7z" },
];

const popularDestinations = [
  { name: "Bali", emoji: "🏝️", country: "Indonesia" },
  { name: "Kyoto", emoji: "⛩️", country: "Japan" },
  { name: "Santorini", emoji: "🏛️", country: "Greece" },
  { name: "Ladakh", emoji: "🏔️", country: "India" },
  { name: "Marrakech", emoji: "🕌", country: "Morocco" },
  { name: "Reykjavik", emoji: "🌋", country: "Iceland" },
];

const travelStyles = [
  {
    value: "budget",
    label: "Budget",
    emoji: "🎒",
    description: "Smart spending, hostels & street food",
    color: "from-emerald-50 to-teal-50",
    border: "border-emerald-300",
    text: "text-emerald-700",
    activeBg: "bg-emerald-50",
  },
  {
    value: "luxury",
    label: "Luxury",
    emoji: "👑",
    description: "5-star stays, fine dining & VIP access",
    color: "from-amber-50 to-orange-50",
    border: "border-amber-300",
    text: "text-amber-700",
    activeBg: "bg-amber-50",
  },
  {
    value: "backpacking",
    label: "Backpacking",
    emoji: "🥾",
    description: "Off the beaten path, raw adventure",
    color: "from-sky-50 to-blue-50",
    border: "border-sky-300",
    text: "text-sky-700",
    activeBg: "bg-sky-50",
  },
  {
    value: "family",
    label: "Family",
    emoji: "👨‍👩‍👧‍👦",
    description: "Kid-friendly, safe & fun for everyone",
    color: "from-violet-50 to-purple-50",
    border: "border-violet-300",
    text: "text-violet-700",
    activeBg: "bg-violet-50",
  },
];

const interestOptions = [
  { label: "Food & Cuisine", emoji: "🍜" },
  { label: "Nature & Hiking", emoji: "🌿" },
  { label: "Local Culture", emoji: "🎭" },
  { label: "Nightlife", emoji: "🌙" },
  { label: "Shopping", emoji: "🛍️" },
  { label: "Photography", emoji: "📸" },
  { label: "Adventure Sports", emoji: "🪂" },
  { label: "Historical Sites", emoji: "🏛️" },
  { label: "Beaches", emoji: "🏖️" },
  { label: "Wellness & Spa", emoji: "🧘" },
  { label: "Art & Museums", emoji: "🎨" },
  { label: "Cafes & Coffee", emoji: "☕" },
  { label: "Wildlife", emoji: "🦁" },
  { label: "Street Markets", emoji: "🏪" },
  { label: "Temples & Shrines", emoji: "🛕" },
];

const months = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

/* ───────────── helpers ───────────── */

function StepIcon({ d, size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      {d.split(" M").map((seg, i) => (
        <path key={i} d={i === 0 ? seg : `M${seg}`} />
      ))}
    </svg>
  );
}

/* ───────────── main page ───────────── */

function GenerateTripPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [activeStep, setActiveStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    destination: searchParams.get("destination")?.trim() || "",
    days: (() => {
      const daysParam = Number(searchParams.get("days"));
      return Number.isFinite(daysParam) && daysParam > 0 ? Math.min(daysParam, 30) : 4;
    })(),
    budget: "",
    interests: ["Food & Cuisine", "Nature & Hiking", "Local Culture"],
    style: "budget",
    month: searchParams.get("month")?.trim() || "December",
  });

  const set = (key) => (val) =>
    setForm((prev) => ({
      ...prev,
      [key]: typeof val === "function" ? val(prev[key]) : val,
    }));

  const toggleInterest = (label) => {
    setForm((prev) => {
      const arr = prev.interests.includes(label)
        ? prev.interests.filter((i) => i !== label)
        : [...prev.interests, label];
      return { ...prev, interests: arr };
    });
  };

  const canAdvance = () => {
    if (activeStep === 0) return form.destination.trim().length > 0;
    if (activeStep === 1) return form.days > 0;
    if (activeStep === 2) return form.style;
    if (activeStep === 3) return form.interests.length > 0;
    return true;
  };

  const onSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      const payload = {
        ...form,
        budget: form.budget?.trim() || "Not specified",
        interests: form.interests.map((i) => i.toLowerCase()),
      };
      const res = await api.post("/api/trips/generate", payload);
      navigate(`/trips/${res.data.data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to generate trip");
      setLoading(false);
    }
  };

  if (loading) {
    return <TripGenerationLoader destination={form.destination} />;
  }

  const progressPercent = ((activeStep + 1) / steps.length) * 100;

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      {/* ── Top progress bar ── */}
      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between">
          {steps.map((step, i) => {
            const isActive = i === activeStep;
            const isCompleted = i < activeStep;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => i <= activeStep && setActiveStep(i)}
                className="group flex flex-1 flex-col items-center gap-1.5"
              >
                <motion.div
                  className={`relative flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300 ${
                    isActive
                      ? "border-indigo-500 bg-indigo-50 text-indigo-600"
                      : isCompleted
                      ? "border-indigo-500 bg-gradient-to-br from-indigo-500 to-sky-500 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-400"
                  }`}
                  whileHover={i <= activeStep ? { scale: 1.1 } : {}}
                  whileTap={i <= activeStep ? { scale: 0.95 } : {}}
                >
                  {isCompleted ? (
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                  ) : (
                    <StepIcon d={step.icon} size={16} />
                  )}
                  {isActive && (
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-indigo-300"
                      animate={{ scale: [1, 1.3, 1], opacity: [0.6, 0, 0.6] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                </motion.div>
                <span className={`text-xs font-medium transition ${isActive ? "text-indigo-600" : isCompleted ? "text-slate-700" : "text-slate-400"}`}>
                  {step.title}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mx-auto mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
          <motion.div
            className="h-full rounded-full bg-gradient-to-r from-indigo-500 to-sky-500"
            animate={{ width: `${progressPercent}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          />
        </div>
      </div>

      {/* ── Main card ── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeStep}
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -24, scale: 0.98 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10"
        >
          {/* ── STEP 0 : Destination ── */}
          {activeStep === 0 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Where do you want to go?</h2>
              <p className="mt-1 text-sm text-slate-500">Type a destination or pick a popular one below</p>

              <div className="mt-6">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. Bali, Kyoto, Swiss Alps..."
                    value={form.destination}
                    onChange={(e) => set("destination")(e.target.value)}
                    className="field w-full rounded-2xl py-4 pl-12 pr-4 text-lg outline-none transition"
                  />
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <circle cx="11" cy="11" r="8" />
                      <path d="M21 21l-4.35-4.35" />
                    </svg>
                  </div>
                </div>
              </div>

              <p className="mt-6 text-xs font-semibold uppercase tracking-widest text-slate-400">Popular Destinations</p>
              <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
                {popularDestinations.map((dest) => (
                  <motion.button
                    key={dest.name}
                    type="button"
                    onClick={() => set("destination")(dest.name)}
                    whileHover={{ scale: 1.03, y: -2 }}
                    whileTap={{ scale: 0.97 }}
                    className={`group flex items-center gap-3 rounded-2xl border px-4 py-3 text-left transition-all ${
                      form.destination === dest.name
                        ? "border-indigo-300 bg-indigo-50"
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    <span className="text-2xl">{dest.emoji}</span>
                    <div>
                      <p className={`text-sm font-semibold ${form.destination === dest.name ? "text-indigo-700" : "text-slate-700"}`}>
                        {dest.name}
                      </p>
                      <p className="text-xs text-slate-400">{dest.country}</p>
                    </div>
                  </motion.button>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1 : Duration & Month ── */}
          {activeStep === 1 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800">How long is your trip?</h2>
              <p className="mt-1 text-sm text-slate-500">Drag the slider or tap the number to set days</p>

              <div className="mt-8 flex flex-col items-center">
                <div className="relative">
                  <svg width="160" height="160" viewBox="0 0 160 160" className="-rotate-90">
                    <circle cx="80" cy="80" r="68" fill="none" stroke="#f1f5f9" strokeWidth="8" />
                    <motion.circle
                      cx="80" cy="80" r="68" fill="none"
                      stroke="url(#dayGrad)" strokeWidth="8" strokeLinecap="round"
                      strokeDasharray={2 * Math.PI * 68}
                      animate={{ strokeDashoffset: 2 * Math.PI * 68 - (form.days / 30) * 2 * Math.PI * 68 }}
                      transition={{ duration: 0.4, ease: "easeOut" }}
                    />
                    <defs>
                      <linearGradient id="dayGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#6366f1" />
                        <stop offset="100%" stopColor="#0ea5e9" />
                      </linearGradient>
                    </defs>
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <motion.span key={form.days} initial={{ scale: 1.3, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="text-4xl font-black text-slate-800">
                      {form.days}
                    </motion.span>
                    <span className="text-xs font-medium text-slate-400">{form.days === 1 ? "day" : "days"}</span>
                  </div>
                </div>

                <div className="mt-6 w-full max-w-md">
                  <input type="range" min={1} max={30} value={form.days} onChange={(e) => set("days")(Number(e.target.value))} className="slider-fancy w-full" />
                  <div className="mt-2 flex justify-between text-xs text-slate-400">
                    <span>1 day</span><span>Weekend</span><span>Week</span><span>2 Weeks</span><span>Month</span>
                  </div>
                </div>

                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  {[3, 5, 7, 10, 14, 21].map((d) => (
                    <motion.button
                      key={d} type="button" onClick={() => set("days")(d)}
                      whileHover={{ scale: 1.08 }} whileTap={{ scale: 0.92 }}
                      className={`rounded-full border px-4 py-1.5 text-sm font-medium transition ${
                        form.days === d
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {d}d
                    </motion.button>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-slate-400">Travel month</p>
                <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
                  {months.map((m) => (
                    <motion.button
                      key={m} type="button" onClick={() => set("month")(m)}
                      whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                      className={`rounded-xl border px-2 py-2 text-xs font-medium transition ${
                        form.month === m
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
                      }`}
                    >
                      {m.slice(0, 3)}
                    </motion.button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 : Travel Style & Budget ── */}
          {activeStep === 2 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Pick your travel style</h2>
              <p className="mt-1 text-sm text-slate-500">This helps us tailor accommodation, food & activities</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {travelStyles.map((ts) => (
                  <motion.button
                    key={ts.value} type="button" onClick={() => set("style")(ts.value)}
                    whileHover={{ scale: 1.02, y: -3 }} whileTap={{ scale: 0.98 }}
                    className={`relative overflow-hidden rounded-2xl border p-5 text-left transition-all duration-300 ${
                      form.style === ts.value
                        ? `${ts.border} bg-gradient-to-br ${ts.color}`
                        : "border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm"
                    }`}
                  >
                    {form.style === ts.value && (
                      <motion.div
                        layoutId="style-indicator"
                        className="absolute right-3 top-3 flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-indigo-500 to-sky-500"
                        transition={{ type: "spring", stiffness: 300, damping: 20 }}
                      >
                        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round">
                          <path d="M5 13l4 4L19 7" />
                        </svg>
                      </motion.div>
                    )}
                    <span className="text-3xl">{ts.emoji}</span>
                    <p className={`mt-2 text-base font-bold ${form.style === ts.value ? ts.text : "text-slate-700"}`}>
                      {ts.label}
                    </p>
                    <p className="mt-0.5 text-xs text-slate-400">{ts.description}</p>
                  </motion.button>
                ))}
              </div>

              <div className="mt-6">
                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-slate-400">Budget (optional)</p>
                <div className="relative">
                  <input
                    type="text" placeholder="e.g. 30000 INR, $2000 USD..."
                    value={form.budget} onChange={(e) => set("budget")(e.target.value)}
                    className="field w-full rounded-2xl py-3.5 pl-12 pr-4 outline-none transition"
                  />
                  <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-slate-400">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                      <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 : Interests ── */}
          {activeStep === 3 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800">What excites you?</h2>
              <p className="mt-1 text-sm text-slate-500">Pick at least 2 interests to personalize your trip</p>

              <div className="mt-4 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-50 text-sm font-bold text-indigo-600">
                  {form.interests.length}
                </div>
                <span className="text-sm text-slate-500">selected</span>
                <svg width="24" height="24" viewBox="0 0 24 24" className="-rotate-90">
                  <circle cx="12" cy="12" r="9" fill="none" stroke="#f1f5f9" strokeWidth="3" />
                  <circle
                    cx="12" cy="12" r="9" fill="none" stroke="#6366f1" strokeWidth="3" strokeLinecap="round"
                    strokeDasharray={2 * Math.PI * 9}
                    strokeDashoffset={2 * Math.PI * 9 - (Math.min(form.interests.length, interestOptions.length) / interestOptions.length) * 2 * Math.PI * 9}
                  />
                </svg>
              </div>

              <div className="mt-5 flex flex-wrap gap-2.5">
                {interestOptions.map((interest) => {
                  const selected = form.interests.includes(interest.label);
                  return (
                    <motion.button
                      key={interest.label} type="button" onClick={() => toggleInterest(interest.label)}
                      whileHover={{ scale: 1.06 }} whileTap={{ scale: 0.94 }} layout
                      className={`flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-medium transition-all duration-200 ${
                        selected
                          ? "border-indigo-300 bg-indigo-50 text-indigo-700 shadow-sm"
                          : "border-slate-200 bg-white text-slate-500 hover:border-slate-300 hover:text-slate-700"
                      }`}
                    >
                      <span className="text-base">{interest.emoji}</span>
                      {interest.label}
                      {selected && (
                        <motion.span initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-1 text-indigo-500">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                            <path d="M5 13l4 4L19 7" />
                          </svg>
                        </motion.span>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ── STEP 4 : Review & Launch ── */}
          {activeStep === 4 && (
            <div>
              <h2 className="text-2xl font-bold text-slate-800">Ready to launch?</h2>
              <p className="mt-1 text-sm text-slate-500">Review your trip details and let the genie do its thing</p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Destination</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{form.destination || "Not set"}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Duration</p>
                  <p className="mt-1 text-lg font-bold text-slate-800">{form.days} days in {form.month}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Style</p>
                  <p className="mt-1 text-lg font-bold capitalize text-slate-800">
                    {travelStyles.find((s) => s.value === form.style)?.emoji} {form.style}
                  </p>
                  {form.budget && <p className="mt-0.5 text-sm text-slate-500">Budget: {form.budget}</p>}
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">Interests</p>
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {form.interests.map((int) => (
                      <span key={int} className="chip rounded-full px-2.5 py-1 text-xs">{int}</span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-indigo-100 bg-indigo-50/60 px-5 py-4">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 6v6l4 2" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">AI will generate a detailed itinerary</p>
                  <p className="text-xs text-slate-400">Estimated time: 15-30 seconds with Claude AI</p>
                </div>
              </div>
            </div>
          )}

          {/* ── Error ── */}
          {error && (
            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="mt-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600"
            >
              {error}
            </motion.div>
          )}

          {/* ── Navigation buttons ── */}
          <div className="mt-8 flex items-center justify-between">
            <button
              type="button" onClick={() => setActiveStep((v) => Math.max(0, v - 1))} disabled={activeStep === 0}
              className="btn-secondary flex items-center gap-2 rounded-xl px-5 py-3 font-semibold transition disabled:opacity-30"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M19 12H5M12 19l-7-7 7-7" />
              </svg>
              Back
            </button>

            {activeStep < steps.length - 1 ? (
              <motion.button
                type="button"
                onClick={() => setActiveStep((v) => Math.min(steps.length - 1, v + 1))}
                disabled={!canAdvance()}
                whileHover={canAdvance() ? { scale: 1.03 } : {}}
                whileTap={canAdvance() ? { scale: 0.97 } : {}}
                className="btn-primary flex items-center gap-2 rounded-xl px-6 py-3 font-semibold transition disabled:opacity-40"
              >
                Continue
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </motion.button>
            ) : (
              <motion.button
                type="button" onClick={onSubmit}
                whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                className="group relative overflow-hidden rounded-xl px-8 py-3.5 font-bold text-white shadow-lg shadow-indigo-200 transition"
                style={{ background: "linear-gradient(135deg, #6366f1, #0ea5e9)" }}
              >
                <span className="relative z-10 flex items-center gap-2">
                  Generate Trip
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
                  </svg>
                </span>
              </motion.button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

export default GenerateTripPage;

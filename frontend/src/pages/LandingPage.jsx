import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../hooks/useAuth";

const features = [
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" />
      </svg>
    ),
    title: "AI-Powered Itineraries",
    description:
      "Get detailed day-by-day plans crafted by Claude AI, tailored to your style, budget, and interests.",
    color: "bg-indigo-50 text-indigo-600",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    ),
    title: "Smart Regeneration",
    description:
      "Don't like one section? Regenerate just that part without losing the rest of your perfectly planned trip.",
    color: "bg-amber-50 text-amber-600",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="4" width="18" height="18" rx="2" />
        <path d="M16 2v4M8 2v4M3 10h18" />
      </svg>
    ),
    title: "Timeline & Scheduling",
    description:
      "Organized timelines with activities, transport tips, and check-in times you can actually follow.",
    color: "bg-emerald-50 text-emerald-600",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
    title: "Hotel & Booking Links",
    description:
      "Curated hotel recommendations and direct booking links so you go from plan to booked in minutes.",
    color: "bg-sky-50 text-sky-600",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    title: "Budget Breakdown",
    description:
      "Detailed cost estimates for accommodation, food, transport, and activities with money-saving tips.",
    color: "bg-rose-50 text-rose-600",
  },
  {
    icon: (
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L2 7l10 5 10-5-10-5z" />
        <path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
      </svg>
    ),
    title: "Multi-Step Wizard",
    description:
      "A guided 5-step flow that makes trip planning feel effortless. Just answer, click, and go.",
    color: "bg-violet-50 text-violet-600",
  },
];

const stats = [
  { value: "10k+", label: "Trips generated" },
  { value: "150+", label: "Destinations" },
  { value: "4.9", label: "User rating" },
  { value: "<30s", label: "Generation time" },
];

const destinations = [
  { name: "Bali", img: "🏝️", tagline: "Island paradise" },
  { name: "Kyoto", img: "⛩️", tagline: "Ancient temples" },
  { name: "Santorini", img: "🏛️", tagline: "Sunset views" },
  { name: "Swiss Alps", img: "🏔️", tagline: "Mountain escapes" },
  { name: "Marrakech", img: "🕌", tagline: "Desert magic" },
  { name: "Iceland", img: "🌋", tagline: "Northern lights" },
];

const planningTimeline = [
  {
    title: "Share your trip preferences",
    detail:
      "Tell Trip Genie your destination, dates, budget, and travel style in the wizard.",
  },
  {
    title: "Generate your full itinerary",
    detail:
      "AI builds a day-wise plan with activities, stays, links, and budget insights.",
  },
  {
    title: "Edit and personalize",
    detail:
      "Regenerate any section, tweak activities, and tailor the plan to your pace.",
  },
  {
    title: "Save and travel",
    detail:
      "Store your final trip and use it as a practical timeline while you explore.",
  },
];

const stagger = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1 } },
};

const fadeUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

function LandingPage() {
  const { user } = useAuth();

  return (
    <div className="space-y-20 pb-16">
      {/* ── HERO ── */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 px-8 py-16 text-white shadow-2xl shadow-indigo-200/60 md:px-14 md:py-24">
        {/* Decorative shapes */}
        <div className="pointer-events-none absolute -right-20 -top-20 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 -left-16 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-40 w-40 rounded-full bg-white/5 blur-2xl" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10"
        >
          <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.15em] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
            Powered by Claude AI
          </span>

          <h1 className="mt-6 max-w-3xl text-4xl font-black leading-[1.1] tracking-tight md:text-6xl">
            Plan your dream trip in under 30 seconds.
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/85 md:text-xl">
            Generate detailed day-by-day itineraries, get hotel recommendations,
            budget breakdowns, and booking links. All from a simple 5-step
            wizard.
          </p>

          <div className="mt-10 flex flex-wrap gap-4">
            {/* <Link
              to={user ? "/generate" : "/register"}
              className="group relative z-10 inline-flex items-center gap-2 rounded-2xl bg-white px-7 py-4 text-sm font-bold text-indigo-700 ring-2 ring-white/70 shadow-lg shadow-indigo-900/20 transition hover:-translate-y-0.5 hover:shadow-xl"
            >
              {user ? "Start planning" : "Get started free"}
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="transition group-hover:translate-x-1">
                <path d="M5 12h14M12 5l7 7-7 7" />
              </svg>
            </Link> */}
            <Link
              to="/saved-trips"
              className="relative z-10 inline-flex items-center gap-2 rounded-2xl border-2 border-white/70 bg-white/10 px-7 py-4 text-sm font-semibold text-white ring-1 ring-white/40 transition hover:bg-white/20"
            >
              View saved trips
            </Link>
          </div>
        </motion.div>

        {/* Floating travel icons */}
        <motion.div
          className="pointer-events-none absolute bottom-8 right-8 text-6xl opacity-20 md:right-16 md:text-8xl"
          animate={{ y: [-8, 8, -8], rotate: [-3, 3, -3] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        >
          ✈️
        </motion.div>
        <motion.div
          className="pointer-events-none absolute right-32 top-12 text-4xl opacity-15 md:right-48 md:text-6xl"
          animate={{ y: [6, -6, 6] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        >
          🗺️
        </motion.div>
      </section>

      {/* ── TIMELINE UI ── */}
      <section className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm md:p-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
              Timeline
            </span>
            <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
              From idea to itinerary in minutes
            </h2>
          </div>
          <Link
            to={user ? "/generate" : "/register"}
            className="btn-primary rounded-xl px-5 py-3 text-sm font-semibold"
          >
            Start your timeline
          </Link>
        </div>
        <div className="mt-8 space-y-5">
          {planningTimeline.map((item, index) => (
            <article
              key={item.title}
              className="flex gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-indigo-600 text-sm font-bold text-white">
                {index + 1}
              </div>
              <div>
                <h3 className="text-base font-bold text-slate-800">
                  {item.title}
                </h3>
                <p className="mt-1 text-sm text-slate-600">{item.detail}</p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── STATS BAR ── */}
      <motion.section
        variants={stagger}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
        className="grid grid-cols-2 gap-4 md:grid-cols-4"
      >
        {stats.map((stat) => (
          <motion.div
            key={stat.label}
            variants={fadeUp}
            className="rounded-2xl border border-slate-200 bg-white p-6 text-center shadow-sm"
          >
            <p className="bg-gradient-to-r from-indigo-600 to-sky-500 bg-clip-text text-3xl font-black text-transparent">
              {stat.value}
            </p>
            <p className="mt-1 text-sm font-medium text-slate-500">
              {stat.label}
            </p>
          </motion.div>
        ))}
      </motion.section>

      {/* ── FEATURES GRID ── */}
      <section>
        <div className="text-center">
          <span className="inline-flex rounded-full bg-indigo-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-indigo-600">
            Features
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
            Everything you need for the perfect trip
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-slate-500">
            From ideation to booking, Trip Genie handles the heavy lifting so
            you can focus on what matters - the adventure.
          </p>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3"
        >
          {features.map((f) => (
            <motion.article
              key={f.title}
              variants={fadeUp}
              whileHover={{ y: -4 }}
              className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition hover:shadow-lg hover:shadow-slate-200/60"
            >
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${f.color}`}
              >
                {f.icon}
              </div>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {f.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {f.description}
              </p>
            </motion.article>
          ))}
        </motion.div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section>
        <div className="text-center">
          <span className="inline-flex rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-emerald-600">
            How it works
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
            Three steps to your dream trip
          </h2>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="mt-12 grid gap-8 md:grid-cols-3"
        >
          {[
            {
              step: "01",
              title: "Tell us your vibe",
              desc: "Choose your destination, travel style, budget, and interests through our guided wizard.",
              gradient: "from-indigo-500 to-sky-500",
            },
            {
              step: "02",
              title: "AI crafts your plan",
              desc: "Claude AI generates a complete itinerary with hotels, timelines, budget tips, and booking links.",
              gradient: "from-sky-500 to-cyan-500",
            },
            {
              step: "03",
              title: "Tweak & travel",
              desc: "Review, regenerate any section you want, save it, and head out with confidence.",
              gradient: "from-cyan-500 to-emerald-500",
            },
          ].map((item) => (
            <motion.div
              key={item.step}
              variants={fadeUp}
              className="relative rounded-2xl border border-slate-200 bg-white p-7 shadow-sm"
            >
              <span
                className={`inline-flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br ${item.gradient} text-sm font-black text-white`}
              >
                {item.step}
              </span>
              <h3 className="mt-4 text-lg font-bold text-slate-800">
                {item.title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-slate-500">
                {item.desc}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── POPULAR DESTINATIONS ── */}
      <section>
        <div className="text-center">
          <span className="inline-flex rounded-full bg-sky-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-sky-600">
            Trending
          </span>
          <h2 className="mt-4 text-3xl font-black tracking-tight text-slate-800 md:text-4xl">
            Popular destinations
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-slate-500">
            Pick one and let AI build your perfect trip in seconds
          </p>
        </div>
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.2 }}
          className="mt-10 grid grid-cols-2 gap-4 md:grid-cols-3 lg:grid-cols-6"
        >
          {destinations.map((d) => (
            <motion.div
              key={d.name}
              variants={fadeUp}
              whileHover={{ y: -6, scale: 1.03 }}
              className="cursor-pointer rounded-2xl border border-slate-200 bg-white p-5 text-center shadow-sm transition hover:shadow-lg hover:shadow-indigo-100"
            >
              <span className="text-4xl">{d.img}</span>
              <p className="mt-3 text-sm font-bold text-slate-800">{d.name}</p>
              <p className="text-xs text-slate-400">{d.tagline}</p>
            </motion.div>
          ))}
        </motion.div>
      </section>

      {/* ── CTA SECTION ── */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-r from-indigo-600 to-sky-500 px-8 py-14 text-center text-white shadow-xl shadow-indigo-200/50 md:px-16 md:py-20">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl font-black tracking-tight md:text-5xl">
            Ready to plan your next adventure?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">
            Join thousands of travellers who plan smarter, not harder. It's free
            to get started.
          </p>
        </motion.div>
      </section>
    </div>
  );
}

export default LandingPage;

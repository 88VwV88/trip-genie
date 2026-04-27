import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";

const tabs = ["overview", "timeline", "hotels", "tips", "edits"];
const sectionCardClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

function normalizeTripData(trip) {
  const itinerary = trip?.itinerary || {};
  if (itinerary.tripSummary && Array.isArray(itinerary.days)) {
    return { summary: itinerary.tripSummary, days: itinerary.days, travelTips: itinerary.travelTips || [] };
  }
  const legacy = Array.isArray(itinerary.itinerary) ? itinerary.itinerary : [];
  return {
    summary: {
      destination: itinerary.destination || trip.destination,
      totalDays: String(trip.days || legacy.length || 1),
      description: itinerary.overview || "",
      estimatedBudget: itinerary.estimated_budget?.total_estimate || trip.budget || "",
    },
    days: legacy.map((d, i) => ({
      day: d.day || i + 1, date: "", theme: d.title || `Day ${i + 1}`,
      activities: (d.activities || []).map((a) => ({
        time: a.time || "Flexible", locationName: a.place || "Activity", description: a.description || "",
        category: "sightseeing", estimatedDuration: "", estimatedCost: a.cost_estimate || "",
        travelTimeFromPrevious: "", coordinates: { lat: "", lng: "" }, images: [],
      })),
      restaurants: (d.food_recommendations || []).map((r) => ({
        name: r.restaurant || "Restaurant", speciality: r.dish || "", priceRange: "", images: [],
      })),
      dailyTips: "",
    })),
    travelTips: itinerary.travel_tips || [],
  };
}

function ImageHoverCard({ images = [], alt }) {
  const [hovered, setHovered] = useState(null);
  if (!images.length) return null;
  return (
    <div className="mt-2 flex gap-2 overflow-x-auto">
      {images.map((url, i) => (
        <div key={url} className="group relative shrink-0" onMouseEnter={() => setHovered(i)} onMouseLeave={() => setHovered(null)}>
          <img src={url} alt={`${alt} ${i + 1}`} className="h-16 w-20 cursor-pointer rounded-lg object-cover border border-slate-200 transition group-hover:border-indigo-300 group-hover:shadow-md" loading="lazy" />
          <AnimatePresence>
            {hovered === i && (
              <motion.div initial={{ opacity: 0, scale: 0.9, y: 8 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.9, y: 8 }} className="absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2">
                <img src={url} alt={`${alt} preview`} className="h-48 w-64 rounded-xl border border-slate-200 object-cover shadow-2xl" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Edit panel for shared viewers ── */
function SharedEditPanel({ token, trip, onTripUpdated }) {
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [section, setSection] = useState("general");
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const submitEdit = async (e) => {
    e.preventDefault();
    if (!name.trim() || !note.trim()) return;
    setSaving(true);
    setSuccess(false);
    try {
      const res = await api.patch(`/api/trips/shared/${token}`, {
        editorName: name.trim(),
        section,
        description: note.trim(),
      });
      onTripUpdated(res.data.data);
      setNote("");
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch {
      // silent
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submitEdit} className="rounded-2xl border border-indigo-200 bg-indigo-50/50 p-5">
      <h3 className="text-base font-bold text-slate-800">Suggest a change</h3>
      <p className="mt-1 text-xs text-slate-500">Your name and changes will be recorded in the recommended changes list.</p>
      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">Your name</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Priya" className="field w-full rounded-lg px-3 py-2 text-sm outline-none" required />
        </div>
        <div>
          <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">Section</label>
          <select value={section} onChange={(e) => setSection(e.target.value)} className="field w-full rounded-lg px-3 py-2 text-sm outline-none">
            <option value="general">General</option>
            <option value="overview">Overview</option>
            <option value="timeline">Timeline</option>
            <option value="hotels">Hotels</option>
            <option value="tips">Tips</option>
            <option value="budget">Budget</option>
          </select>
        </div>
      </div>
      <div className="mt-3">
        <label className="mb-1 block text-xs font-semibold uppercase tracking-widest text-slate-400">What would you change?</label>
        <textarea value={note} onChange={(e) => setNote(e.target.value)} rows={3} placeholder="e.g. Add a sunset cruise on Day 3, swap the hotel to..." className="field w-full rounded-lg px-3 py-2 text-sm outline-none" required />
      </div>
      <div className="mt-3 flex items-center gap-3">
        <button type="submit" disabled={saving} className="btn-primary rounded-lg px-5 py-2 text-sm font-semibold transition disabled:opacity-50">
          {saving ? "Saving..." : "Submit change"}
        </button>
        {success && (
          <motion.span initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="text-sm font-medium text-emerald-600">
            Change recorded!
          </motion.span>
        )}
      </div>
    </form>
  );
}

/* ── Main shared page ── */
function SharedTripPage() {
  const { token } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    api.get(`/api/trips/shared/${token}`)
      .then((res) => setTrip(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "This trip link is invalid or has been disabled."))
      .finally(() => setLoading(false));
  }, [token]);

  if (loading) return <p className="py-16 text-center text-slate-500">Loading shared trip...</p>;
  if (error) return (
    <div className="mx-auto max-w-md rounded-2xl border border-rose-200 bg-rose-50 p-8 text-center">
      <p className="text-lg font-bold text-rose-700">Link not found</p>
      <p className="mt-2 text-sm text-rose-500">{error}</p>
    </div>
  );
  if (!trip) return null;

  const n = normalizeTripData(trip);
  const dayPlans = n.days;
  const summary = n.summary;
  const hotels = dayPlans.flatMap((d) => (d.restaurants || []).map((r) => ({ ...r, day: d.day })));
  const stats = [
    { label: "Duration", value: `${summary.totalDays || trip.days} days` },
    { label: "Style", value: trip.style },
    { label: "Budget", value: summary.estimatedBudget || trip.budget },
    { label: "Month", value: trip.month },
  ];

  return (
    <div className="space-y-7">
      {/* Shared badge */}
      <div className="flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-4 py-2 text-sm text-amber-700">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
          <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
        </svg>
        You're viewing a shared trip. You can suggest changes below.
      </div>

      {/* Hero */}
      <section className="overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 p-8 text-white shadow-xl shadow-indigo-200/50">
        <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">Shared Trip Plan</p>
        <h1 className="mt-2 text-3xl font-black md:text-4xl">{summary.destination || trip.destination}</h1>
        <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
          {summary.description || "An AI-crafted travel blueprint."}
        </p>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/30 bg-white/15 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-white/70">{s.label}</p>
              <p className="mt-1 text-lg font-semibold capitalize text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Suggest changes panel */}
      <SharedEditPanel token={token} trip={trip} onTripUpdated={setTrip} />

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
        {tabs.map((tab) => (
          <button key={tab} onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${activeTab === tab ? "border border-indigo-200 bg-white text-indigo-600 shadow-sm" : "text-slate-500 hover:bg-white hover:text-slate-700"}`}
          >
            {tab === "edits" ? "Changes Recommended In My Itinerary" : tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <section className="grid gap-4 md:grid-cols-2">
          <article className={sectionCardClass}>
            <h3 className="text-xl font-semibold text-slate-800">Trip Summary</h3>
            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p><span className="font-semibold">Destination:</span> {summary.destination}</p>
              <p><span className="font-semibold">Total Days:</span> {summary.totalDays || trip.days}</p>
              <p><span className="font-semibold">Budget:</span> {summary.estimatedBudget || trip.budget}</p>
            </div>
          </article>
          <article className={sectionCardClass}>
            <h3 className="text-xl font-semibold text-slate-800">Highlights</h3>
            <p className="mt-4 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              {summary.description || "Trip overview unavailable."}
            </p>
          </article>
        </section>
      )}

      {/* ── TIMELINE ── */}
      {activeTab === "timeline" && (
        <section className={sectionCardClass}>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Day Timeline</h2>
          <div className="space-y-4">
            {dayPlans.length ? dayPlans.map((day) => (
              <article key={day.day} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <h3 className="font-semibold text-slate-800">Day {day.day}: {day.theme}</h3>
                {day.date && <p className="mt-0.5 text-xs text-slate-400">{day.date}</p>}
                <div className="mt-3 space-y-2">
                  {day.activities?.map((act, ai) => (
                    <div key={`${day.day}-${ai}`} className="rounded-xl bg-white p-4 text-sm shadow-sm">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                          <p className="font-semibold text-slate-700">{act.locationName}</p>
                          <p className="mt-0.5 text-slate-500">{act.description}</p>
                        </div>
                        {act.time && <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">{act.time}</span>}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                        {act.estimatedDuration && <span>Duration: {act.estimatedDuration}</span>}
                        {act.estimatedCost && <span>Cost: {act.estimatedCost}</span>}
                      </div>
                      <ImageHoverCard images={act.images || []} alt={act.locationName} />
                    </div>
                  ))}
                </div>
                {day.dailyTips && <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700"><span className="font-semibold">Tip:</span> {day.dailyTips}</p>}
              </article>
            )) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">No timeline available.</p>}
          </div>
        </section>
      )}

      {/* ── HOTELS ── */}
      {activeTab === "hotels" && (
        <section className={sectionCardClass}>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Hotel & Restaurant Picks</h2>
          {hotels.length ? (
            <div className="grid gap-4 md:grid-cols-2">
              {hotels.map((h, i) => (
                <article key={`${h.name}-${i}`} className="group rounded-2xl border border-slate-200 bg-slate-50 p-5 transition hover:border-indigo-200 hover:shadow-md">
                  <p className="text-base font-bold text-slate-800">{h.name}</p>
                  <p className="mt-0.5 text-sm text-slate-500">Day {h.day}</p>
                  {h.speciality && <p className="mt-2 text-sm text-slate-600"><span className="font-medium">Speciality:</span> {h.speciality}</p>}
                  {h.priceRange && <p className="text-xs text-emerald-600">{h.priceRange}</p>}
                  <ImageHoverCard images={h.images || []} alt={h.name} />
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a href={`https://www.google.com/maps/search/${encodeURIComponent(h.name + " " + (trip.destination || ""))}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600">Maps</a>
                    <a href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name + " " + (trip.destination || ""))}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-600">Booking</a>
                    <a href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(h.name + " " + (trip.destination || ""))}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600">TripAdvisor</a>
                  </div>
                </article>
              ))}
            </div>
          ) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">No recommendations available.</p>}
        </section>
      )}

      {/* ── TIPS ── */}
      {activeTab === "tips" && (
        <section className={sectionCardClass}>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Travel Tips</h2>
          <div className="grid gap-3">
            {n.travelTips.length ? n.travelTips.map((tip, i) => (
              <article key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">{i + 1}</div>
                {tip}
              </article>
            )) : <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">No tips available.</p>}
          </div>
        </section>
      )}

      {/* ── EDIT HISTORY ── */}
      {activeTab === "edits" && (
        <section className={sectionCardClass}>
          <h2 className="text-xl font-semibold text-slate-800">Changes Recommended In My Itinerary</h2>
          <p className="mt-1 text-sm text-slate-500">All changes made by the owner and collaborators.</p>
          <div className="mt-6">
            {trip.editHistory && trip.editHistory.length > 0 ? (
              <div className="relative ml-4 border-l-2 border-slate-200 pl-6">
                {[...trip.editHistory].reverse().map((entry, i) => (
                  <div key={entry._id || i} className="relative mb-6 last:mb-0">
                    <div className="absolute -left-[31px] flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-gradient-to-br from-indigo-500 to-sky-500 shadow-sm">
                      <div className="h-1.5 w-1.5 rounded-full bg-white" />
                    </div>
                    <div className="rounded-xl border border-slate-200 bg-slate-50 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-700">
                            {entry.editorName?.[0]?.toUpperCase() || "?"}
                          </span>
                          <span className="text-sm font-semibold text-slate-800">{entry.editorName}</span>
                          <span className="chip rounded-full px-2 py-0.5 text-xs">{entry.section}</span>
                        </div>
                        <span className="text-xs text-slate-400">{entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}</span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{entry.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-400">No edits yet.</p>
              </div>
            )}
          </div>
        </section>
      )}
    </div>
  );
}

export default SharedTripPage;

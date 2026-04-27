import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import api from "../lib/api";

const tabs = ["overview", "timeline", "hotels", "tips", "edits"];
const sectionCardClass = "rounded-3xl border border-slate-200 bg-white p-6 shadow-sm";

function normalizeTripData(trip) {
  const itinerary = trip?.itinerary || {};
  if (itinerary.tripSummary && Array.isArray(itinerary.days)) {
    return {
      summary: itinerary.tripSummary,
      days: itinerary.days,
      travelTips: itinerary.travelTips || [],
    };
  }
  const legacyDays = Array.isArray(itinerary.itinerary) ? itinerary.itinerary : [];
  return {
    summary: {
      destination: itinerary.destination || trip.destination,
      totalDays: String(trip.days || legacyDays.length || 1),
      description: itinerary.overview || "",
      estimatedBudget: itinerary.estimated_budget?.total_estimate || trip.budget || "",
    },
    days: legacyDays.map((d, i) => ({
      day: d.day || i + 1,
      date: "",
      theme: d.title || `Day ${i + 1}`,
      activities: (d.activities || []).map((a) => ({
        time: a.time || "Flexible",
        locationName: a.place || "Planned activity",
        description: a.description || "",
        category: "sightseeing",
        estimatedDuration: "",
        estimatedCost: a.cost_estimate || "",
        travelTimeFromPrevious: "",
        coordinates: { lat: "", lng: "" },
        images: [],
      })),
      restaurants: (d.food_recommendations || []).map((r) => ({
        name: r.restaurant || "Restaurant",
        speciality: r.dish || "",
        priceRange: "",
        images: [],
      })),
      dailyTips: "",
    })),
    travelTips: itinerary.travel_tips || [],
  };
}

/* ── Hover image card ── */
function ImageHoverCard({ images = [], alt }) {
  const [hovered, setHovered] = useState(null);
  if (!images.length) return null;
  return (
    <div className="mt-2 flex gap-2 overflow-x-auto">
      {images.map((url, i) => (
        <div
          key={url}
          className="group relative shrink-0"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <img
            src={url}
            alt={`${alt} ${i + 1}`}
            className="h-16 w-20 cursor-pointer rounded-lg object-cover border border-slate-200 transition group-hover:border-indigo-300 group-hover:shadow-md"
            loading="lazy"
          />
          <AnimatePresence>
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 8 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 8 }}
                className="absolute bottom-full left-1/2 z-30 mb-2 -translate-x-1/2"
              >
                <img
                  src={url}
                  alt={`${alt} preview`}
                  className="h-48 w-64 rounded-xl border border-slate-200 object-cover shadow-2xl"
                />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

/* ── Inline edit field ── */
function InlineEdit({ value, onSave, multiline = false }) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  const commit = () => {
    setEditing(false);
    if (draft !== value) onSave(draft);
  };

  if (!editing) {
    return (
      <span
        onClick={() => { setDraft(value); setEditing(true); }}
        className="cursor-pointer rounded-md px-1 py-0.5 transition hover:bg-indigo-50 hover:text-indigo-700"
        title="Click to edit"
      >
        {value || <span className="italic text-slate-400">Click to edit</span>}
      </span>
    );
  }

  if (multiline) {
    return (
      <textarea
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => e.key === "Escape" && setEditing(false)}
        autoFocus
        rows={3}
        className="field w-full rounded-lg px-3 py-2 text-sm outline-none"
      />
    );
  }

  return (
    <input
      type="text"
      value={draft}
      onChange={(e) => setDraft(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => { if (e.key === "Enter") commit(); if (e.key === "Escape") setEditing(false); }}
      autoFocus
      className="field rounded-lg px-3 py-1.5 text-sm outline-none"
    />
  );
}

/* ── Share modal ── */
function ShareModal({ trip, onClose, onShareEnabled }) {
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const shareUrl = trip.shareToken
    ? `${window.location.origin}/shared/${trip.shareToken}`
    : null;

  const enableShare = async () => {
    setLoading(true);
    try {
      const res = await api.post(`/api/trips/${trip._id}/share`);
      onShareEnabled(res.data.data.shareToken);
    } catch {
      // handled upstream
    } finally {
      setLoading(false);
    }
  };

  const copyLink = () => {
    if (shareUrl) {
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center bg-black/30 backdrop-blur-sm"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="mx-4 w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-slate-800">Share this trip</h3>
          <button onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M18 6L6 18M6 6l12 12" /></svg>
          </button>
        </div>

        <p className="mt-2 text-sm text-slate-500">
          Anyone with the link can view and suggest edits to this trip. All changes are tracked in the edit history.
        </p>

        {shareUrl ? (
          <div className="mt-4">
            <label className="mb-1.5 block text-xs font-semibold uppercase tracking-widest text-slate-400">
              Share link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="field flex-1 rounded-lg px-3 py-2 text-sm"
              />
              <button
                onClick={copyLink}
                className="btn-primary shrink-0 rounded-lg px-4 py-2 text-sm font-semibold"
              >
                {copied ? "Copied!" : "Copy"}
              </button>
            </div>
            <div className="mt-3 flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M5 13l4 4L19 7" /></svg>
              Sharing is active
            </div>
          </div>
        ) : (
          <div className="mt-4">
            <button
              onClick={enableShare}
              disabled={loading}
              className="btn-primary w-full rounded-xl py-3 text-sm font-semibold transition disabled:opacity-50"
            >
              {loading ? "Generating link..." : "Enable public sharing"}
            </button>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

/* ── Main page ── */
function TripDetailsPage() {
  const { id } = useParams();
  const [trip, setTrip] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview");
  const [showShareModal, setShowShareModal] = useState(false);

  useEffect(() => {
    api.get(`/api/trips/${id}`)
      .then((res) => setTrip(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load trip"))
      .finally(() => setLoading(false));
  }, [id]);

  const saveEdit = async (field, value, section = "general", description = "") => {
    try {
      const payload = { editEntry: { editorName: "Owner", section, description: description || `Edited ${field}` } };
      if (field === "destination") payload.destination = value;
      else if (field === "month") payload.month = value;
      else payload.itinerary = { [field]: value };

      const res = await api.patch(`/api/trips/${id}`, payload);
      setTrip(res.data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save edit");
    }
  };

  if (loading) return <p className="text-slate-500">Loading itinerary...</p>;
  if (error && !trip) return <p className="text-rose-600">{error}</p>;
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
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-sky-500 to-cyan-400 p-8 text-white shadow-xl shadow-indigo-200/50">
        <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/10 blur-2xl" />
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-white/80">Trip Genie Plan</p>
            <h1 className="mt-2 text-3xl font-black md:text-4xl">{summary.destination || trip.destination}</h1>
            <p className="mt-4 max-w-3xl text-sm leading-relaxed text-white/85 md:text-base">
              {summary.description || "Your AI-crafted travel blueprint."}
            </p>
          </div>
          <button
            onClick={() => setShowShareModal(true)}
            className="flex items-center gap-2 rounded-xl border border-white/30 bg-white/15 px-5 py-2.5 text-sm font-semibold backdrop-blur-sm transition hover:bg-white/25"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="18" cy="5" r="3" /><circle cx="6" cy="12" r="3" /><circle cx="18" cy="19" r="3" />
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" />
            </svg>
            Share
          </button>
        </div>
        <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-2xl border border-white/30 bg-white/15 p-4 backdrop-blur-sm">
              <p className="text-xs uppercase tracking-wide text-white/70">{s.label}</p>
              <p className="mt-1 text-lg font-semibold capitalize text-white">{s.value}</p>
            </div>
          ))}
        </div>
      </section>

      {error && <p className="text-sm text-rose-600">{error}</p>}

      {/* Tabs */}
      <div className="flex flex-wrap gap-2 rounded-2xl border border-slate-200 bg-slate-50 p-2 shadow-sm">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`rounded-xl px-4 py-2 text-sm font-medium capitalize transition ${
              activeTab === tab
                ? "border border-indigo-200 bg-white text-indigo-600 shadow-sm"
                : "text-slate-500 hover:bg-white hover:text-slate-700"
            }`}
          >
            {tab === "edits" ? "Edit History" : tab}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW ── */}
      {activeTab === "overview" && (
        <section className="grid gap-4 md:grid-cols-2">
          <article className={sectionCardClass}>
            <h3 className="text-xl font-semibold text-slate-800">Trip Summary</h3>
            <div className="mt-4 space-y-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
              <p><span className="font-semibold">Destination:</span> <InlineEdit value={summary.destination || ""} onSave={(v) => saveEdit("destination", v, "overview", "Changed destination")} /></p>
              <p><span className="font-semibold">Total Days:</span> {summary.totalDays || trip.days}</p>
              <p><span className="font-semibold">Budget:</span> {summary.estimatedBudget || trip.budget}</p>
            </div>
          </article>
          <article className={sectionCardClass}>
            <h3 className="text-xl font-semibold text-slate-800">Highlights</h3>
            <div className="mt-4 space-y-2">
              <div className="rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
                <InlineEdit value={summary.description || "Detailed trip overview unavailable."} onSave={(v) => saveEdit("tripSummary", { ...n.summary, description: v }, "overview", "Updated description")} multiline />
              </div>
            </div>
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
                        {act.time && (
                          <span className="shrink-0 rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-600">
                            {act.time}
                          </span>
                        )}
                      </div>
                      <div className="mt-2 flex flex-wrap gap-3 text-xs text-slate-400">
                        {act.estimatedDuration && <span>Duration: {act.estimatedDuration}</span>}
                        {act.estimatedCost && <span>Cost: {act.estimatedCost}</span>}
                        {act.travelTimeFromPrevious && <span>Travel: {act.travelTimeFromPrevious}</span>}
                      </div>
                      <ImageHoverCard images={act.images || []} alt={act.locationName} />
                    </div>
                  ))}
                </div>
                {day.dailyTips && (
                  <p className="mt-3 rounded-lg bg-emerald-50 px-3 py-2 text-xs text-emerald-700">
                    <span className="font-semibold">Tip:</span> {day.dailyTips}
                  </p>
                )}
              </article>
            )) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">No timeline generated yet.</p>
            )}
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
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-base font-bold text-slate-800 group-hover:text-indigo-700">{h.name}</p>
                      <p className="mt-0.5 text-sm text-slate-500">Day {h.day}</p>
                    </div>
                    {h.priceRange && (
                      <span className="shrink-0 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-600">
                        {h.priceRange}
                      </span>
                    )}
                  </div>
                  {h.speciality && (
                    <p className="mt-2 text-sm text-slate-600">
                      <span className="font-medium">Speciality:</span> {h.speciality}
                    </p>
                  )}
                  <ImageHoverCard images={h.images || []} alt={h.name} />
                  {/* Search links */}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/search/${encodeURIComponent(h.name + " " + (trip.destination || ""))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-indigo-200 hover:text-indigo-600"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
                      Maps
                    </a>
                    <a
                      href={`https://www.booking.com/searchresults.html?ss=${encodeURIComponent(h.name + " " + (trip.destination || ""))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-sky-200 hover:text-sky-600"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71" /><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71" /></svg>
                      Booking
                    </a>
                    <a
                      href={`https://www.tripadvisor.com/Search?q=${encodeURIComponent(h.name + " " + (trip.destination || ""))}`}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600"
                    >
                      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                      TripAdvisor
                    </a>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">No hotel or restaurant recommendations available yet.</p>
          )}
        </section>
      )}

      {/* ── TIPS ── */}
      {activeTab === "tips" && (
        <section className={sectionCardClass}>
          <h2 className="mb-4 text-xl font-semibold text-slate-800">Travel Tips</h2>
          <div className="grid gap-3">
            {n.travelTips.length ? n.travelTips.map((tip, i) => (
              <article key={i} className="flex items-start gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
                <div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-100 text-xs font-bold text-indigo-600">
                  {i + 1}
                </div>
                {tip}
              </article>
            )) : (
              <p className="rounded-xl bg-slate-50 p-4 text-sm text-slate-400">No travel tips available yet.</p>
            )}
          </div>
        </section>
      )}

      {/* ── EDIT HISTORY ── */}
      {activeTab === "edits" && (
        <section className={sectionCardClass}>
          <h2 className="text-xl font-semibold text-slate-800">Edit History</h2>
          <p className="mt-1 text-sm text-slate-500">All changes made to this trip, including from shared collaborators.</p>
          <div className="mt-6">
            {trip.editHistory && trip.editHistory.length > 0 ? (
              <div className="relative ml-4 border-l-2 border-slate-200 pl-6">
                {[...trip.editHistory].reverse().map((entry, i) => (
                  <div key={entry._id || i} className="relative mb-6 last:mb-0">
                    {/* Timeline dot */}
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
                        <span className="text-xs text-slate-400">
                          {entry.timestamp ? new Date(entry.timestamp).toLocaleString() : ""}
                        </span>
                      </div>
                      <p className="mt-2 text-sm text-slate-600">{entry.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-center">
                <p className="text-sm text-slate-400">No edits yet. Changes will appear here when you or collaborators edit this trip.</p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Share modal */}
      <AnimatePresence>
        {showShareModal && (
          <ShareModal
            trip={trip}
            onClose={() => setShowShareModal(false)}
            onShareEnabled={(token) => setTrip({ ...trip, shareToken: token, isPublic: true })}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export default TripDetailsPage;

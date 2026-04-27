import { useEffect, useState } from "react";
import api from "../lib/api";
import TripCard from "../components/TripCard";

function SavedTripsPage() {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    api
      .get("/api/trips/user/me")
      .then((res) => setTrips(res.data.data))
      .catch((err) => setError(err.response?.data?.message || "Failed to load trips"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <p className="text-slate-500">Loading your saved trips...</p>;
  }

  return (
    <div className="space-y-6">
      <header className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h1 className="text-3xl font-bold text-slate-800">Saved Trips</h1>
        <p className="mt-2 text-slate-500">All your previously generated itineraries in one place.</p>
      </header>
      {error ? <p className="text-sm text-rose-600">{error}</p> : null}
      {trips.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-slate-500">
          No trips yet. Generate your first one.
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {trips.map((trip) => (
            <TripCard key={trip._id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

export default SavedTripsPage;

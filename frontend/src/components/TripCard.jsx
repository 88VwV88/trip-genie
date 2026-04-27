import { Link } from "react-router-dom";

function TripCard({ trip }) {
  return (
    <Link
      to={`/trips/${trip._id}`}
      className="group block rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-1 hover:border-indigo-200 hover:shadow-lg hover:shadow-indigo-100/50"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 group-hover:text-indigo-600">
            {trip.destination}
          </h3>
          <p className="mt-1 text-sm text-slate-500">
            {trip.days} days &middot; {trip.style} &middot; {trip.budget}
          </p>
        </div>
        <span className="chip rounded-full px-3 py-1 text-xs font-semibold">
          {trip.month}
        </span>
      </div>
      <p className="mt-3 line-clamp-2 text-sm text-slate-500">{trip.itinerary?.overview}</p>
      <p className="mt-2 text-xs font-medium capitalize text-indigo-500">Trip kind: {trip.style}</p>
    </Link>
  );
}

export default TripCard;

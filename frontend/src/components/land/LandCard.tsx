import { Link } from "react-router-dom";
import type { Land } from "../../types/land";

type LandCardProps = {
  land: Land;
  onEdit: (land: Land) => void;
  onDelete: (id: number) => void;
  loading: boolean;
};

function LandCard({ land, onEdit, onDelete, loading }: LandCardProps) {
  const statusLabel = {
    AVAILABLE: "For Sale",
    RESERVED: "Negotiation",
    SOLD: "Sold",
  }[land.status];

  const statusClass = {
    AVAILABLE: "bg-blue-50 text-blue-700",
    RESERVED: "bg-amber-50 text-amber-700",
    SOLD: "bg-slate-100 text-slate-600",
  }[land.status];

  return (
    <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="relative h-40 overflow-hidden bg-slate-100">
        <div className="absolute inset-0 bg-[linear-gradient(135deg,#e2e8f0_25%,transparent_25%),linear-gradient(225deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(315deg,#e2e8f0_25%,#f8fafc_25%)] bg-[length:60px_60px] opacity-70" />

        <div className="absolute left-[25%] top-[25%] h-24 w-32 rotate-[-8deg] rounded-lg border-2 border-blue-500 bg-blue-500/20" />

        <div className="absolute right-4 top-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
          {land.status === "SOLD" ? "Sold" : "Active"}
        </div>

        <div className="absolute bottom-4 left-4 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
          Land #{land.id}
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="font-semibold text-slate-900">{land.name}</h2>

            <p className="mt-1 text-xs text-slate-400">Property #{land.id}</p>
          </div>

          <span
            className={`rounded-lg px-2.5 py-1 text-xs font-semibold ${statusClass}`}
          >
            {statusLabel}
          </span>
        </div>

        <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
          {land.description}
        </p>

        <div className="mt-5 border-t border-slate-100 pt-4">
          <p className="text-xs font-medium text-slate-400">Price</p>

          <p className="mt-1 text-xl font-bold text-slate-900">
            {new Intl.NumberFormat("pt-BR", {
              style: "currency",
              currency: "BRL",
            }).format(land.price)}
          </p>
        </div>

        <div className="mt-5 flex gap-3">
          <Link
            to={`/app/explore?land=${land.id}`}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            View
          </Link>

          <button
            type="button"
            onClick={() => onEdit(land)}
            className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
          >
            Manage
          </button>

          <button
            type="button"
            disabled={loading}
            onClick={() => onDelete(land.id)}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}

export default LandCard;

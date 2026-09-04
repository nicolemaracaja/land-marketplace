import type { Negotiation, NegotiationStatus } from "../../types/negotiation";

type NegotiationCardProps = {
  negotiation: Negotiation;
  loading: boolean;
  onAccept: (id: number) => void;
  onReject: (id: number) => void;
  onCancel: (id: number) => void;
  onViewDetails: (id: number) => void;
};

function getStatusLabel(status: NegotiationStatus) {
  switch (status) {
    case "PENDING":
      return "Pending";

    case "ACCEPTED":
      return "Accepted";

    case "REJECTED":
      return "Rejected";

    case "CANCELLED":
      return "Cancelled";

    default:
      return status;
  }
}

function getStatusClasses(status: NegotiationStatus) {
  switch (status) {
    case "PENDING":
      return "bg-amber-50 text-amber-700";

    case "ACCEPTED":
      return "bg-emerald-50 text-emerald-700";

    case "REJECTED":
      return "bg-red-50 text-red-700";

    case "CANCELLED":
      return "bg-slate-100 text-slate-600";

    default:
      return "bg-slate-100 text-slate-600";
  }
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function NegotiationCard({
  negotiation,
  loading,
  onAccept,
  onReject,
  onCancel,
  onViewDetails,
}: NegotiationCardProps) {
  const isPending = negotiation.status === "PENDING";
  const isReceived = negotiation.type === "received";
  const isSent = negotiation.type === "sent";

  return (
    <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-4">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
            ▦
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="font-semibold text-slate-900">
                {negotiation.landName}
              </h2>

              <span
                className={`rounded-full px-3 py-1 text-xs font-semibold ${getStatusClasses(
                  negotiation.status,
                )}`}
              >
                {getStatusLabel(negotiation.status)}
              </span>
            </div>

            <p className="mt-1 text-sm text-slate-500">
              Negotiation #{negotiation.id}
            </p>

            <p className="mt-3 text-sm text-slate-600">
              {isReceived
                ? `Offer received from ${negotiation.person}`
                : `Offer sent to ${negotiation.person}`}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 lg:text-right">
          <div>
            <p className="text-xs font-medium text-slate-400">Land price</p>

            <p className="mt-1 font-semibold text-slate-900">
              {formatCurrency(negotiation.landPrice)}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium text-slate-400">Offer</p>

            <p className="mt-1 font-semibold text-blue-600">
              {formatCurrency(negotiation.offer)}
            </p>
          </div>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3 border-t border-slate-100 pt-5">
        {isReceived && isPending && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={() => onAccept(negotiation.id)}
              className="rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-emerald-700 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading ? "Processing..." : "Accept"}
            </button>

            <button
              type="button"
              disabled={loading}
              onClick={() => onReject(negotiation.id)}
              className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Reject
            </button>
          </>
        )}

        {isSent && isPending && (
          <button
            type="button"
            disabled={loading}
            onClick={() => onCancel(negotiation.id)}
            className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Processing..." : "Cancel Offer"}
          </button>
        )}

        <button
          type="button"
          disabled={loading}
          onClick={() => onViewDetails(negotiation.id)}
          className="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          View Details
        </button>
      </div>
    </article>
  );
}

export default NegotiationCard;

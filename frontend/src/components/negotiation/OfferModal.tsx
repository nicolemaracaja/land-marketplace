import type { Land } from "../../types/land";

type OfferModalProps = {
  land: Land | null;
  offer: string;
  loading: boolean;
  error: string | null;
  onOfferChange: (value: string) => void;
  onSubmit: () => void;
  onClose: () => void;
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value);
}

function OfferModal({
  land,
  offer,
  loading,
  error,
  onOfferChange,
  onSubmit,
  onClose,
}: OfferModalProps) {
  if (!land) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-sm font-semibold text-blue-600">Make an offer</p>

            <h2 className="mt-1 text-2xl font-bold text-slate-900">
              {land.name}
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700 disabled:opacity-50"
          >
            ✕
          </button>
        </div>

        <div className="mt-6 rounded-xl bg-slate-50 p-4">
          <p className="text-xs font-medium uppercase tracking-wide text-slate-400">
            Current price
          </p>

          <p className="mt-1 text-2xl font-bold text-slate-900">
            {formatCurrency(land.price)}
          </p>

          <p className="mt-3 text-sm leading-6 text-slate-600">
            {land.description}
          </p>
        </div>

        <div className="mt-6">
          <label
            htmlFor="offer"
            className="text-sm font-semibold text-slate-700"
          >
            Your offer
          </label>

          <div className="mt-2 flex items-center rounded-xl border border-slate-200 bg-white px-4 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
            <span className="text-sm font-medium text-slate-500">R$</span>

            <input
              id="offer"
              type="number"
              min="0.01"
              step="0.01"
              value={offer}
              onChange={(event) => onOfferChange(event.target.value)}
              className="w-full border-0 bg-transparent px-3 py-3 text-sm text-slate-900 outline-none"
              placeholder="Enter your offer"
              disabled={loading}
            />
          </div>
        </div>

        {error && (
          <p className="mt-3 text-sm font-medium text-red-600">{error}</p>
        )}

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="rounded-xl border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onSubmit}
            disabled={loading}
            className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Sending..." : "Send Offer"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default OfferModal;

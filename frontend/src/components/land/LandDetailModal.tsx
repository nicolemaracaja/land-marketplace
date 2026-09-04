import { Land } from "../../types/land";

type LandDetailModalProps = {
  land: Land;
  onClose: () => void;
  onInterest?: () => void;
};

function LandDetailsModal({ land, onClose, onInterest }: LandDetailModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-6 backdrop-blur-sm">
      <div className="w-full max-w-lg rounded-2xl bg-white p-8 shadow-2xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
              Property
            </p>

            <h2 className="mt-1 text-xl font-semibold text-slate-900">
              Land Details
            </h2>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="text-2xl leading-none text-slate-400 transition-colors hover:text-slate-600"
            aria-label="Close modal"
          >
            ×
          </button>
        </div>

        <div className="space-y-5">
          <div>
            <p className="text-sm font-medium text-slate-500">Name</p>

            <p className="mt-1 text-slate-900">{land.name}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Description</p>

            <p className="mt-1 leading-6 text-slate-700">{land.description}</p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Price</p>

            <p className="mt-1 text-lg font-semibold text-blue-600">
              {land.price.toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-slate-500">Contact</p>

            <p className="mt-1 text-slate-700">{land.contact}</p>
          </div>
        </div>

        <div className="mt-7 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
          >
            Close
          </button>

          {onInterest && (
            <button
              type="button"
              onClick={onInterest}
              className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
            >
              I'm Interested
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default LandDetailsModal;

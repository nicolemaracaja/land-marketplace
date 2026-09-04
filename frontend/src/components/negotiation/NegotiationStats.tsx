import type { Negotiation } from "../../types/negotiation";

type NegotiationStatsProps = {
  negotiations: Negotiation[];
};

function NegotiationStats({ negotiations }: NegotiationStatsProps) {
  const received = negotiations.filter(
    (negotiation) => negotiation.type === "received",
  );

  const sent = negotiations.filter(
    (negotiation) => negotiation.type === "sent",
  );

  return (
    <section className="grid gap-5 sm:grid-cols-3">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Total</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {negotiations.length}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-lg text-blue-600">
            ↔
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Received</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {received.length}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-lg text-emerald-600">
            ↓
          </div>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">Sent</p>

            <p className="mt-2 text-3xl font-bold text-slate-900">
              {sent.length}
            </p>
          </div>

          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-lg text-purple-600">
            ↑
          </div>
        </div>
      </div>
    </section>
  );
}

export default NegotiationStats;

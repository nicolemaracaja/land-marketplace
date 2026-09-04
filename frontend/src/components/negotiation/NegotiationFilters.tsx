export type NegotiationFilter =
  | "ALL"
  | "RECEIVED"
  | "SENT"
  | "PENDING"
  | "COMPLETED";

type NegotiationFiltersProps = {
  activeFilter: NegotiationFilter;
  onFilterChange: (filter: NegotiationFilter) => void;
};

const filters: {
  label: string;
  value: NegotiationFilter;
}[] = [
  { label: "All", value: "ALL" },
  { label: "Received", value: "RECEIVED" },
  { label: "Sent", value: "SENT" },
  { label: "Pending", value: "PENDING" },
  { label: "Completed", value: "COMPLETED" },
];

function NegotiationFilters({
  activeFilter,
  onFilterChange,
}: NegotiationFiltersProps) {
  return (
    <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => (
          <button
            key={filter.value}
            type="button"
            onClick={() => onFilterChange(filter.value)}
            className={
              activeFilter === filter.value
                ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                : "rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100"
            }
          >
            {filter.label}
          </button>
        ))}
      </div>
    </section>
  );
}

export default NegotiationFilters;

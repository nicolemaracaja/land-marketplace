export type LandFilter = "ALL" | "AVAILABLE" | "RESERVED" | "SOLD";

type LandFiltersProps = {
  activeFilter: LandFilter;
  onFilterChange: (filter: LandFilter) => void;
};

function LandFilters({ activeFilter, onFilterChange }: LandFiltersProps) {
  const filters: { label: string; value: LandFilter }[] = [
    { label: "All", value: "ALL" },
    { label: "For Sale", value: "AVAILABLE" },
    { label: "Negotiation", value: "RESERVED" },
    { label: "Sold", value: "SOLD" },
  ];

  return (
    <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex flex-wrap gap-2">
        {filters.map((filter) => {
          const isActive = activeFilter === filter.value;

          return (
            <button
              key={filter.value}
              type="button"
              onClick={() => onFilterChange(filter.value)}
              className={
                isActive
                  ? "rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
                  : "rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              }
            >
              {filter.label}
            </button>
          );
        })}
      </div>
    </section>
  );
}

export default LandFilters;

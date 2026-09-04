import { useCallback } from "react";
import { observer } from "mobx-react-lite";

import Map from "../components/commons/Map";
import landStore from "../stores/landStore";

function ExplorePage() {
  const handleSearchCircle = useCallback(
    async (latitude: number, longitude: number, radiusMeters: number) => {
      try {
        await landStore.searchLands(latitude, longitude, radiusMeters);
      } catch (error) {
        console.error("Failed to search lands:", error);
      }
    },
    [],
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="border-b border-slate-200 bg-white">
        <div className="px-6 py-8 lg:px-10">
          <div className="mx-auto max-w-7xl">
            <div className="max-w-3xl">
              <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                Explore
              </p>

              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Find land in your area
              </h1>

              <p className="mt-3 text-base leading-7 text-slate-500">
                Draw a circle on the map to search for available properties
                within a specific area.
              </p>
            </div>

            <div className="mt-6 rounded-2xl border border-blue-100 bg-blue-50 p-5">
              <div className="flex gap-4">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-sm font-bold text-white">
                  i
                </div>

                <div>
                  <h2 className="font-semibold text-blue-900">How to search</h2>

                  <p className="mt-1 text-sm leading-6 text-blue-700">
                    Draw a circle on the map to define your search area. Lands
                    that intersect the circle will be displayed automatically.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <main className="px-6 py-8 lg:px-10">
        <div className="mx-auto max-w-7xl">
          <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-5 py-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold text-slate-900">Map</h2>

                  <p className="mt-1 text-sm text-slate-500">
                    Draw a circle to search for lands.
                  </p>
                </div>

                {landStore.loading && (
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-slate-200 border-t-blue-600" />
                    Searching...
                  </div>
                )}
              </div>
            </div>

            <div className="h-[600px]">
              <Map mode="SEARCH" onSearchCircleChange={handleSearchCircle} />
            </div>
          </div>

          {landStore.error && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {landStore.error}
            </div>
          )}

          {!landStore.loading &&
            !landStore.error &&
            landStore.lands.length > 0 && (
              <div className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                {landStore.lands.length === 1
                  ? "1 land found in this area."
                  : `${landStore.lands.length} lands found in this area.`}
              </div>
            )}

          {!landStore.loading &&
            !landStore.error &&
            landStore.lands.length === 0 && (
              <div className="mt-4 rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-500">
                Draw a circle on the map to search for available lands.
              </div>
            )}

          <div className="mt-8 grid gap-5 md:grid-cols-3">
            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">Search by area</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Define exactly where you want to search using an interactive
                circle.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">Spatial search</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                PostGIS finds lands that intersect the selected search area.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6">
              <h3 className="font-semibold text-slate-900">Make an offer</h3>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Open a property popup and send an offer directly to the owner.
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

export default observer(ExplorePage);

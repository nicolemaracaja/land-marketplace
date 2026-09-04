import { useState } from "react";
import { Link } from "react-router-dom";

import Map from "../components/commons/Map";
import LandForm from "../components/land/LandForm";

import type { PolygonGeometry } from "../types/geometry";

function RegisterLandPage() {
  const [geometry, setGeometry] = useState<PolygonGeometry | null>(null);

  function handleGeometryChange(newGeometry: PolygonGeometry) {
    setGeometry(newGeometry);
  }

  function handleCloseForm() {
    setGeometry(null);
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/app" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              L
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              Land Marketplace
            </span>
          </Link>

          <Link
            to="/app/my-lands"
            className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
          >
            ← Back to My Lands
          </Link>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <div className="mb-6">
          <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Register property
          </p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Register New Land
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Draw the boundaries of your land on the map. After selecting the
            area, fill in the property information.
          </p>
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="border-b border-slate-200 px-5 py-4">
            <h2 className="font-semibold text-slate-900">
              Select the land area
            </h2>

            <p className="mt-1 text-sm text-slate-500">
              Use the polygon tool to draw the exact boundaries of the property.
            </p>
          </div>

          <div className="h-[650px]">
            <Map mode="REGISTER" onGeometryChange={handleGeometryChange} />
          </div>
        </div>

        {!geometry && (
          <div className="mt-4 rounded-xl border border-blue-100 bg-blue-50 px-5 py-4">
            <p className="text-sm font-medium text-blue-900">
              Draw a polygon on the map
            </p>

            <p className="mt-1 text-sm text-blue-700">
              Click around the property boundaries and finish the polygon to
              continue.
            </p>
          </div>
        )}
      </main>

      <LandForm geometry={geometry} onClose={handleCloseForm} />
    </div>
  );
}

export default RegisterLandPage;

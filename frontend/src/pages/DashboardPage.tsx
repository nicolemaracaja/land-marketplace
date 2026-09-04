import { useEffect } from "react";

import { Link } from "react-router-dom";

import { observer } from "mobx-react-lite";

import landStore from "../stores/landStore";
import negotiationStore from "../stores/negotiationStore";

function DashboardPage() {
  useEffect(() => {
    landStore.getMyLands().catch((error) => {
      console.error("Failed to load lands:", error);
    });

    negotiationStore.getAll().catch((error) => {
      console.error("Failed to load negotiations:", error);
    });
  }, []);

  const totalLands = landStore.lands.length;

  const availableLands = landStore.lands.filter(
    (land) => land.status === "AVAILABLE",
  ).length;

  const soldLands = landStore.lands.filter(
    (land) => land.status === "SOLD",
  ).length;

  const pendingNegotiations = negotiationStore.negotiations.filter(
    (negotiation) => negotiation.status === "PENDING",
  );

  const recentNegotiations =
    negotiationStore.negotiations.slice(0, 3);

  const loading =
    landStore.loading || negotiationStore.loading;

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              L
            </div>

            <span className="text-xl font-bold tracking-tight text-slate-900">
              Land Marketplace
            </span>
          </Link>

          <div className="flex items-center gap-4">
            <Link
              to="/app/profile"
              className="hidden text-sm font-medium text-slate-600 transition hover:text-blue-600 sm:block"
            >
              Profile
            </Link>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 font-semibold text-blue-700">
              U
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl px-6 py-8">
        <section className="mb-8">
          <p className="text-sm font-medium text-blue-600">
            Dashboard
          </p>

          <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
            Welcome back!
          </h1>

          <p className="mt-2 text-slate-500">
            Manage your lands, explore new opportunities and track
            your negotiations.
          </p>
        </section>

        {loading ? (
          <div className="mb-8 flex min-h-32 items-center justify-center rounded-2xl border border-slate-200 bg-white">
            <div className="text-center">
              <div className="mx-auto h-7 w-7 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

              <p className="mt-3 text-sm text-slate-500">
                Loading dashboard...
              </p>
            </div>
          </div>
        ) : (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    My Lands
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {totalLands}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-50 text-xl text-blue-600">
                  ▦
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Lands registered by you
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    For Sale
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {availableLands}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-xl text-emerald-600">
                  $
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Available properties
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Negotiations
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {pendingNegotiations.length}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-amber-50 text-xl text-amber-600">
                  ↔
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Active negotiations
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500">
                    Sold
                  </p>

                  <p className="mt-3 text-3xl font-bold text-slate-900">
                    {soldLands}
                  </p>
                </div>

                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-purple-50 text-xl text-purple-600">
                  ✓
                </div>
              </div>

              <p className="mt-4 text-xs text-slate-400">
                Completed sales
              </p>
            </div>
          </section>
        )}

        <section className="mt-8 grid gap-6 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:col-span-2">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">
                Quick actions
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Get where you need to go quickly.
              </p>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-3">
              <Link
                to="/app/explore"
                className="group rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  ⌖
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Explore Lands
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Search available properties using the interactive
                  map.
                </p>
              </Link>

              <Link
                to="/app/register-land"
                className="group rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-lg text-blue-600 transition group-hover:bg-blue-600 group-hover:text-white">
                  +
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Register Land
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  Register a new property on the interactive map.
                </p>
              </Link>

              <Link
                to="/app/my-lands"
                className="group rounded-xl border border-slate-200 p-5 transition hover:border-blue-200 hover:bg-blue-50/50"
              >
                <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-100 text-lg text-emerald-600 transition group-hover:bg-emerald-600 group-hover:text-white">
                  ▦
                </div>

                <h3 className="mt-4 font-semibold text-slate-900">
                  Manage My Lands
                </h3>

                <p className="mt-2 text-sm leading-6 text-slate-500">
                  View, edit and manage your registered properties.
                </p>
              </Link>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-900">
                  Recent activity
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Your latest negotiations
                </p>
              </div>

              <Link
                to="/app/negotiations"
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </Link>
            </div>

            {recentNegotiations.length === 0 ? (
              <div className="mt-8 flex min-h-48 flex-col items-center justify-center text-center">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-xl text-slate-400">
                  ◷
                </div>

                <p className="mt-4 text-sm font-medium text-slate-700">
                  No recent activity
                </p>

                <p className="mt-1 max-w-xs text-xs leading-5 text-slate-400">
                  Your negotiations will appear here.
                </p>
              </div>
            ) : (
              <div className="mt-6 space-y-4">
                {recentNegotiations.map((negotiation) => (
                  <Link
                    key={negotiation.id}
                    to="/app/negotiations"
                    className="block rounded-xl border border-slate-100 p-4 transition hover:border-blue-100 hover:bg-slate-50"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-slate-900">
                          {negotiation.landName}
                        </p>

                        <p className="mt-1 text-xs text-slate-500">
                          {negotiation.type === "received"
                            ? `Offer from ${negotiation.person}`
                            : `Offer sent to ${negotiation.person}`}
                        </p>
                      </div>

                      <span className="rounded-lg bg-amber-50 px-2 py-1 text-xs font-semibold text-amber-700">
                        {negotiation.status}
                      </span>
                    </div>

                    <p className="mt-3 text-sm font-semibold text-slate-900">
                      {new Intl.NumberFormat("pt-BR", {
                        style: "currency",
                        currency: "BRL",
                      }).format(negotiation.offer)}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        <section className="mt-8 overflow-hidden rounded-2xl bg-slate-900">
          <div className="relative px-8 py-10">
            <div className="relative z-10 max-w-2xl">
              <p className="text-sm font-semibold text-blue-400">
                Discover opportunities
              </p>

              <h2 className="mt-2 text-2xl font-bold text-white">
                Find land in the location that matters to you.
              </h2>

              <p className="mt-3 text-sm leading-6 text-slate-400">
                Use our interactive map to search for properties around
                a specific location and radius.
              </p>

              <Link
                to="/app/explore"
                className="mt-6 inline-flex rounded-lg bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Start exploring
              </Link>
            </div>

            <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="absolute -bottom-24 right-32 h-48 w-48 rounded-full bg-blue-500/10 blur-3xl" />
          </div>
        </section>
      </main>
    </div>
  );
}

export default observer(DashboardPage);

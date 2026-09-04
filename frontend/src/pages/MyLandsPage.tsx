import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { observer } from "mobx-react-lite";

import landStore from "../stores/landStore";
import Toast, { ToastType } from "../components/commons/Toast";
import ConfirmModal from "../components/commons/ConfirmModal";
import EditLandModal from "../components/land/LandEditModal";
import LandFilters, { type LandFilter } from "../components/land/LandFilters";
import LandCard from "../components/land/LandCard";
import type { Land } from "../types/land";

function MyLandsPage() {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const [landToDelete, setLandToDelete] = useState<number | null>(null);
  const [landToEdit, setLandToEdit] = useState<Land | null>(null);

  const [activeFilter, setActiveFilter] = useState<LandFilter>("ALL");

  useEffect(() => {
    landStore.getMyLands().catch((error) => {
      console.error("Failed to load lands:", error);
    });
  }, []);

  const filteredLands = useMemo(() => {
    if (activeFilter === "ALL") {
      return landStore.lands;
    }

    return landStore.lands.filter((land) => land.status === activeFilter);
  }, [activeFilter, landStore.lands]);

  async function handleDeleteLand(id: number) {
    try {
      await landStore.deleteLand(id);

      setToast({
        type: "success",
        message: "Land deleted successfully.",
      });
    } catch (error) {
      console.error("Failed to delete land:", error);

      setToast({
        type: "error",
        message: "Failed to delete land. Please try again.",
      });
    }
  }

  return (
    <>
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

            <nav className="hidden items-center gap-6 md:flex">
              <Link
                to="/app"
                className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
              >
                Dashboard
              </Link>

              <Link
                to="/app/explore"
                className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
              >
                Explore
              </Link>

              <Link
                to="/app/my-lands"
                className="text-sm font-semibold text-blue-600"
              >
                My Lands
              </Link>

              <Link
                to="/app/negotiations"
                className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
              >
                Negotiations
              </Link>

              <Link
                to="/app/profile"
                className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
              >
                Profile
              </Link>
            </nav>
          </div>
        </header>

        <main className="mx-auto max-w-7xl px-6 py-8">
          <section className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold text-blue-600">
                Your properties
              </p>

              <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
                My Lands
              </h1>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Manage the lands registered in your account.
              </p>
            </div>

            <Link
              to="/app/register-land"
              className="inline-flex w-fit items-center gap-2 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              <span className="text-lg leading-none">+</span>
              Register New Land
            </Link>
          </section>

          <LandFilters
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />

          {landStore.loading && (
            <div className="flex min-h-64 items-center justify-center rounded-2xl border border-slate-200 bg-white">
              <div className="text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

                <p className="mt-4 text-sm text-slate-500">
                  Loading your lands...
                </p>
              </div>
            </div>
          )}

          {!landStore.loading && landStore.error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 p-6">
              <h2 className="font-semibold text-red-800">
                Something went wrong
              </h2>

              <p className="mt-1 text-sm text-red-600">{landStore.error}</p>

              <button
                type="button"
                onClick={() => {
                  landStore.getMyLands().catch((error) => {
                    console.error("Failed to reload lands:", error);
                  });
                }}
                className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-red-700"
              >
                Try Again
              </button>
            </div>
          )}

          {!landStore.loading &&
            !landStore.error &&
            landStore.lands.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                  ▦
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">
                  No lands registered yet
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  You haven't registered any land yet. Start by selecting an
                  area on the map and adding your property's information.
                </p>

                <Link
                  to="/app/register-land"
                  className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  Register Your First Land
                </Link>
              </div>
            )}

          {!landStore.loading &&
            !landStore.error &&
            landStore.lands.length > 0 &&
            filteredLands.length === 0 && (
              <div className="rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-2xl text-slate-500">
                  ▦
                </div>

                <h2 className="mt-5 text-xl font-semibold text-slate-900">
                  No lands found
                </h2>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                  There are no lands matching the selected filter.
                </p>

                <button
                  type="button"
                  onClick={() => setActiveFilter("ALL")}
                  className="mt-6 rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
                >
                  View All Lands
                </button>
              </div>
            )}

          {!landStore.loading &&
            !landStore.error &&
            filteredLands.length > 0 && (
              <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {filteredLands.map((land) => (
                  <LandCard
                    key={land.id}
                    land={land}
                    onEdit={setLandToEdit}
                    onDelete={setLandToDelete}
                    loading={landStore.loading}
                  />
                ))}
              </section>
            )}
        </main>
      </div>

      {landToDelete !== null && (
        <ConfirmModal
          title="Delete land?"
          message="Are you sure you want to delete this land? This action cannot be undone."
          confirmText="Delete"
          cancelText="Cancel"
          onCancel={() => setLandToDelete(null)}
          onConfirm={async () => {
            const id = landToDelete;

            setLandToDelete(null);

            await handleDeleteLand(id);
          }}
        />
      )}

      {landToEdit && (
        <EditLandModal
          land={landToEdit}
          onClose={() => setLandToEdit(null)}
          onSave={async (data) => {
            try {
              await landStore.updateLand(landToEdit.id, data);

              setToast({
                type: "success",
                message: "Land updated successfully.",
              });

              setLandToEdit(null);
            } catch (error) {
              console.error("Failed to update land:", error);

              setToast({
                type: "error",
                message: "Failed to update land. Please try again.",
              });

              throw error;
            }
          }}
        />
      )}

      {toast && (
        <Toast
          type={toast.type}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
    </>
  );
}

export default observer(MyLandsPage);

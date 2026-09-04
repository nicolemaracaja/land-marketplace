import { useEffect, useState } from "react";

import { Link } from "react-router-dom";

import { observer } from "mobx-react-lite";

import landStore from "../stores/landStore";
import Toast, { ToastType } from "../components/commons/Toast";
import ConfirmModal from "../components/commons/ConfirmModal";
import { Land } from "../types/land";
import EditLandModal from "../components/land/LandEditModal";

function MyLandsPage() {
  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  const [landToDelete, setLandToDelete] = useState<number | null>(null);
  const [landToEdit, setLandToEdit] = useState<Land | null>(null);

  useEffect(() => {
    landStore.getMyLands().catch((error) => {
      console.error("Failed to load lands:", error);
    });
  }, []);

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

          <section className="mb-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white"
              >
                All
              </button>

              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                For Sale
              </button>

              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Negotiation
              </button>

              <button
                type="button"
                className="rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
              >
                Sold
              </button>
            </div>
          </section>

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
            landStore.lands.length > 0 && (
              <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {landStore.lands.map((land) => (
                  <article
                    key={land.id}
                    className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-1 hover:shadow-md"
                  >
                    <div className="relative h-40 overflow-hidden bg-slate-100">
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,#e2e8f0_25%,transparent_25%),linear-gradient(225deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(315deg,#e2e8f0_25%,#f8fafc_25%)] bg-[length:60px_60px] opacity-70" />

                      <div className="absolute left-[25%] top-[25%] h-24 w-32 rotate-[-8deg] rounded-lg border-2 border-blue-500 bg-blue-500/20" />

                      <div className="absolute right-4 top-4 rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700">
                        Available
                      </div>

                      <div className="absolute bottom-4 left-4 rounded-lg bg-white px-3 py-2 text-xs font-medium text-slate-600 shadow-sm">
                        Land #{land.id}
                      </div>
                    </div>

                    <div className="p-5">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h2 className="font-semibold text-slate-900">
                            {land.name}
                          </h2>

                          <p className="mt-1 text-xs text-slate-400">
                            Property #{land.id}
                          </p>
                        </div>

                        <span className="rounded-lg bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
                          For Sale
                        </span>
                      </div>

                      <p className="mt-4 line-clamp-2 text-sm leading-6 text-slate-500">
                        {land.description}
                      </p>

                      <div className="mt-5 border-t border-slate-100 pt-4">
                        <p className="text-xs font-medium text-slate-400">
                          Price
                        </p>

                        <p className="mt-1 text-xl font-bold text-slate-900">
                          {new Intl.NumberFormat("pt-BR", {
                            style: "currency",
                            currency: "BRL",
                          }).format(land.price)}
                        </p>
                      </div>

                      <div className="mt-5 flex gap-3">
                        <Link
                          to={`/app/explore?land=${land.id}`}
                          className="flex-1 rounded-lg border border-slate-200 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                        >
                          View
                        </Link>

                        <button
                          type="button"
                          onClick={() => setLandToEdit(land)}
                          className="flex-1 rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-blue-700"
                        >
                          Manage
                        </button>

                        <button
                          type="button"
                          disabled={landStore.loading}
                          onClick={() => setLandToDelete(land.id)}
                          className="rounded-lg border border-red-200 px-4 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-50"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </article>
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

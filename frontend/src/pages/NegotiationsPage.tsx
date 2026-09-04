import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { observer } from "mobx-react-lite";

import landService from "../services/landService";
import negotiationStore from "../stores/negotiationStore";

import type { Land } from "../types/land";
import type { Negotiation } from "../types/negotiation";

import NegotiationFilters, {
  NegotiationFilter,
} from "../components/negotiation/NegotiationFilters";
import NegotiationStats from "../components/negotiation/NegotiationStats";
import OfferModal from "../components/negotiation/OfferModal";
import NegotiationCard from "../components/negotiation/NegotiationCard";

function NegotiationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();

  const [selectedLand, setSelectedLand] = useState<Land | null>(null);
  const [selectedNegotiation, setSelectedNegotiation] =
    useState<Negotiation | null>(null);

  const [offer, setOffer] = useState("");

  const [activeFilter, setActiveFilter] = useState<NegotiationFilter>("ALL");

  const [loadingLand, setLoadingLand] = useState(false);
  const [loadingAction, setLoadingAction] = useState<number | null>(null);
  const [loadingOffer, setLoadingOffer] = useState(false);

  const [negotiationError, setNegotiationError] = useState<string | null>(null);

  const [landError, setLandError] = useState<string | null>(null);

  const negotiations = negotiationStore.negotiations;

  const loadingNegotiations = negotiationStore.loading;

  useEffect(() => {
    negotiationStore.getAll().catch((error) => {
      console.error("Failed to load negotiations:", error);
    });
  }, []);

  useEffect(() => {
    const landId = searchParams.get("land");

    if (!landId) {
      setSelectedLand(null);
      return;
    }

    const id = Number(landId);

    if (!Number.isInteger(id) || id <= 0) {
      setLandError("Invalid land.");
      return;
    }

    async function loadLand() {
      try {
        setLoadingLand(true);
        setLandError(null);

        const land = await landService.getById(id);

        setSelectedLand(land);
        setOffer(String(land.price));
      } catch (error) {
        console.error("Failed to load land:", error);

        setLandError("Failed to load land details.");
        setSelectedLand(null);
      } finally {
        setLoadingLand(false);
      }
    }

    loadLand();
  }, [searchParams]);

  const filteredNegotiations = useMemo(() => {
    switch (activeFilter) {
      case "RECEIVED":
        return negotiations.filter(
          (negotiation) => negotiation.type === "received",
        );

      case "SENT":
        return negotiations.filter(
          (negotiation) => negotiation.type === "sent",
        );

      case "PENDING":
        return negotiations.filter(
          (negotiation) => negotiation.status === "PENDING",
        );

      case "COMPLETED":
        return negotiations.filter(
          (negotiation) => negotiation.status !== "PENDING",
        );

      default:
        return negotiations;
    }
  }, [activeFilter, negotiations]);

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function closeOfferModal() {
    setSearchParams({});
    setSelectedLand(null);
    setOffer("");
    setLandError(null);
  }

  async function handleSendOffer() {
    if (!selectedLand) {
      return;
    }

    const numericOffer = Number(offer);

    if (!Number.isFinite(numericOffer) || numericOffer <= 0) {
      setLandError("Enter a valid offer.");
      return;
    }

    try {
      setLoadingOffer(true);
      setLandError(null);

      await negotiationStore.create(selectedLand.id, numericOffer);

      closeOfferModal();
    } catch (error: any) {
      console.error("Failed to send offer:", error);

      const message = error?.response?.data?.message ?? "Failed to send offer.";

      setLandError(message);
    } finally {
      setLoadingOffer(false);
    }
  }

  async function handleAccept(id: number) {
    try {
      setLoadingAction(id);
      setNegotiationError(null);

      await negotiationStore.accept(id);
    } catch (error: any) {
      console.error("Failed to accept negotiation:", error);

      setNegotiationError(
        error?.response?.data?.message ?? "Failed to accept negotiation.",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleReject(id: number) {
    try {
      setLoadingAction(id);
      setNegotiationError(null);

      await negotiationStore.reject(id);
    } catch (error: any) {
      console.error("Failed to reject negotiation:", error);

      setNegotiationError(
        error?.response?.data?.message ?? "Failed to reject negotiation.",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleCancel(id: number) {
    try {
      setLoadingAction(id);
      setNegotiationError(null);

      await negotiationStore.cancel(id);
    } catch (error: any) {
      console.error("Failed to cancel negotiation:", error);

      setNegotiationError(
        error?.response?.data?.message ?? "Failed to cancel negotiation.",
      );
    } finally {
      setLoadingAction(null);
    }
  }

  async function handleViewDetails(id: number) {
    try {
      setNegotiationError(null);

      const negotiation = await negotiationStore.getById(id);

      setSelectedNegotiation(negotiation);
    } catch (error: any) {
      console.error("Failed to load negotiation details:", error);

      setNegotiationError(
        error?.response?.data?.message ?? "Failed to load negotiation details.",
      );
    }
  }

  function getStatusLabel(status: Negotiation["status"]) {
    switch (status) {
      case "PENDING":
        return "Pending";

      case "ACCEPTED":
        return "Accepted";

      case "REJECTED":
        return "Rejected";

      case "CANCELLED":
        return "Cancelled";

      default:
        return status;
    }
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
              className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              My Lands
            </Link>

            <Link
              to="/app/negotiations"
              className="text-sm font-semibold text-blue-600"
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
        <section className="mb-8">
          <p className="text-sm font-semibold text-blue-600">Marketplace</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Negotiations
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
            Keep track of your offers and negotiations with land owners and
            potential buyers.
          </p>
        </section>

        <NegotiationStats negotiations={negotiations} />

        <NegotiationFilters
          activeFilter={activeFilter}
          onFilterChange={setActiveFilter}
        />

        {negotiationError && (
          <section className="mt-6 rounded-2xl border border-red-200 bg-red-50 px-6 py-4">
            <p className="text-sm font-medium text-red-600">
              {negotiationError}
            </p>
          </section>
        )}

        {loadingNegotiations && negotiations.length === 0 && (
          <section className="mt-6 rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
            <p className="text-sm text-slate-500">Loading negotiations...</p>
          </section>
        )}

        {!loadingNegotiations &&
          !negotiationError &&
          negotiations.length === 0 && (
            <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-50 text-2xl text-blue-600">
                ↔
              </div>

              <h2 className="mt-5 text-xl font-semibold text-slate-900">
                No negotiations yet
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                When you make an offer or receive one from another user, your
                negotiations will appear here.
              </p>

              <Link
                to="/app/explore"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Explore Lands
              </Link>
            </section>
          )}

        {!loadingNegotiations &&
          negotiations.length > 0 &&
          filteredNegotiations.length === 0 && (
            <section className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white px-6 py-16 text-center">
              <h2 className="text-xl font-semibold text-slate-900">
                No negotiations found
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                There are no negotiations matching this filter.
              </p>
            </section>
          )}

        {!loadingNegotiations && filteredNegotiations.length > 0 && (
          <section className="mt-6 space-y-4">
            {filteredNegotiations.map((negotiation) => (
              <NegotiationCard
                key={negotiation.id}
                negotiation={negotiation}
                loading={loadingAction === negotiation.id}
                onAccept={handleAccept}
                onReject={handleReject}
                onCancel={handleCancel}
                onViewDetails={handleViewDetails}
              />
            ))}
          </section>
        )}

        <section className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white text-blue-600 shadow-sm">
              i
            </div>

            <div>
              <h2 className="font-semibold text-slate-900">
                About negotiations
              </h2>

              <p className="mt-1 max-w-3xl text-sm leading-6 text-slate-600">
                Negotiations allow buyers and land owners to discuss offers
                before completing a transaction. You can track the status of
                every offer from this page.
              </p>
            </div>
          </div>
        </section>
      </main>

      {loadingLand && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="py-8 text-center">
              <p className="text-sm text-slate-500">Loading land details...</p>
            </div>
          </div>
        </div>
      )}

      {!loadingLand && selectedLand && (
        <OfferModal
          land={selectedLand}
          offer={offer}
          loading={loadingOffer}
          error={landError}
          onOfferChange={setOffer}
          onSubmit={handleSendOffer}
          onClose={closeOfferModal}
        />
      )}

      {selectedNegotiation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 px-4">
          <div className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-blue-600">
                  Negotiation Details
                </p>

                <h2 className="mt-1 text-2xl font-bold text-slate-900">
                  {selectedNegotiation.landName}
                </h2>
              </div>

              <button
                type="button"
                onClick={() => setSelectedNegotiation(null)}
                className="rounded-lg px-3 py-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-700"
              >
                ✕
              </button>
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <p className="text-xs font-medium text-slate-400">Person</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {selectedNegotiation.person}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Land price</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {formatCurrency(selectedNegotiation.landPrice)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Offer</p>

                <p className="mt-1 font-semibold text-blue-600">
                  {formatCurrency(selectedNegotiation.offer)}
                </p>
              </div>

              <div>
                <p className="text-xs font-medium text-slate-400">Status</p>

                <p className="mt-1 font-semibold text-slate-900">
                  {getStatusLabel(selectedNegotiation.status)}
                </p>
              </div>
            </div>

            <div className="mt-6 flex justify-end">
              <button
                type="button"
                onClick={() => setSelectedNegotiation(null)}
                className="rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default observer(NegotiationsPage);

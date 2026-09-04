import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import api from "../services/api";

type UserProfile = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketplaceUpdates, setMarketplaceUpdates] = useState(false);

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await api.get<UserProfile>("/auth/me");
        setProfile(response.data);
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  function formatDate(date: string) {
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "long",
    }).format(new Date(date));
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
              className="text-sm font-medium text-slate-500 transition hover:text-blue-600"
            >
              Negotiations
            </Link>

            <Link
              to="/app/profile"
              className="text-sm font-semibold text-blue-600"
            >
              Profile
            </Link>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        <section className="mb-8">
          <p className="text-sm font-semibold text-blue-600">Account</p>

          <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900">
            Profile
          </h1>

          <p className="mt-2 text-sm leading-6 text-slate-500">
            Manage your account information and preferences.
          </p>
        </section>

        {loading && (
          <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <div className="flex items-center gap-4">
              <div className="h-14 w-14 animate-pulse rounded-full bg-slate-200" />

              <div className="space-y-2">
                <div className="h-4 w-40 animate-pulse rounded bg-slate-200" />
                <div className="h-3 w-56 animate-pulse rounded bg-slate-200" />
              </div>
            </div>
          </div>
        )}

        {!loading && profile && (
          <div className="space-y-6">
            <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="h-32 bg-slate-900">
                <div className="h-full bg-[radial-gradient(circle_at_top_right,_rgba(37,99,235,0.45),_transparent_45%)]" />
              </div>
              <div className="px-6 pb-6 sm:px-8">
                <div className="relative">
                  <div className="-mt-10 flex items-end justify-between">
                    <div className="flex h-20 w-20 items-center justify-center rounded-2xl border-4 border-white bg-blue-100 text-2xl font-bold text-blue-700 shadow-sm">
                      {profile.name.charAt(0).toUpperCase()}
                    </div>

                    <span className="mb-2 w-fit rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                      Active account
                    </span>
                  </div>

                  <div className="mt-4">
                    <h2 className="text-xl font-bold text-slate-900">
                      {profile.name}
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                      {profile.email}
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Personal information
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Information associated with your Land Marketplace account.
                </p>
              </div>

              <div className="mt-6 grid gap-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Full name
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {profile.name}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Email address
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {profile.email}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Account ID
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    #{profile.id}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                    Member since
                  </p>

                  <p className="mt-2 text-sm font-medium text-slate-900">
                    {formatDate(profile.createdAt)}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
              <div className="border-b border-slate-100 pb-5">
                <h2 className="text-lg font-semibold text-slate-900">
                  Account settings
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                  Manage your account preferences.
                </p>
              </div>

              <div className="divide-y divide-slate-100">
                <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Email notifications
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Receive updates about your lands and negotiations.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setEmailNotifications((current) => !current)}
                    className={`relative h-6 w-11 rounded-full transition ${
                      emailNotifications ? "bg-blue-600" : "bg-slate-300"
                    }`}
                    aria-label="Toggle email notifications"
                    aria-pressed={emailNotifications}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        emailNotifications ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>

                <div className="flex flex-col gap-4 py-5 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">
                      Marketplace updates
                    </h3>

                    <p className="mt-1 text-sm text-slate-500">
                      Stay informed about new opportunities and listings.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setMarketplaceUpdates((current) => !current)}
                    className={`relative h-6 w-11 rounded-full transition ${
                      marketplaceUpdates ? "bg-blue-600" : "bg-slate-300"
                    }`}
                    aria-label="Toggle marketplace updates"
                    aria-pressed={marketplaceUpdates}
                  >
                    <span
                      className={`absolute top-1 h-4 w-4 rounded-full bg-white shadow-sm transition ${
                        marketplaceUpdates ? "right-1" : "left-1"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </section>

            <section className="grid gap-4 sm:grid-cols-3">
              <Link
                to="/app/my-lands"
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">My Lands</p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Manage your registered properties.
                </p>
              </Link>

              <Link
                to="/app/explore"
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">Explore</p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Find available lands around you.
                </p>
              </Link>

              <Link
                to="/app/negotiations"
                className="rounded-xl border border-slate-200 bg-white p-5 transition hover:border-blue-200 hover:shadow-sm"
              >
                <p className="text-sm font-semibold text-slate-900">
                  Negotiations
                </p>

                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Track your offers and negotiations.
                </p>
              </Link>
            </section>
          </div>
        )}

        {!loading && !profile && (
          <section className="rounded-2xl border border-red-200 bg-red-50 p-8 text-center">
            <h2 className="font-semibold text-red-800">
              Unable to load your profile
            </h2>

            <p className="mt-2 text-sm text-red-600">Please try again later.</p>

            <Link
              to="/app"
              className="mt-5 inline-flex rounded-lg bg-red-600 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700"
            >
              Back to Dashboard
            </Link>
          </section>
        )}
      </main>
    </div>
  );
}

export default ProfilePage;

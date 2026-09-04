import { Link } from "react-router-dom";

function HomePage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              L
            </div>

            <span className="text-xl font-bold tracking-tight">
              Land Marketplace
            </span>
          </Link>

          <nav className="hidden items-center gap-8 md:flex">
            <Link
              to="/"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Home
            </Link>

            <Link
              to="/app/explore"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Explore Lands
            </Link>

            <Link
              to="/login"
              className="text-sm font-medium text-slate-600 transition hover:text-blue-600"
            >
              Login
            </Link>

            <Link
              to="/login"
              className="rounded-lg bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700"
            >
              Get Started
            </Link>
          </nav>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-7xl px-6 pb-20 pt-16 lg:pb-28 lg:pt-24">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <span className="inline-flex rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600">
                The smarter way to find land
              </span>

              <h1 className="mt-6 max-w-2xl text-4xl font-bold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
                Find the perfect land for your next project.
              </h1>

              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Discover available lands, explore their exact location on the
                map, and connect directly with owners.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  to="/app/explore"
                  className="rounded-xl bg-blue-600 px-6 py-3.5 text-center text-sm font-semibold text-white shadow-lg shadow-blue-600/20 transition hover:bg-blue-700"
                >
                  Explore Lands
                </Link>

                <Link
                  to="/login"
                  className="rounded-xl border border-slate-300 bg-white px-6 py-3.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400 hover:bg-slate-50"
                >
                  List Your Land
                </Link>
              </div>

              <div className="mt-10 flex flex-wrap gap-8">
                <div>
                  <p className="text-2xl font-bold text-slate-900">100%</p>
                  <p className="mt-1 text-sm text-slate-500">Location-based</p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">Secure</p>
                  <p className="mt-1 text-sm text-slate-500">
                    Direct negotiations
                  </p>
                </div>

                <div>
                  <p className="text-2xl font-bold text-slate-900">Simple</p>
                  <p className="mt-1 text-sm text-slate-500">Easy to use</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute -inset-4 rounded-[2rem] bg-blue-100/50 blur-2xl" />

              <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-3 shadow-2xl shadow-slate-900/10">
                <div className="relative h-[420px] overflow-hidden rounded-2xl bg-slate-100">
                  <div className="absolute inset-0 bg-[linear-gradient(135deg,#e2e8f0_25%,transparent_25%),linear-gradient(225deg,#e2e8f0_25%,transparent_25%),linear-gradient(45deg,#e2e8f0_25%,transparent_25%),linear-gradient(315deg,#e2e8f0_25%,#f8fafc_25%)] bg-[length:80px_80px] opacity-70" />

                  <div className="absolute left-[-10%] top-[45%] h-8 w-[120%] rotate-[-12deg] bg-white shadow-sm" />
                  <div className="absolute left-[45%] top-[-10%] h-[120%] w-7 rotate-[18deg] bg-white shadow-sm" />
                  <div className="absolute left-[-10%] top-[65%] h-5 w-[120%] rotate-[8deg] bg-white" />

                  <div className="absolute left-[15%] top-[20%] h-32 w-40 rotate-[-8deg] rounded-lg border-2 border-blue-500 bg-blue-500/20" />

                  <div className="absolute right-[12%] top-[28%] h-36 w-44 rotate-[12deg] rounded-lg border-2 border-emerald-500 bg-emerald-500/20" />

                  <div className="absolute bottom-[12%] left-[28%] h-28 w-36 rotate-[5deg] rounded-lg border-2 border-amber-500 bg-amber-500/20" />

                  <div className="absolute left-[52%] top-[48%] flex -translate-x-1/2 -translate-y-1/2 flex-col items-center">
                    <div className="rounded-full bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white shadow-lg">
                      Available Land
                    </div>

                    <div className="mt-1 h-4 w-4 rotate-45 bg-blue-600" />
                  </div>

                  <div className="absolute right-4 top-4 flex flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-md">
                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center border-b border-slate-200 text-lg text-slate-600"
                    >
                      +
                    </button>

                    <button
                      type="button"
                      className="flex h-10 w-10 items-center justify-center text-lg text-slate-600"
                    >
                      −
                    </button>
                  </div>

                  <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-xs font-medium text-slate-500">
                          Explore nearby
                        </p>

                        <p className="mt-1 text-sm font-semibold text-slate-900">
                          Find lands on the map
                        </p>
                      </div>

                      <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50 text-blue-600">
                        ↗
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-y border-slate-200 bg-white">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="text-center">
              <p className="text-sm font-semibold uppercase tracking-wider text-blue-600">
                How it works
              </p>

              <h2 className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                Find your next opportunity in three steps
              </h2>

              <p className="mx-auto mt-4 max-w-2xl text-slate-600">
                A simple experience designed to make discovering and negotiating
                land easier.
              </p>
            </div>

            <div className="mt-12 grid gap-8 md:grid-cols-3">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                  01
                </div>

                <h3 className="mt-6 text-xl font-semibold">Find</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Explore available lands using an interactive map and search
                  exactly where you want.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                  02
                </div>

                <h3 className="mt-6 text-xl font-semibold">Choose</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Compare properties, view their details and understand exactly
                  where each land is located.
                </p>
              </div>

              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100 font-bold text-blue-600">
                  03
                </div>

                <h3 className="mt-6 text-xl font-semibold">Negotiate</h3>

                <p className="mt-3 leading-7 text-slate-600">
                  Connect with the owner and start a negotiation for the land
                  that fits your project.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section className="bg-slate-900">
          <div className="mx-auto max-w-7xl px-6 py-20">
            <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-center">
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Ready to find your next piece of land?
                </h2>

                <p className="mt-3 max-w-xl text-slate-400">
                  Explore available properties and discover opportunities around
                  you.
                </p>
              </div>

              <Link
                to="/app/explore"
                className="shrink-0 rounded-xl bg-blue-600 px-6 py-3.5 text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                Explore Lands
              </Link>
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-slate-950">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-6 py-8 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Land Marketplace</p>

          <p>Find. Choose. Negotiate.</p>
        </div>
      </footer>
    </div>
  );
}

export default HomePage;

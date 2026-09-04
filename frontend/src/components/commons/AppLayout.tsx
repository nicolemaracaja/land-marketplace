import { Link, NavLink, Outlet, useNavigate } from "react-router-dom";
import { observer } from "mobx-react-lite";
import authStore from "../../stores/authStore";

function AppLayout() {
  const navigate = useNavigate();

  async function handleLogout() {
    await authStore.logout();
    navigate("/login", { replace: true });
  }

  const navigation = [
    {
      label: "Dashboard",
      path: "/app",
    },
    {
      label: "Explore Lands",
      path: "/app/explore",
    },
    {
      label: "My Lands",
      path: "/app/my-lands",
    },
    {
      label: "Negotiations",
      path: "/app/negotiations",
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-64 border-r border-slate-200 bg-white lg:flex lg:flex-col">
        <div className="flex h-20 items-center border-b border-slate-100 px-6">
          <Link to="/app" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white shadow-sm">
              L
            </div>

            <div>
              <p className="text-sm font-bold text-slate-900">
                Land Marketplace
              </p>

              <p className="text-xs text-slate-400">Property platform</p>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 py-6">
          <p className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Marketplace
          </p>

          <div className="space-y-1">
            {navigation.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/app"}
                className={({ isActive }) =>
                  [
                    "flex items-center rounded-xl px-3 py-3 text-sm font-medium transition",
                    isActive
                      ? "bg-blue-50 text-blue-700"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                  ].join(" ")
                }
              >
                {item.label}
              </NavLink>
            ))}
          </div>

          <p className="mb-3 mt-8 px-3 text-xs font-semibold uppercase tracking-wider text-slate-400">
            Account
          </p>

          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              [
                "flex items-center rounded-xl px-3 py-3 text-sm font-medium transition",
                isActive
                  ? "bg-blue-50 text-blue-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
              ].join(" ")
            }
          >
            Profile
          </NavLink>
        </nav>

        <div className="border-t border-slate-100 p-4">
          <div className="mb-3 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">
              {authStore.user?.name?.charAt(0).toUpperCase()}
            </div>

            <div className="min-w-0">
              <p className="truncate text-sm font-semibold text-slate-900">
                {authStore.user?.name}
              </p>

              <p className="truncate text-xs text-slate-500">
                {authStore.user?.email}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="w-full rounded-xl px-3 py-2.5 text-left text-sm font-medium text-slate-500 transition hover:bg-red-50 hover:text-red-600"
          >
            Sign out
          </button>
        </div>
      </aside>

      <header className="sticky top-0 z-30 border-b border-slate-200 bg-white lg:hidden">
        <div className="flex h-16 items-center justify-between px-4">
          <Link to="/app" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white">
              L
            </div>

            <span className="text-sm font-bold text-slate-900">
              Land Marketplace
            </span>
          </Link>

          <button
            type="button"
            onClick={handleLogout}
            className="rounded-lg px-3 py-2 text-sm font-medium text-slate-500 hover:bg-red-50 hover:text-red-600"
          >
            Sign out
          </button>
        </div>

        <nav className="flex gap-1 overflow-x-auto border-t border-slate-100 px-3 py-2">
          {navigation.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/app"}
              className={({ isActive }) =>
                [
                  "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium",
                  isActive ? "bg-blue-50 text-blue-700" : "text-slate-500",
                ].join(" ")
              }
            >
              {item.label}
            </NavLink>
          ))}

          <NavLink
            to="/app/profile"
            className={({ isActive }) =>
              [
                "whitespace-nowrap rounded-lg px-3 py-2 text-xs font-medium",
                isActive ? "bg-blue-50 text-blue-700" : "text-slate-500",
              ].join(" ")
            }
          >
            Profile
          </NavLink>
        </nav>
      </header>

      <main className="min-h-screen lg:ml-64">
        <Outlet />
      </main>
    </div>
  );
}

export default observer(AppLayout);

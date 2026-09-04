import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../services/api";
import authStore from "../../stores/authStore";
import Toast, { ToastType } from "../commons/Toast";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{
    type: ToastType;
    message: string;
  } | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setLoading(true);

    try {
      await api.post("/auth/login", {
        email,
        password,
      });

      await authStore.loadUser();

      navigate("/app", { replace: true });
    } catch (error) {
      console.error("Login failed:", error);

      setToast({
        type: "error",
        message: "Invalid email or password.",
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <div className="flex min-h-screen bg-slate-50">
        <div className="hidden flex-1 flex-col justify-between bg-slate-950 p-12 lg:flex">
          <Link to="/" className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
              L
            </div>

            <span className="text-xl font-bold tracking-tight text-white">
              Land Marketplace
            </span>
          </Link>

          <div className="max-w-lg">
            <p className="text-sm font-semibold uppercase tracking-wider text-blue-400">
              Your property marketplace
            </p>

            <h1 className="mt-4 text-5xl font-bold leading-tight tracking-tight text-white">
              Find the right land for your next project.
            </h1>

            <p className="mt-6 text-base leading-7 text-slate-400">
              Explore available properties, manage your lands and negotiate
              directly through a modern and secure marketplace.
            </p>
          </div>

          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} Land Marketplace
          </p>
        </div>

        <div className="flex w-full items-center justify-center px-6 py-12 lg:w-[520px] lg:px-12">
          <div className="w-full max-w-md">
            <div className="mb-8 lg:hidden">
              <Link to="/" className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-lg font-bold text-white">
                  L
                </div>

                <span className="text-xl font-bold tracking-tight text-slate-900">
                  Land Marketplace
                </span>
              </Link>
            </div>

            <div>
              <p className="text-sm font-semibold text-blue-600">
                Welcome back
              </p>

              <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Sign in to your account
              </h2>

              <p className="mt-2 text-sm leading-6 text-slate-500">
                Access your properties, negotiations and marketplace tools.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-5">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold text-slate-700"
                >
                  Email address
                </label>

                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  required
                  placeholder="you@example.com"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <div className="flex items-center justify-between">
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-slate-700"
                  >
                    Password
                  </label>

                  <button
                    type="button"
                    className="text-xs font-semibold text-blue-600 hover:text-blue-700"
                    onClick={() =>
                      setToast({
                        type: "info",
                        message: "Password recovery will be available soon.",
                      })
                    }
                  >
                    Forgot password?
                  </button>
                </div>

                <input
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                  placeholder="Enter your password"
                  className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <div className="mt-8 border-t border-slate-200 pt-6 text-center">
              <p className="text-sm text-slate-500">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-semibold text-blue-600 hover:text-blue-700"
                >
                  Create an account
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
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

export default Login;

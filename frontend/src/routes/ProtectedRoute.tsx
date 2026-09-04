import { Navigate, Outlet } from "react-router-dom";
import { observer } from "mobx-react-lite";

import authStore from "../stores/authStore";

function ProtectedRoute() {
  if (authStore.loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-slate-50">
        <div className="text-center">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-blue-600" />

          <p className="mt-4 text-sm font-medium text-slate-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (!authStore.isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}

export default observer(ProtectedRoute);

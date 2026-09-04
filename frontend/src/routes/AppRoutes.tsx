import { Navigate, Route, Routes } from "react-router-dom";

import Home from "../pages/HomePage";
import Dashboard from "../pages/DashboardPage";
import Explore from "../pages/ExplorePage";
import MyLands from "../pages/MyLandsPage";
import Negotiations from "../pages/NegotiationsPage";
import Profile from "../pages/ProfilePage";
import RegisterLand from "../pages/RegisterLandPage";

import ProtectedRoute from "./ProtectedRoute";
import Register from "../components/auth/Register";
import Login from "../components/auth/Login";
import AppLayout from "../components/commons/AppLayout";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/app" element={<Dashboard />} />
          <Route path="/app/explore" element={<Explore />} />
          <Route path="/app/my-lands" element={<MyLands />} />
          <Route path="/app/register-land" element={<RegisterLand />} />
          <Route path="/app/negotiations" element={<Negotiations />} />
          <Route path="/app/profile" element={<Profile />} />
        </Route>
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;

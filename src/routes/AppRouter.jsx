import { Navigate, Route, Routes } from "react-router-dom";
import AdminDashboardPage from "../pages/AdminDashboardPage";
import LoginPage from "../pages/LoginPage";
import PlayerDashboardPage from "../pages/PlayerDashboardPage";
import QuizPlayPage from "../pages/QuizPlayPage";
import RegisterPage from "../pages/RegisterPage";
import ResultPage from "../pages/ResultPage";
import TournamentDetailsPage from "../pages/TournamentDetailsPage";
import ProtectedRoute from "./ProtectedRoute";

export default function AppRouter() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/admin"
        element={
          <ProtectedRoute requiredRole="admin">
            <AdminDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/tournaments/:tournamentId"
        element={
          <ProtectedRoute requiredRole="admin">
            <TournamentDetailsPage mode="admin" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/player"
        element={
          <ProtectedRoute requiredRole="player">
            <PlayerDashboardPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/player/tournaments/:tournamentId"
        element={
          <ProtectedRoute requiredRole="player">
            <TournamentDetailsPage mode="player" />
          </ProtectedRoute>
        }
      />
      <Route
        path="/player/tournaments/:tournamentId/play"
        element={
          <ProtectedRoute requiredRole="player">
            <QuizPlayPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/player/tournaments/:tournamentId/result"
        element={
          <ProtectedRoute requiredRole="player">
            <ResultPage />
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

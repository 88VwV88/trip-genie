import { Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./context/AuthContext";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import GenerateTripPage from "./pages/GenerateTripPage";
import TripDetailsPage from "./pages/TripDetailsPage";
import SavedTripsPage from "./pages/SavedTripsPage";
import SharedTripPage from "./pages/SharedTripPage";
import WallCalendarPage from "./pages/WallCalendarPage";

function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" toastOptions={{ duration: 2800 }} />
      <Layout>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route
            path="/generate"
            element={
              <ProtectedRoute>
                <GenerateTripPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/trips/:id"
            element={
              <ProtectedRoute>
                <TripDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/saved-trips"
            element={
              <ProtectedRoute>
                <SavedTripsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/shared/:token" element={<SharedTripPage />} />
          <Route path="/wall-calendar" element={<WallCalendarPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Layout>
    </AuthProvider>
  );
}

export default App;

"use client";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./contexts/AuthContext";
import Login from "./pages/Login/Login";
import DashboardLayout from "./layouts/DashboardLayout/DashboardLayout";
import DashboardOverview from "./pages/DashboardOverview/DashboardOverview";
import TourPackageDetailEnquiries from "./pages/TourPackageDetailEnquiries/TourPackageDetailEnquiries";
import CarRentalDetailEnquiries from "./pages/CarRentalDetailEnquiries/CarRentalDetailEnquiries";
import ContactFormSubmissions from "./pages/ContactFormSubmissions/ContactFormSubmissions";
import EnquireCarRentalDashboard from "./pages/EnquireCarRental/EnquireCarRentalDashboard";
import EnquireHotelDashboard from "./pages/EnquireHotel/EnquireHotelDashboard";
import HomeEnquiriesDashboard from "./pages/HomeEnquiries/HomeEnquiriesDashboard";
import AddHotel from "./pages/AddHotel/AddHotel";
import "./App.css";
import AddCarRental from "./pages/AddCarRental/AddCarRental";

// Protected route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

const AuthenticatedRedirect = ({ children }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <Navigate to="/" replace /> : children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Redirect authenticated users away from login page */}
          <Route
            path="/login"
            element={
              <AuthenticatedRedirect>
                <Login />
              </AuthenticatedRedirect>
            }
          />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardOverview />} />
            <Route path="home-enquiries" element={<HomeEnquiriesDashboard />} />
            <Route
              path="tour-package-detail-enquiries"
              element={<TourPackageDetailEnquiries />}
            />
            <Route
              path="car-rental-detail-enquiries"
              element={<CarRentalDetailEnquiries />}
            />
            <Route
              path="contact-form-submissions"
              element={<ContactFormSubmissions />}
            />
            <Route
              path="/dashboard/car-enquiries"
              element={<EnquireCarRentalDashboard />}
            />
            <Route
              path="/dashboard/hotel-enquiries"
              element={<EnquireHotelDashboard />}
            />
            <Route path="/add-hotel" element={<AddHotel />} />
            <Route path="/add-car-rental" element={<AddCarRental />} />
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;

import React, { Suspense, lazy } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import PrivateRoute from "./components/PrivateRoute";
import PageTransition from "./components/PageTransition";

// Lazy-loaded components
const Home = lazy(() => import("./pages/Home"));
const Solutions = lazy(() => import("./pages/Solutions"));
const SolutionDetails = lazy(() => import("./pages/SolutionDetails"));
const Feedback = lazy(() => import("./pages/Feedback"));
const UpcomingEvents = lazy(() => import("./components/UpcomingEvents"));
const About = lazy(() => import("./pages/About"));
const ContactUs = lazy(() => import("./pages/ContactUs"));
const PhotoGallery = lazy(() => import("./pages/PhotoGallery"));
const LoginPage = lazy(() => import("./admin/pages/LoginPage"));
const AdminDashboard = lazy(() => import("./admin/pages/Dashboard"));
const Inquiries = lazy(() => import("./admin/pages/Inquiries"));
const FeedbackAdmin = lazy(() => import("./admin/pages/Feedback"));
const SolutionsAdmin = lazy(() => import("./admin/pages/Solutions"));
const PhotoGalleryAdmin = lazy(() => import("./admin/pages/PhotoGallery"));
const UpcomingEventsAdmin = lazy(() => import("./admin/pages/UpcomingEvents"));
const AboutAdmin = lazy(() => import("./admin/pages/About"));
const Admins = lazy(() => import("./admin/pages/Admins"));

// Public Layout
const PublicLayout = ({ children }) => (
  <div className="font-sans antialiased bg-gray-50">
    <Navbar />
    {children}
    <Footer />
  </div>
);

const App = () => {
  return (
    <Router>
      <Suspense
        fallback={
          <div className="min-h-screen flex items-center justify-center">
            <p className="text-lg font-medium text-gray-600">Loading...</p>
          </div>
        }
      >
        <Routes>
          {/* Public Routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
          <Route
            path="/"
            element={
              <PublicLayout>
                <PageTransition>
                  <Home />
                </PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/solutions"
            element={
              <PublicLayout>
                <PageTransition>
                  <Solutions />
                </PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/solutions/:id"
            element={
              <PublicLayout>
                <PageTransition>
                  <SolutionDetails />
                </PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/about"
            element={
              <PublicLayout>
                <PageTransition>
                  <About />
                </PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/photo-gallery"
            element={
              <PublicLayout>
                <PageTransition>
                  <PhotoGallery />
                </PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/contact-us"
            element={
              <PublicLayout>
                <PageTransition>
                  <ContactUs />
                </PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/feedback"
            element={
              <PublicLayout>
                <PageTransition>
                  <Feedback />
                </PageTransition>
              </PublicLayout>
            }
          />
          <Route
            path="/upcoming-events"
            element={
              <PublicLayout>
                <PageTransition>
                  <UpcomingEvents />
                </PageTransition>
              </PublicLayout>
            }
          />

          {/* Admin Routes */}
          <Route path="/admin/" element={<LoginPage />} />
          <Route
            path="/admin/dashboard"
            element={
              <PrivateRoute>
                <AdminDashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/inquiries"
            element={
              <PrivateRoute>
                <Inquiries />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/feedback"
            element={
              <PrivateRoute>
                <FeedbackAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/solutions"
            element={
              <PrivateRoute>
                <SolutionsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/solutions/:id"
            element={
              <PrivateRoute>
                <SolutionDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/gallery"
            element={
              <PrivateRoute>
                <PhotoGalleryAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/events"
            element={
              <PrivateRoute>
                <UpcomingEventsAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/about"
            element={
              <PrivateRoute>
                <AboutAdmin />
              </PrivateRoute>
            }
          />
          <Route
            path="/admin/admins"
            element={
              <PrivateRoute>
                <Admins />
              </PrivateRoute>
            }
          />
        </Routes>
      </Suspense>
    </Router>
  );
};

export default App;

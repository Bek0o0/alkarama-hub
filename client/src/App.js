import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import PublicReports from "./pages/PublicReports";
import SubmitReport from "./pages/SubmitReport";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Profile from "./pages/Profile";
import MyReports from "./pages/MyReports";
import Admin from "./pages/Admin";
import PrivacyTerms from "./pages/PrivacyTerms";
import ForgotPassword from "./pages/ForgotPassword";
<<<<<<< HEAD
import Projects from "./pages/Projects";
import PublicReports from "./pages/PublicReports";
import PrivacyTerms from "./pages/PrivacyTerms";
import { getUserRole } from "./utils/auth";
import bg from "./assets/bg.jpg";

function AppRoutes({ userRole, setUserRole }) {
  const location = useLocation();

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, [location, setUserRole]);

=======
import AdminUserView from "./pages/AdminSections/AdminUserView";

const RequireAuth = ({ children }) => {
  const email = localStorage.getItem("userEmail");
  return email ? children : <Navigate to="/login" replace />;
};

const RequireAdmin = ({ children }) => {
  const role = localStorage.getItem("userRole");
  return role === "admin" ? children : <Navigate to="/" replace />;
};

export default function App() {
  const userRole = localStorage.getItem("userRole") || "";

>>>>>>> dev
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar userRole={userRole} />
      <main className="flex-1">
        <Routes>
          {/* Public */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/privacy" element={<PrivacyTerms />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/public-reports" element={<PublicReports />} />
          <Route path="/privacy" element={<PrivacyTerms />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          {/* Auth-required */}
          <Route
            path="/submit-report"
            element={
              <RequireAuth>
                <SubmitReport />
              </RequireAuth>
            }
          />
          <Route
            path="/profile"
            element={
              <RequireAuth>
                <Profile />
              </RequireAuth>
            }
          />
<<<<<<< HEAD
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/public-reports" element={<PublicReports />} />
        </Routes>
      </main>
      <Footer />
    </>
  );
}

function App() {
  const [userRole, setUserRole] = useState(null);

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed"
      style={{ backgroundImage: `url(${bg})` }}
    >
      <div className="min-h-screen backdrop-blur-sm bg-white/80">
        <Router>
          <AppRoutes userRole={userRole} setUserRole={setUserRole} />
        </Router>
      </div>
=======
          <Route
            path="/my-reports"
            element={
              <RequireAuth>
                <MyReports />
              </RequireAuth>
            }
          />

          {/* Admin-only */}
          <Route
            path="/admin/*"
            element={
              <RequireAdmin>
                <Admin />
              </RequireAdmin>
            }
          />

          <Route
            path="/admin/user/:id"
            element={
              <RequireAdmin>
                <AdminUserView />
              </RequireAdmin>
            }
          />
          <Route
            path="/admin/user"
            element={
              <RequireAdmin>
                <AdminUserView />
              </RequireAdmin>
            }
          />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
>>>>>>> dev
    </div>
  );
}

import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import About from "./pages/About";
import Reports from "./pages/Reports";
import ProjectDetail from "./pages/ProjectDetail";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import SubmitReport from "./pages/SubmitReport";
import Admin from "./pages/Admin";
import MyReports from "./pages/MyReports";
import Profile from "./pages/Profile";
import ForgotPassword from "./pages/ForgotPassword";
import Projects from "./pages/Projects";
import { getUserRole } from "./utils/auth";
import bg from "./assets/bg.jpg";


function AppRoutes({ userRole, setUserRole }) {
  const location = useLocation();

  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
  }, [location]);

  return (
    <>
      <Navbar userRole={userRole} />
      <main className="min-h-[calc(100vh-64px)]">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/login" element={<Login setUserRole={setUserRole} />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/reports"
            element={["admin", "gov", "ngo"].includes(userRole) ? <Reports /> : <Navigate to="/login" />}
          />
          <Route
            path="/admin"
            element={userRole === "admin" ? <Admin /> : <Navigate to="/login" />}
          />
          <Route
            path="/submit-report"
            element={userRole === "user" ? <SubmitReport /> : <Navigate to="/login" />}
          />
          <Route
            path="/my-reports"
            element={userRole === "user" ? <MyReports /> : <Navigate to="/login" />}
          />
          <Route
            path="/profile"
            element={userRole === "user" ? <Profile /> : <Navigate to="/login" />}
          />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
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
    </div>
  );
}

export default App;

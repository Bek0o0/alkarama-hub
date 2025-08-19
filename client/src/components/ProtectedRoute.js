import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, roleRequired }) => {
  const role = localStorage.getItem("userRole");

  if (role !== roleRequired) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

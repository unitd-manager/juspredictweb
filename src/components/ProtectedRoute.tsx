import { useState, useEffect } from "react";
import { useLocation, Navigate } from "react-router-dom";
import { toast } from '../components/ui/Toast';
import { ReactNode } from "react";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const location = useLocation();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    setIsLoggedIn(!!token);
    setChecked(true);
  }, []);

  // ✅ SHOW TOAST BEFORE REDIRECT
  useEffect(() => {
    if (checked && !isLoggedIn) {
      toast.error("Please login to access this page");
    }
  }, [checked, isLoggedIn, location]);

  if (!checked) return null; // wait for auth check

  if (!isLoggedIn) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;

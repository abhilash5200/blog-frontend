import React, { useEffect } from "react";
import { Outlet } from "react-router";
import Header from "./Header";
import Footer from "./Footer";
import { useAuth } from "../stores/authStore";

function RootLayout() {
  const checkAuth = useAuth((state) => state.checkAuth);

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div>
      <Header />

      <div className="min-h-screen">
        <Outlet />
      </div>

      <Footer />
    </div>
  );
}

export default RootLayout;
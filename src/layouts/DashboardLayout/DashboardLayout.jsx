"use client";

import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar/Sidebar";
import Navbar from "../../components/Navbar/Navbar";
import { useAuth } from "../../contexts/AuthContext";
import "./DashboardLayout.css";

const DashboardLayout = () => {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="dashboard-container">
      <Sidebar
        isOpen={sidebarOpen}
        setSidebarOpen={setSidebarOpen}
        toggleSidebar={toggleSidebar}
      />

      <div className={`dashboard-content ${sidebarOpen ? "" : "expanded"}`}>
        <Navbar toggleSidebar={toggleSidebar} user={user} />

        <main className="dashboard-main">
          <Outlet />
        </main>

        <footer className="dashboard-footer">
          <div className="container-fluid">
            <div className="row">
              <div className="col-12">
                <p className="text-center mb-0">
                  &copy; {new Date().getFullYear()} RPS Tours Dashboard. All
                  rights reserved.
                </p>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default DashboardLayout;
